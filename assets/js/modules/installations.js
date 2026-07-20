const INSTALLATIONS_STORAGE_KEY =
  "hinet_demo_installations";

const INSTALLATION_EDITS_STORAGE_KEY =
  "hinet_demo_installation_edits";

const CLIENTS_STORAGE_KEY =
  "hinet_demo_clients";

const CLIENT_EDITS_STORAGE_KEY =
  "hinet_demo_client_edits";

const TECHNICIANS_STORAGE_KEY =
  "hinet_demo_technicians";

const DEMO_TECHNICIAN_IDS_BY_EMAIL = {
  "tecnico@hinet.com": "tech-victor"
};

const DEFAULT_TECHNICIANS = [
  {
    id: "tech-victor",
    name: "Víctor Técnico",
    specialty: "Soporte técnico"
  },
  {
    id: "tech-jose",
    name: "José Mendoza",
    specialty: "Instalación FTTH"
  },
  {
    id: "tech-luis",
    name: "Luis Quispe",
    specialty: "Redes"
  }
];

const DEFAULT_CLIENTS = [
  {
    id: "client-demo-3004",
    code: "C-3004",
    name: "Carlos Ramírez",
    email: "carlos@correo.com",
    phone: "987 654 321",
    address: "San Vicente de Cañete",
    plan: "Plan Hogar",
    status: "Activo",
    createdAt: "2026-07-15T18:30:00.000Z"
  },
  {
    id: "client-demo-3003",
    code: "C-3003",
    name: "María López",
    email: "maria@correo.com",
    phone: "965 321 456",
    address: "Imperial, Cañete",
    plan: "Plan Gamer",
    status: "Activo",
    createdAt: "2026-07-13T15:10:00.000Z"
  },
  {
    id: "client-demo-3002",
    code: "C-3002",
    name: "Juan Quispe",
    email: "juan@correo.com",
    phone: "912 345 678",
    address: "Quilmaná, Cañete",
    plan: "Plan Básico",
    status: "Pendiente",
    createdAt: "2026-07-10T13:20:00.000Z"
  },
  {
    id: "client-demo-3001",
    code: "C-3001",
    name: "Empresa ABC",
    email: "soporte@empresaabc.com",
    phone: "945 678 123",
    address: "San Vicente de Cañete",
    plan: "Plan Empresa",
    status: "Suspendido",
    createdAt: "2026-07-02T10:00:00.000Z"
  }
];

const DEFAULT_INSTALLATIONS = [
  {
    id: "installation-demo-5003",
    code: "INST-5003",
    clientId: "client-demo-3004",
    clientName: "Carlos Ramírez",
    address: "San Vicente de Cañete",
    serviceType: "Instalación FTTH",
    scheduledDate: "2026-07-20",
    scheduledTime: "10:30",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    priority: "Alta",
    status: "Programada",
    description:
      "Instalación de servicio residencial con router WiFi 6.",
    notes: "",
    createdAt: "2026-07-16T13:20:00.000Z"
  },
  {
    id: "installation-demo-5002",
    code: "INST-5002",
    clientId: "client-demo-3003",
    clientName: "María López",
    address: "Imperial, Cañete",
    serviceType: "Cambio de equipo",
    scheduledDate: "2026-07-19",
    scheduledTime: "16:00",
    technicianId: "tech-jose",
    technicianName: "José Mendoza",
    priority: "Media",
    status: "En camino",
    description:
      "Cambio de ONU GPON por baja potencia óptica.",
    notes: "",
    createdAt: "2026-07-15T12:10:00.000Z"
  },
  {
    id: "installation-demo-5001",
    code: "INST-5001",
    clientId: "client-demo-3002",
    clientName: "Juan Quispe",
    address: "Quilmaná, Cañete",
    serviceType: "Revisión técnica",
    scheduledDate: "2026-07-18",
    scheduledTime: "09:00",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    priority: "Media",
    status: "Completada",
    description:
      "Revisión por intermitencia reportada en horario nocturno.",
    notes: "Servicio verificado y estable.",
    createdAt: "2026-07-14T09:00:00.000Z"
  }
];

function readLocalRecords(storageKey) {
  const storedRecords =
    localStorage.getItem(storageKey);

  if (!storedRecords) {
    return [];
  }

  try {
    const parsedRecords =
      JSON.parse(storedRecords);

    return Array.isArray(parsedRecords)
      ? parsedRecords
      : [];
  } catch (error) {
    console.error(
      `No se pudieron leer los registros de ${storageKey}:`,
      error
    );

    return [];
  }
}

function readLocalObject(storageKey) {
  const storedValue =
    localStorage.getItem(storageKey);

  if (!storedValue) {
    return {};
  }

  try {
    const parsedValue =
      JSON.parse(storedValue);

    if (
      parsedValue &&
      typeof parsedValue === "object" &&
      !Array.isArray(parsedValue)
    ) {
      return parsedValue;
    }

    return {};
  } catch (error) {
    console.error(
      `No se pudo leer ${storageKey}:`,
      error
    );

    return {};
  }
}

function saveLocalRecords(storageKey, records) {
  localStorage.setItem(
    storageKey,
    JSON.stringify(records)
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

function normalizeStatus(status) {
  const validStatuses = [
    "Programada",
    "En camino",
    "En proceso",
    "Completada",
    "Cancelada"
  ];

  return validStatuses.includes(status)
    ? status
    : "Programada";
}

function normalizePriority(priority) {
  const validPriorities = [
    "Baja",
    "Media",
    "Alta",
    "Crítica"
  ];

  return validPriorities.includes(priority)
    ? priority
    : "Media";
}

function normalizeServiceType(serviceType) {
  const validTypes = [
    "Instalación FTTH",
    "Revisión técnica",
    "Cambio de equipo",
    "Traslado de servicio",
    "Mantenimiento"
  ];

  return validTypes.includes(serviceType)
    ? serviceType
    : "Instalación FTTH";
}

function normalizeTechnician(
  record,
  index
) {
  return {
    id:
      record.id ??
      `local-technician-${index}`,

    name:
      record.name ||
      "Técnico sin nombre",

    specialty:
      record.specialty ||
      "Soporte técnico"
  };
}

function normalizeClient(record, index) {
  return {
    id:
      record.id ??
      `local-client-${index}`,

    code:
      record.code ??
      `C-${String(3101 + index).padStart(
        4,
        "0"
      )}`,

    name:
      record.name ||
      "Cliente sin nombre",

    email:
      record.email ||
      "Sin correo",

    phone:
      record.phone ||
      "Sin teléfono",

    address:
      record.address ||
      "Sin dirección",

    plan:
      record.plan ||
      "Plan Básico",

    status:
      record.status ||
      "Activo",

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function normalizeInstallation(
  record,
  index
) {
  return {
    id:
      record.id ??
      `local-installation-${index}`,

    code:
      record.code ??
      `INST-${String(5101 + index).padStart(
        4,
        "0"
      )}`,

    clientId:
      record.clientId ||
      "",

    clientName:
      record.clientName ||
      "Cliente sin asignar",

    address:
      record.address ||
      "Sin dirección",

    serviceType:
      normalizeServiceType(
        record.serviceType
      ),

    scheduledDate:
      record.scheduledDate ||
      new Date().toISOString().slice(0, 10),

    scheduledTime:
      record.scheduledTime ||
      "09:00",

    technicianId:
      record.technicianId ||
      "",

    technicianName:
      record.technicianName ||
      "Sin asignar",

    priority:
      normalizePriority(
        record.priority
      ),

    status:
      normalizeStatus(record.status),

    description:
      record.description ||
      "Sin descripción registrada.",

    notes:
      record.notes || "",

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function getTechnicians() {
  const localTechnicians =
    readLocalRecords(
      TECHNICIANS_STORAGE_KEY
    ).map(normalizeTechnician);

  const techniciansById = new Map();

  [
    ...DEFAULT_TECHNICIANS,
    ...localTechnicians
  ].forEach((technician) => {
    techniciansById.set(
      technician.id,
      technician
    );
  });

  return Array.from(
    techniciansById.values()
  );
}

function getClients() {
  const localClients =
    readLocalRecords(
      CLIENTS_STORAGE_KEY
    ).map(normalizeClient);

  const storedEdits =
    readLocalObject(
      CLIENT_EDITS_STORAGE_KEY
    );

  return [
    ...DEFAULT_CLIENTS,
    ...localClients
  ].map((client) => {
    const changes =
      storedEdits[client.id] ?? {};

    return {
      ...client,
      ...changes
    };
  });
}

function getAllInstallations() {
  const localInstallations =
    readLocalRecords(
      INSTALLATIONS_STORAGE_KEY
    ).map(normalizeInstallation);

  const storedEdits =
    readLocalObject(
      INSTALLATION_EDITS_STORAGE_KEY
    );

  const clientsById =
    new Map(
      getClients().map((client) => [
        client.id,
        client
      ])
    );

  const techniciansById =
    new Map(
      getTechnicians().map(
        (technician) => [
          technician.id,
          technician
        ]
      )
    );

  return [
    ...DEFAULT_INSTALLATIONS,
    ...localInstallations
  ]
    .map((installation) => {
      const changes =
        storedEdits[
          installation.id
        ] ?? {};

      const mergedInstallation = {
        ...installation,
        ...changes,
        serviceType:
          normalizeServiceType(
            changes.serviceType ??
              installation.serviceType
          ),
        priority:
          normalizePriority(
            changes.priority ??
              installation.priority
          ),
        status:
          normalizeStatus(
            changes.status ??
              installation.status
          )
      };

      const client =
        clientsById.get(
          mergedInstallation.clientId
        );

      const technician =
        techniciansById.get(
          mergedInstallation.technicianId
        );

      return {
        ...mergedInstallation,

        clientName:
          client?.name ||
          mergedInstallation.clientName,

        address:
          client?.address ||
          mergedInstallation.address,

        technicianName:
          technician?.name ||
          mergedInstallation.technicianName
      };
    })
    .sort(
      (firstInstallation, secondInstallation) => {
        const firstDate =
          new Date(
            `${firstInstallation.scheduledDate}T${firstInstallation.scheduledTime}`
          );

        const secondDate =
          new Date(
            `${secondInstallation.scheduledDate}T${secondInstallation.scheduledTime}`
          );

        return firstDate - secondDate;
      }
    );
}

function resolveCurrentTechnicianId(
  session
) {
  const normalizedEmail =
    String(session?.email ?? "")
      .trim()
      .toLowerCase();

  const technicianIdByEmail =
    DEMO_TECHNICIAN_IDS_BY_EMAIL[
      normalizedEmail
    ];

  if (technicianIdByEmail) {
    return technicianIdByEmail;
  }

  const normalizedName =
    normalizeText(session?.name);

  const technician =
    getTechnicians().find(
      (currentTechnician) =>
        normalizeText(
          currentTechnician.name
        ) === normalizedName
    );

  return technician?.id || "";
}

function getTechnicianInstallations(
  session
) {
  const technicianId =
    resolveCurrentTechnicianId(
      session
    );

  const technicianName =
    normalizeText(session?.name);

  return getAllInstallations().filter(
    (installation) => {
      const matchesById =
        Boolean(technicianId) &&
        installation.technicianId ===
          technicianId;

      const matchesByName =
        Boolean(technicianName) &&
        normalizeText(
          installation.technicianName
        ) === technicianName;

      return (
        matchesById ||
        matchesByName
      );
    }
  );
}

function saveInstallationChanges(
  installationId,
  changes
) {
  const storedEdits =
    readLocalObject(
      INSTALLATION_EDITS_STORAGE_KEY
    );

  storedEdits[installationId] = {
    ...(storedEdits[
      installationId
    ] ?? {}),
    ...changes
  };

  localStorage.setItem(
    INSTALLATION_EDITS_STORAGE_KEY,
    JSON.stringify(storedEdits)
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:installations-updated"
    )
  );
}

function createInstallation(formData) {
  const installations =
    readLocalRecords(
      INSTALLATIONS_STORAGE_KEY
    );

  const newInstallation = {
    id: `installation-${Date.now()}`,
    code: `INST-${Date.now()
      .toString()
      .slice(-4)}`,
    ...formData,
    status: "Programada",
    notes: "",
    createdAt:
      new Date().toISOString()
  };

  installations.unshift(
    newInstallation
  );

  saveLocalRecords(
    INSTALLATIONS_STORAGE_KEY,
    installations
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:installations-updated"
    )
  );

  return newInstallation;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateValue) {
  const date = new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(date);
}

function formatDateTime(
  dateValue,
  timeValue
) {
  return `${formatDate(dateValue)} ${escapeHtml(
    timeValue || ""
  )}`;
}

function getStatusClass(status) {
  const statusClasses = {
    Programada: "status--warning",
    "En camino": "status--info",
    "En proceso": "status--info",
    Completada: "status--success",
    Cancelada: "status--danger"
  };

  return (
    statusClasses[status] ||
    "status--warning"
  );
}

function getPriorityClass(priority) {
  const priorityClasses = {
    Baja: "status--success",
    Media: "status--warning",
    Alta: "status--danger",
    Crítica: "status--danger"
  };

  return (
    priorityClasses[priority] ||
    "status--warning"
  );
}

function renderStatusOptions(
  currentStatus
) {
  const statuses = [
    "Programada",
    "En camino",
    "En proceso",
    "Completada",
    "Cancelada"
  ];

  return statuses
    .map(
      (status) => `
        <option
          value="${status}"
          ${
            status === currentStatus
              ? "selected"
              : ""
          }
        >
          ${status}
        </option>
      `
    )
    .join("");
}

function renderPriorityOptions(
  currentPriority
) {
  const priorities = [
    "Baja",
    "Media",
    "Alta",
    "Crítica"
  ];

  return priorities
    .map(
      (priority) => `
        <option
          value="${priority}"
          ${
            priority === currentPriority
              ? "selected"
              : ""
          }
        >
          ${priority}
        </option>
      `
    )
    .join("");
}

function renderServiceTypeOptions(
  currentType
) {
  const serviceTypes = [
    "Instalación FTTH",
    "Revisión técnica",
    "Cambio de equipo",
    "Traslado de servicio",
    "Mantenimiento"
  ];

  return serviceTypes
    .map(
      (serviceType) => `
        <option
          value="${serviceType}"
          ${
            serviceType === currentType
              ? "selected"
              : ""
          }
        >
          ${serviceType}
        </option>
      `
    )
    .join("");
}

function renderClientOptions(
  selectedClientId = ""
) {
  return getClients()
    .map(
      (client) => `
        <option
          value="${escapeHtml(client.id)}"
          ${
            client.id === selectedClientId
              ? "selected"
              : ""
          }
        >
          ${escapeHtml(
            client.name
          )} - ${escapeHtml(
            client.address
          )}
        </option>
      `
    )
    .join("");
}

function renderTechnicianOptions(
  selectedTechnicianId = ""
) {
  return getTechnicians()
    .map(
      (technician) => `
        <option
          value="${escapeHtml(
            technician.id
          )}"
          ${
            technician.id ===
            selectedTechnicianId
              ? "selected"
              : ""
          }
        >
          ${escapeHtml(
            technician.name
          )} - ${escapeHtml(
            technician.specialty
          )}
        </option>
      `
    )
    .join("");
}

function renderAdminRows(
  installations
) {
  if (installations.length === 0) {
    return `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <h3>
              No se encontraron instalaciones
            </h3>

            <p>
              Prueba modificando la búsqueda
              o los filtros.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return installations
    .map(
      (installation) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(
                installation.code
              )}
            </strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(
                  installation.clientName
                )}
              </strong>

              <small>
                ${escapeHtml(
                  installation.address
                )}
              </small>
            </div>
          </td>

          <td>
            ${escapeHtml(
              installation.serviceType
            )}
          </td>

          <td>
            ${escapeHtml(
              installation.technicianName
            )}
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  installation.status
                )}
              "
            >
              ${escapeHtml(
                installation.status
              )}
            </span>
          </td>

          <td>
            <span
              class="
                status
                ${getPriorityClass(
                  installation.priority
                )}
              "
            >
              ${escapeHtml(
                installation.priority
              )}
            </span>
          </td>

          <td>
            ${formatDateTime(
              installation.scheduledDate,
              installation.scheduledTime
            )}
          </td>

          <td>
            ${escapeHtml(
              installation.notes ||
              "Sin notas"
            )}
          </td>

          <td>
            <button
              class="
                button
                button--secondary
                admin-installation-view
              "
              type="button"
              data-installation-id="${
                escapeHtml(
                  installation.id
                )
              }"
            >
              Ver
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderTechnicianRows(
  installations
) {
  if (installations.length === 0) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>
              No tienes instalaciones asignadas
            </h3>

            <p>
              Las instalaciones programadas por
              el administrador aparecerán aquí.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return installations
    .map(
      (installation) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(
                installation.code
              )}
            </strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(
                  installation.clientName
                )}
              </strong>

              <small>
                ${escapeHtml(
                  installation.address
                )}
              </small>
            </div>
          </td>

          <td>
            ${escapeHtml(
              installation.serviceType
            )}
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  installation.status
                )}
              "
            >
              ${escapeHtml(
                installation.status
              )}
            </span>
          </td>

          <td>
            <span
              class="
                status
                ${getPriorityClass(
                  installation.priority
                )}
              "
            >
              ${escapeHtml(
                installation.priority
              )}
            </span>
          </td>

          <td>
            ${formatDateTime(
              installation.scheduledDate,
              installation.scheduledTime
            )}
          </td>

          <td>
            ${escapeHtml(
              installation.notes ||
              "Sin notas"
            )}
          </td>

          <td>
            <button
              class="
                button
                button--secondary
                technician-installation-view
              "
              type="button"
              data-installation-id="${
                escapeHtml(
                  installation.id
                )
              }"
            >
              Ver
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderAdminDetail(
  installation
) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Instalación</span>

        <strong>
          #${escapeHtml(
            installation.code
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Cliente</span>

        <strong>
          ${escapeHtml(
            installation.clientName
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Dirección</span>

        <strong>
          ${escapeHtml(
            installation.address
          )}
        </strong>
      </div>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="adminInstallationDate">
          Fecha
        </label>

        <div class="input-group">
          <input
            id="adminInstallationDate"
            type="date"
            value="${escapeHtml(
              installation.scheduledDate
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="adminInstallationTime">
          Hora
        </label>

        <div class="input-group">
          <input
            id="adminInstallationTime"
            type="time"
            value="${escapeHtml(
              installation.scheduledTime
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="adminInstallationServiceType">
          Tipo de servicio
        </label>

        <div class="input-group">
          <select id="adminInstallationServiceType">
            ${renderServiceTypeOptions(
              installation.serviceType
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="adminInstallationTechnician">
          Técnico
        </label>

        <div class="input-group">
          <select id="adminInstallationTechnician">
            ${renderTechnicianOptions(
              installation.technicianId
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="adminInstallationPriority">
          Prioridad
        </label>

        <div class="input-group">
          <select id="adminInstallationPriority">
            ${renderPriorityOptions(
              installation.priority
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="adminInstallationStatus">
          Estado
        </label>

        <div class="input-group">
          <select id="adminInstallationStatus">
            ${renderStatusOptions(
              installation.status
            )}
          </select>
        </div>
      </div>

      <div
        class="
          form-field
          quick-action__full
        "
      >
        <label for="adminInstallationDescription">
          Descripción
        </label>

        <div class="input-group">
          <textarea
            id="adminInstallationDescription"
            rows="4"
          >${escapeHtml(
            installation.description
          )}</textarea>
        </div>
      </div>

      <div
        class="
          form-field
          quick-action__full
        "
      >
        <label for="adminInstallationNotes">
          Notas
        </label>

        <div class="input-group">
          <textarea
            id="adminInstallationNotes"
            rows="4"
          >${escapeHtml(
            installation.notes
          )}</textarea>
        </div>
      </div>
    </div>

    <button
      id="saveAdminInstallation"
      class="
        button
        button--primary
        button--block
      "
      type="button"
      data-installation-id="${
        escapeHtml(
          installation.id
        )
      }"
      style="
        margin-top: 18px;
        color: #ffffff;
      "
    >
      Guardar cambios
    </button>

    <p
      id="adminInstallationMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

function renderTechnicianDetail(
  installation
) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Instalación</span>

        <strong>
          #${escapeHtml(
            installation.code
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Cliente</span>

        <strong>
          ${escapeHtml(
            installation.clientName
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Dirección</span>

        <strong>
          ${escapeHtml(
            installation.address
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Servicio</span>

        <strong>
          ${escapeHtml(
            installation.serviceType
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Programación</span>

        <strong>
          ${formatDateTime(
            installation.scheduledDate,
            installation.scheduledTime
          )}
        </strong>
      </div>
    </div>

    <div
      style="
        margin-top: 18px;
        padding: 18px;
        border-radius: 16px;
        background:
          var(--color-surface-soft);
      "
    >
      <strong>Descripción</strong>

      <p
        style="
          margin-top: 8px;
          color: var(--color-muted);
          line-height: 1.7;
        "
      >
        ${escapeHtml(
          installation.description
        )}
      </p>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="technicianInstallationStatus">
          Actualizar estado
        </label>

        <div class="input-group">
          <select id="technicianInstallationStatus">
            ${renderStatusOptions(
              installation.status
            )}
          </select>
        </div>
      </div>

      <div
        class="
          form-field
          quick-action__full
        "
      >
        <label for="technicianInstallationNotes">
          Observación del trabajo
        </label>

        <div class="input-group">
          <textarea
            id="technicianInstallationNotes"
            rows="4"
            placeholder="Describe el avance o resultado de la instalación..."
          >${escapeHtml(
            installation.notes
          )}</textarea>
        </div>
      </div>
    </div>

    <button
      id="saveTechnicianInstallation"
      class="
        button
        button--primary
        button--block
      "
      type="button"
      data-installation-id="${
        escapeHtml(
          installation.id
        )
      }"
      style="
        margin-top: 18px;
        color: #ffffff;
      "
    >
      Guardar avance
    </button>

    <p
      id="technicianInstallationMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>

    <a
      class="button button--secondary button--block"
      href="section.html?view=materials"
      style="margin-top: 12px;"
    >
      Registrar materiales utilizados
    </a>
  `;
}

function renderCreateForm() {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  return `
    <div class="quick-action__grid">
      <div class="form-field">
        <label for="newInstallationClient">
          Cliente
        </label>

        <div class="input-group">
          <select id="newInstallationClient">
            ${renderClientOptions()}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="newInstallationTechnician">
          Técnico
        </label>

        <div class="input-group">
          <select id="newInstallationTechnician">
            ${renderTechnicianOptions(
              "tech-victor"
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="newInstallationServiceType">
          Tipo de servicio
        </label>

        <div class="input-group">
          <select id="newInstallationServiceType">
            ${renderServiceTypeOptions(
              "Instalación FTTH"
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="newInstallationPriority">
          Prioridad
        </label>

        <div class="input-group">
          <select id="newInstallationPriority">
            ${renderPriorityOptions(
              "Media"
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="newInstallationDate">
          Fecha
        </label>

        <div class="input-group">
          <input
            id="newInstallationDate"
            type="date"
            value="${today}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="newInstallationTime">
          Hora
        </label>

        <div class="input-group">
          <input
            id="newInstallationTime"
            type="time"
            value="09:00"
          >
        </div>
      </div>

      <div
        class="
          form-field
          quick-action__full
        "
      >
        <label for="newInstallationDescription">
          Descripción
        </label>

        <div class="input-group">
          <textarea
            id="newInstallationDescription"
            rows="4"
            placeholder="Describe el trabajo a realizar..."
          ></textarea>
        </div>
      </div>
    </div>

    <button
      id="saveNewInstallation"
      class="
        button
        button--primary
        button--block
      "
      type="button"
      style="
        margin-top: 18px;
        color: #ffffff;
      "
    >
      Programar instalación
    </button>

    <p
      id="newInstallationMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

export function renderAdminInstallationsModule() {
  return `
    <section
      id="adminInstallationsModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Control de instalaciones
            </h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Programa instalaciones,
              asigna técnicos y revisa avances.
            </p>
          </div>

          <button
            id="openInstallationCreate"
            class="button button--primary"
            type="button"
            style="
              color: #ffffff;
              opacity: 1;
            "
          >
            + Nueva instalación
          </button>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Total
              </span>

              <div
                id="adminInstallationsTotal"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ▣
            </span>
          </div>

          <span class="kpi-card__trend">
            Instalaciones registradas
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Programadas
              </span>

              <div
                id="adminInstallationsScheduled"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              □
            </span>
          </div>

          <span class="kpi-card__trend">
            Pendientes de atención
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                En ejecución
              </span>

              <div
                id="adminInstallationsProgress"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ⚙
            </span>
          </div>

          <span class="kpi-card__trend">
            En camino o en proceso
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Completadas
              </span>

              <div
                id="adminInstallationsCompleted"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ✓
            </span>
          </div>

          <span class="kpi-card__trend">
            Trabajos finalizados
          </span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Buscar y filtrar</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Busca por código, cliente,
              técnico o dirección.
            </p>
          </div>
        </header>

        <div
          style="
            display: grid;
            grid-template-columns:
              repeat(
                auto-fit,
                minmax(190px, 1fr)
              );
            gap: 16px;
          "
        >
          <div class="form-field">
            <label for="adminInstallationSearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="adminInstallationSearch"
                type="search"
                placeholder="Código, cliente o técnico..."
              >
            </div>
          </div>

          <div class="form-field">
            <label for="adminInstallationStatusFilter">
              Estado
            </label>

            <div class="input-group">
              <select id="adminInstallationStatusFilter">
                <option value="">
                  Todos los estados
                </option>
                ${renderStatusOptions("")}
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="adminInstallationTechnicianFilter">
              Técnico
            </label>

            <div class="input-group">
              <select id="adminInstallationTechnicianFilter">
                <option value="">
                  Todos los técnicos
                </option>
                ${renderTechnicianOptions()}
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Instalaciones programadas</h2>

            <p
              id="adminInstallationsResults"
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              0 registros encontrados
            </p>
          </div>
        </header>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="adminInstallationsBody"></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="adminInstallationDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Instalación
            </span>

            <h2 id="adminInstallationDialogTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeAdminInstallationDialog"
            class="
              button
              button--icon
              modal__close
            "
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="adminInstallationDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeAdminInstallationDialogFooter"
            class="button button--secondary"
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </dialog>
  `;
}

export function renderTechnicianInstallationsModule(
  session
) {
  return `
    <section
      id="technicianInstallationsModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Instalaciones de
              ${escapeHtml(
                session?.name ||
                "Técnico"
              )}
            </h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Consulta tus instalaciones asignadas
              y actualiza el avance del trabajo.
            </p>
          </div>

          <span class="status status--success">
            Técnico activo
          </span>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Asignadas
              </span>

              <div
                id="technicianInstallationsTotal"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ▣
            </span>
          </div>

          <span class="kpi-card__trend">
            Trabajos asignados
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Programadas
              </span>

              <div
                id="technicianInstallationsScheduled"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              □
            </span>
          </div>

          <span class="kpi-card__trend">
            Pendientes de atención
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                En ejecución
              </span>

              <div
                id="technicianInstallationsProgress"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ⚙
            </span>
          </div>

          <span class="kpi-card__trend">
            En camino o en proceso
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Completadas
              </span>

              <div
                id="technicianInstallationsCompleted"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ✓
            </span>
          </div>

          <span class="kpi-card__trend">
            Trabajos terminados
          </span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Buscar y filtrar</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Busca por código, cliente,
              servicio o dirección.
            </p>
          </div>
        </header>

        <div
          style="
            display: grid;
            grid-template-columns:
              repeat(
                auto-fit,
                minmax(190px, 1fr)
              );
            gap: 16px;
          "
        >
          <div class="form-field">
            <label for="technicianInstallationSearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="technicianInstallationSearch"
                type="search"
                placeholder="Código, cliente o servicio..."
              >
            </div>
          </div>

          <div class="form-field">
            <label for="technicianInstallationStatusFilter">
              Estado
            </label>

            <div class="input-group">
              <select id="technicianInstallationStatusFilter">
                <option value="">
                  Todos los estados
                </option>
                ${renderStatusOptions("")}
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Mis instalaciones</h2>

            <p
              id="technicianInstallationsResults"
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              0 registros encontrados
            </p>
          </div>
        </header>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="technicianInstallationsBody"></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="technicianInstallationDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Trabajo asignado
            </span>

            <h2 id="technicianInstallationDialogTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeTechnicianInstallationDialog"
            class="
              button
              button--icon
              modal__close
            "
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="technicianInstallationDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeTechnicianInstallationDialogFooter"
            class="button button--secondary"
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </dialog>
  `;
}

export function initAdminInstallationsModule() {
  const moduleRoot =
    document.querySelector(
      "#adminInstallationsModule"
    );

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized ===
      "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized =
    "true";

  const searchInput =
    document.querySelector(
      "#adminInstallationSearch"
    );

  const statusFilter =
    document.querySelector(
      "#adminInstallationStatusFilter"
    );

  const technicianFilter =
    document.querySelector(
      "#adminInstallationTechnicianFilter"
    );

  const tableBody =
    document.querySelector(
      "#adminInstallationsBody"
    );

  const resultCount =
    document.querySelector(
      "#adminInstallationsResults"
    );

  const totalCount =
    document.querySelector(
      "#adminInstallationsTotal"
    );

  const scheduledCount =
    document.querySelector(
      "#adminInstallationsScheduled"
    );

  const progressCount =
    document.querySelector(
      "#adminInstallationsProgress"
    );

  const completedCount =
    document.querySelector(
      "#adminInstallationsCompleted"
    );

  const createButton =
    document.querySelector(
      "#openInstallationCreate"
    );

  const dialog =
    document.querySelector(
      "#adminInstallationDialog"
    );

  const dialogTitle =
    document.querySelector(
      "#adminInstallationDialogTitle"
    );

  const dialogContent =
    document.querySelector(
      "#adminInstallationDialogContent"
    );

  const closeButton =
    document.querySelector(
      "#closeAdminInstallationDialog"
    );

  const closeFooter =
    document.querySelector(
      "#closeAdminInstallationDialogFooter"
    );

  let installations = [];

  function updateCounters() {
    totalCount.textContent =
      installations.length;

    scheduledCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
          "Programada"
      ).length;

    progressCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
            "En camino" ||
          installation.status ===
            "En proceso"
      ).length;

    completedCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
          "Completada"
      ).length;
  }

  function getFilteredInstallations() {
    const searchValue =
      normalizeText(
        searchInput.value
      );

    const selectedStatus =
      statusFilter.value;

    const selectedTechnician =
      technicianFilter.value;

    return installations.filter(
      (installation) => {
        const searchableContent =
          normalizeText(
            [
              installation.code,
              installation.clientName,
              installation.address,
              installation.serviceType,
              installation.technicianName
            ].join(" ")
          );

        const matchesSearch =
          !searchValue ||
          searchableContent.includes(
            searchValue
          );

        const matchesStatus =
          !selectedStatus ||
          installation.status ===
            selectedStatus;

        const matchesTechnician =
          !selectedTechnician ||
          installation.technicianId ===
            selectedTechnician;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTechnician
        );
      }
    );
  }

  function renderTable() {
    const filteredInstallations =
      getFilteredInstallations();

    tableBody.innerHTML =
      renderAdminRows(
        filteredInstallations
      );

    resultCount.textContent =
      `${filteredInstallations.length} ${
        filteredInstallations.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshInstallations() {
    installations =
      getAllInstallations();

    updateCounters();
    renderTable();
  }

  function openDetail(installationId) {
    const installation =
      installations.find(
        (currentInstallation) =>
          currentInstallation.id ===
          installationId
      );

    if (!installation) {
      return;
    }

    dialogTitle.textContent =
      `Instalación #${installation.code}`;

    dialogContent.innerHTML =
      renderAdminDetail(installation);

    dialog.showModal();
  }

  function openCreate() {
    dialogTitle.textContent =
      "Nueva instalación";

    dialogContent.innerHTML =
      renderCreateForm();

    dialog.showModal();
  }

  searchInput.addEventListener(
    "input",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  technicianFilter.addEventListener(
    "change",
    renderTable
  );

  createButton.addEventListener(
    "click",
    openCreate
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".admin-installation-view"
        );

      if (!viewButton) {
        return;
      }

      openDetail(
        viewButton.dataset.installationId
      );
    }
  );

  dialogContent.addEventListener(
    "click",
    (event) => {
      const createSaveButton =
        event.target.closest(
          "#saveNewInstallation"
        );

      const updateSaveButton =
        event.target.closest(
          "#saveAdminInstallation"
        );

      if (createSaveButton) {
        const clientSelect =
          dialogContent.querySelector(
            "#newInstallationClient"
          );

        const technicianSelect =
          dialogContent.querySelector(
            "#newInstallationTechnician"
          );

        const serviceTypeSelect =
          dialogContent.querySelector(
            "#newInstallationServiceType"
          );

        const prioritySelect =
          dialogContent.querySelector(
            "#newInstallationPriority"
          );

        const dateInput =
          dialogContent.querySelector(
            "#newInstallationDate"
          );

        const timeInput =
          dialogContent.querySelector(
            "#newInstallationTime"
          );

        const descriptionInput =
          dialogContent.querySelector(
            "#newInstallationDescription"
          );

        const message =
          dialogContent.querySelector(
            "#newInstallationMessage"
          );

        if (
          !clientSelect ||
          !technicianSelect ||
          !serviceTypeSelect ||
          !prioritySelect ||
          !dateInput ||
          !timeInput ||
          !descriptionInput
        ) {
          return;
        }

        if (
          !clientSelect.value ||
          !technicianSelect.value ||
          !dateInput.value ||
          !timeInput.value
        ) {
          if (message) {
            message.textContent =
              "Completa cliente, técnico, fecha y hora.";
          }

          return;
        }

        const client =
          getClients().find(
            (currentClient) =>
              currentClient.id ===
              clientSelect.value
          );

        const technician =
          getTechnicians().find(
            (currentTechnician) =>
              currentTechnician.id ===
              technicianSelect.value
          );

        createInstallation({
          clientId:
            clientSelect.value,
          clientName:
            client?.name ||
            "Cliente sin asignar",
          address:
            client?.address ||
            "Sin dirección",
          technicianId:
            technicianSelect.value,
          technicianName:
            technician?.name ||
            "Sin asignar",
          serviceType:
            serviceTypeSelect.value,
          priority:
            prioritySelect.value,
          scheduledDate:
            dateInput.value,
          scheduledTime:
            timeInput.value,
          description:
            descriptionInput.value.trim() ||
            "Instalación programada desde el panel administrativo."
        });

        refreshInstallations();

        if (message) {
          message.textContent =
            "Instalación programada correctamente.";

          message.classList.add(
            "is-success"
          );
        }

        return;
      }

      if (updateSaveButton) {
        const installationId =
          updateSaveButton.dataset
            .installationId;

        const dateInput =
          dialogContent.querySelector(
            "#adminInstallationDate"
          );

        const timeInput =
          dialogContent.querySelector(
            "#adminInstallationTime"
          );

        const serviceTypeSelect =
          dialogContent.querySelector(
            "#adminInstallationServiceType"
          );

        const technicianSelect =
          dialogContent.querySelector(
            "#adminInstallationTechnician"
          );

        const prioritySelect =
          dialogContent.querySelector(
            "#adminInstallationPriority"
          );

        const statusSelect =
          dialogContent.querySelector(
            "#adminInstallationStatus"
          );

        const descriptionInput =
          dialogContent.querySelector(
            "#adminInstallationDescription"
          );

        const notesInput =
          dialogContent.querySelector(
            "#adminInstallationNotes"
          );

        if (
          !dateInput ||
          !timeInput ||
          !serviceTypeSelect ||
          !technicianSelect ||
          !prioritySelect ||
          !statusSelect ||
          !descriptionInput ||
          !notesInput
        ) {
          return;
        }

        const technician =
          getTechnicians().find(
            (currentTechnician) =>
              currentTechnician.id ===
              technicianSelect.value
          );

        saveInstallationChanges(
          installationId,
          {
            scheduledDate:
              dateInput.value,
            scheduledTime:
              timeInput.value,
            serviceType:
              serviceTypeSelect.value,
            technicianId:
              technicianSelect.value,
            technicianName:
              technician?.name ||
              "Sin asignar",
            priority:
              prioritySelect.value,
            status:
              statusSelect.value,
            description:
              descriptionInput.value.trim(),
            notes:
              notesInput.value.trim()
          }
        );

        refreshInstallations();

        const updatedInstallation =
          installations.find(
            (installation) =>
              installation.id ===
              installationId
          );

        if (!updatedInstallation) {
          dialog.close();
          return;
        }

        dialogTitle.textContent =
          `Instalación #${updatedInstallation.code}`;

        dialogContent.innerHTML =
          renderAdminDetail(
            updatedInstallation
          );

        const message =
          dialogContent.querySelector(
            "#adminInstallationMessage"
          );

        if (message) {
          message.textContent =
            "Instalación actualizada correctamente.";

          message.classList.add(
            "is-success"
          );
        }
      }
    }
  );

  closeButton.addEventListener(
    "click",
    () => dialog.close()
  );

  closeFooter.addEventListener(
    "click",
    () => dialog.close()
  );

  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    }
  );

  window.addEventListener(
    "storage",
    (event) => {
      const relevantKeys = [
        INSTALLATIONS_STORAGE_KEY,
        INSTALLATION_EDITS_STORAGE_KEY,
        CLIENTS_STORAGE_KEY,
        CLIENT_EDITS_STORAGE_KEY,
        TECHNICIANS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(
          event.key
        )
      ) {
        refreshInstallations();
      }
    }
  );

  window.addEventListener(
    "hinet:installations-updated",
    refreshInstallations
  );

  refreshInstallations();
}

export function initTechnicianInstallationsModule(
  session
) {
  const moduleRoot =
    document.querySelector(
      "#technicianInstallationsModule"
    );

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized ===
      "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized =
    "true";

  const searchInput =
    document.querySelector(
      "#technicianInstallationSearch"
    );

  const statusFilter =
    document.querySelector(
      "#technicianInstallationStatusFilter"
    );

  const tableBody =
    document.querySelector(
      "#technicianInstallationsBody"
    );

  const resultCount =
    document.querySelector(
      "#technicianInstallationsResults"
    );

  const totalCount =
    document.querySelector(
      "#technicianInstallationsTotal"
    );

  const scheduledCount =
    document.querySelector(
      "#technicianInstallationsScheduled"
    );

  const progressCount =
    document.querySelector(
      "#technicianInstallationsProgress"
    );

  const completedCount =
    document.querySelector(
      "#technicianInstallationsCompleted"
    );

  const dialog =
    document.querySelector(
      "#technicianInstallationDialog"
    );

  const dialogTitle =
    document.querySelector(
      "#technicianInstallationDialogTitle"
    );

  const dialogContent =
    document.querySelector(
      "#technicianInstallationDialogContent"
    );

  const closeButton =
    document.querySelector(
      "#closeTechnicianInstallationDialog"
    );

  const closeFooter =
    document.querySelector(
      "#closeTechnicianInstallationDialogFooter"
    );

  let installations = [];

  function updateCounters() {
    totalCount.textContent =
      installations.length;

    scheduledCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
          "Programada"
      ).length;

    progressCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
            "En camino" ||
          installation.status ===
            "En proceso"
      ).length;

    completedCount.textContent =
      installations.filter(
        (installation) =>
          installation.status ===
          "Completada"
      ).length;
  }

  function getFilteredInstallations() {
    const searchValue =
      normalizeText(
        searchInput.value
      );

    const selectedStatus =
      statusFilter.value;

    return installations.filter(
      (installation) => {
        const searchableContent =
          normalizeText(
            [
              installation.code,
              installation.clientName,
              installation.address,
              installation.serviceType,
              installation.description
            ].join(" ")
          );

        const matchesSearch =
          !searchValue ||
          searchableContent.includes(
            searchValue
          );

        const matchesStatus =
          !selectedStatus ||
          installation.status ===
            selectedStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }

  function renderTable() {
    const filteredInstallations =
      getFilteredInstallations();

    tableBody.innerHTML =
      renderTechnicianRows(
        filteredInstallations
      );

    resultCount.textContent =
      `${filteredInstallations.length} ${
        filteredInstallations.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshInstallations() {
    installations =
      getTechnicianInstallations(
        session
      );

    updateCounters();
    renderTable();
  }

  function openDetail(installationId) {
    const installation =
      installations.find(
        (currentInstallation) =>
          currentInstallation.id ===
          installationId
      );

    if (!installation) {
      return;
    }

    dialogTitle.textContent =
      `Instalación #${installation.code}`;

    dialogContent.innerHTML =
      renderTechnicianDetail(
        installation
      );

    dialog.showModal();
  }

  searchInput.addEventListener(
    "input",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".technician-installation-view"
        );

      if (!viewButton) {
        return;
      }

      openDetail(
        viewButton.dataset.installationId
      );
    }
  );

  dialogContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveTechnicianInstallation"
        );

      if (!saveButton) {
        return;
      }

      const installationId =
        saveButton.dataset.installationId;

      const statusSelect =
        dialogContent.querySelector(
          "#technicianInstallationStatus"
        );

      const notesInput =
        dialogContent.querySelector(
          "#technicianInstallationNotes"
        );

      if (
        !statusSelect ||
        !notesInput
      ) {
        return;
      }

      saveInstallationChanges(
        installationId,
        {
          status:
            statusSelect.value,
          notes:
            notesInput.value.trim()
        }
      );

      refreshInstallations();

      const updatedInstallation =
        installations.find(
          (installation) =>
            installation.id ===
            installationId
        );

      if (!updatedInstallation) {
        dialog.close();
        return;
      }

      dialogTitle.textContent =
        `Instalación #${updatedInstallation.code}`;

      dialogContent.innerHTML =
        renderTechnicianDetail(
          updatedInstallation
        );

      const message =
        dialogContent.querySelector(
          "#technicianInstallationMessage"
        );

      if (message) {
        message.textContent =
          "Avance actualizado correctamente.";

        message.classList.add(
          "is-success"
        );
      }
    }
  );

  closeButton.addEventListener(
    "click",
    () => dialog.close()
  );

  closeFooter.addEventListener(
    "click",
    () => dialog.close()
  );

  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    }
  );

  window.addEventListener(
    "storage",
    (event) => {
      const relevantKeys = [
        INSTALLATIONS_STORAGE_KEY,
        INSTALLATION_EDITS_STORAGE_KEY,
        CLIENTS_STORAGE_KEY,
        CLIENT_EDITS_STORAGE_KEY,
        TECHNICIANS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(
          event.key
        )
      ) {
        refreshInstallations();
      }
    }
  );

  window.addEventListener(
    "hinet:installations-updated",
    refreshInstallations
  );

  refreshInstallations();
}
