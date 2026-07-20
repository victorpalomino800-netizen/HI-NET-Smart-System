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

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

function normalizeTechnician(record, index) {
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
      `C-${String(3101 + index).padStart(4, "0")}`,
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

function normalizeInstallation(record, index) {
  return {
    id:
      record.id ??
      `local-installation-${index}`,
    code:
      record.code ??
      `INST-${String(5101 + index).padStart(4, "0")}`,
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
      normalizeServiceType(record.serviceType),
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
      normalizePriority(record.priority),
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
      getTechnicians().map((technician) => [
        technician.id,
        technician
      ])
    );

  return [
    ...DEFAULT_INSTALLATIONS,
    ...localInstallations
  ]
    .map((installation) => {
      const changes =
        storedEdits[installation.id] ?? {};

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
    .sort((firstInstallation, secondInstallation) => {
      const firstDate =
        new Date(
          `${firstInstallation.scheduledDate}T${firstInstallation.scheduledTime}`
        );
      const secondDate =
        new Date(
          `${secondInstallation.scheduledDate}T${secondInstallation.scheduledTime}`
        );

      return firstDate - secondDate;
    });
}

function resolveCurrentTechnicianId(session) {
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
        normalizeText(currentTechnician.name) ===
        normalizedName
    );

  return technician?.id || "";
}

function getAgendaInstallations(session) {
  const technicianId =
    resolveCurrentTechnicianId(session);

  const technicianName =
    normalizeText(session?.name);

  return getAllInstallations().filter(
    (installation) => {
      const matchesById =
        Boolean(technicianId) &&
        installation.technicianId === technicianId;

      const matchesByName =
        Boolean(technicianName) &&
        normalizeText(installation.technicianName) ===
          technicianName;

      return matchesById || matchesByName;
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
    ...(storedEdits[installationId] ?? {}),
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toDateInputValue(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  const date =
    new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
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

function renderStatusOptions(currentStatus) {
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
          ${status === currentStatus ? "selected" : ""}
        >
          ${status}
        </option>
      `
    )
    .join("");
}

function renderAgendaRows(installations) {
  if (installations.length === 0) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>No hay trabajos para este filtro</h3>
            <p>Cambia la fecha o el estado para revisar otras instalaciones.</p>
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
            <strong>#${escapeHtml(installation.code)}</strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>${escapeHtml(installation.clientName)}</strong>
              <small>${escapeHtml(installation.address)}</small>
            </div>
          </td>

          <td>${escapeHtml(installation.serviceType)}</td>

          <td>
            <span class="status ${getStatusClass(installation.status)}">
              ${escapeHtml(installation.status)}
            </span>
          </td>

          <td>
            <span class="status ${getPriorityClass(installation.priority)}">
              ${escapeHtml(installation.priority)}
            </span>
          </td>

          <td>
            ${escapeHtml(formatDate(installation.scheduledDate))}
            ${escapeHtml(installation.scheduledTime)}
          </td>

          <td>${escapeHtml(installation.notes || "Sin notas")}</td>

          <td>
            <button
              class="button button--secondary agenda-view-button"
              type="button"
              data-installation-id="${escapeHtml(installation.id)}"
            >
              Ver
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderTodayList(installations) {
  if (installations.length === 0) {
    return `
      <div class="empty-state">
        <h3>No tienes trabajos hoy</h3>
        <p>Cuando el administrador programe instalaciones para esta fecha aparecerán aquí.</p>
      </div>
    `;
  }

  return installations
    .map(
      (installation) => `
        <div class="list-item">
          <div class="list-item__main">
            <strong>
              ${escapeHtml(installation.scheduledTime)}
              · ${escapeHtml(installation.clientName)}
            </strong>

            <small>
              ${escapeHtml(installation.serviceType)}
              · ${escapeHtml(installation.address)}
            </small>
          </div>

          <span class="status ${getStatusClass(installation.status)}">
            ${escapeHtml(installation.status)}
          </span>
        </div>
      `
    )
    .join("");
}

function renderAgendaDetail(installation) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Instalación</span>
        <strong>#${escapeHtml(installation.code)}</strong>
      </div>

      <div class="list-item">
        <span>Cliente</span>
        <strong>${escapeHtml(installation.clientName)}</strong>
      </div>

      <div class="list-item">
        <span>Dirección</span>
        <strong>${escapeHtml(installation.address)}</strong>
      </div>

      <div class="list-item">
        <span>Servicio</span>
        <strong>${escapeHtml(installation.serviceType)}</strong>
      </div>

      <div class="list-item">
        <span>Fecha y hora</span>
        <strong>
          ${escapeHtml(formatDate(installation.scheduledDate))}
          ${escapeHtml(installation.scheduledTime)}
        </strong>
      </div>
    </div>

    <div
      style="
        margin-top: 18px;
        padding: 18px;
        border-radius: 16px;
        background: var(--color-surface-soft);
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
        ${escapeHtml(installation.description)}
      </p>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="agendaInstallationStatus">
          Actualizar estado
        </label>

        <div class="input-group">
          <select id="agendaInstallationStatus">
            ${renderStatusOptions(installation.status)}
          </select>
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="agendaInstallationNotes">
          Observación
        </label>

        <div class="input-group">
          <textarea
            id="agendaInstallationNotes"
            rows="4"
            placeholder="Describe el avance del trabajo..."
          >${escapeHtml(installation.notes)}</textarea>
        </div>
      </div>
    </div>

    <button
      id="saveAgendaInstallation"
      class="button button--primary button--block"
      type="button"
      data-installation-id="${escapeHtml(installation.id)}"
      style="margin-top: 18px; color: #ffffff;"
    >
      Guardar avance
    </button>

    <p
      id="agendaInstallationMessage"
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

export function renderAgendaModule(session) {
  const today =
    toDateInputValue(new Date());

  return `
    <section
      id="technicianAgendaModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Agenda de ${escapeHtml(session?.name || "Técnico")}
            </h2>

            <p style="margin-top: 6px; color: var(--color-muted);">
              Revisa tus instalaciones por fecha y actualiza el avance.
            </p>
          </div>

          <span class="status status--success">
            Agenda activa
          </span>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Asignadas</span>
              <div id="agendaTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">▣</span>
          </div>
          <span class="kpi-card__trend">Trabajos de tu cuenta</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Hoy</span>
              <div id="agendaToday" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">●</span>
          </div>
          <span class="kpi-card__trend">Trabajos para hoy</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">En ejecución</span>
              <div id="agendaProgress" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">⚙</span>
          </div>
          <span class="kpi-card__trend">En camino o en proceso</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Completadas</span>
              <div id="agendaCompleted" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">✓</span>
          </div>
          <span class="kpi-card__trend">Trabajos terminados</span>
        </article>
      </section>

      <section class="dashboard-grid">
        <div class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <div>
                <h2>Buscar y filtrar agenda</h2>
                <p style="margin-top: 6px; color: var(--color-muted);">
                  Filtra por fecha, estado, cliente o servicio.
                </p>
              </div>
            </header>

            <div
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
                gap: 16px;
              "
            >
              <div class="form-field">
                <label for="agendaDateFilter">Fecha</label>
                <div class="input-group">
                  <input
                    id="agendaDateFilter"
                    type="date"
                    value="${today}"
                  >
                </div>
              </div>

              <div class="form-field">
                <label for="agendaStatusFilter">Estado</label>
                <div class="input-group">
                  <select id="agendaStatusFilter">
                    <option value="">Todos los estados</option>
                    <option value="Programada">Programada</option>
                    <option value="En camino">En camino</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label for="agendaSearch">Buscar</label>
                <div class="input-group">
                  <input
                    id="agendaSearch"
                    type="search"
                    placeholder="Cliente, dirección o código..."
                  >
                </div>
              </div>
            </div>
          </article>

          <article class="card">
            <header class="card__header">
              <div>
                <h2>Trabajos filtrados</h2>
                <p
                  id="agendaResults"
                  style="margin-top: 6px; color: var(--color-muted);"
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

                <tbody id="agendaTableBody"></tbody>
              </table>
            </div>
          </article>
        </div>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <div>
                <h2>Trabajos de hoy</h2>
                <p
                  id="agendaTodayCount"
                  style="margin-top: 6px; color: var(--color-muted);"
                >
                  0 trabajos
                </p>
              </div>
            </header>

            <div id="agendaTodayList" class="list"></div>
          </article>
        </aside>
      </section>
    </section>

    <dialog
      id="agendaDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Trabajo de agenda
            </span>

            <h2 id="agendaDialogTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeAgendaDialog"
            class="button button--icon modal__close"
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="agendaDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeAgendaDialogFooter"
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

export function initAgendaModule(session) {
  const moduleRoot =
    document.querySelector("#technicianAgendaModule");

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized === "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized = "true";

  const dateFilter =
    document.querySelector("#agendaDateFilter");

  const statusFilter =
    document.querySelector("#agendaStatusFilter");

  const searchInput =
    document.querySelector("#agendaSearch");

  const tableBody =
    document.querySelector("#agendaTableBody");

  const resultCount =
    document.querySelector("#agendaResults");

  const todayCount =
    document.querySelector("#agendaTodayCount");

  const todayList =
    document.querySelector("#agendaTodayList");

  const totalCount =
    document.querySelector("#agendaTotal");

  const todayKpi =
    document.querySelector("#agendaToday");

  const progressCount =
    document.querySelector("#agendaProgress");

  const completedCount =
    document.querySelector("#agendaCompleted");

  const dialog =
    document.querySelector("#agendaDialog");

  const dialogTitle =
    document.querySelector("#agendaDialogTitle");

  const dialogContent =
    document.querySelector("#agendaDialogContent");

  const closeButton =
    document.querySelector("#closeAgendaDialog");

  const closeFooter =
    document.querySelector("#closeAgendaDialogFooter");

  let installations = [];

  function updateCounters() {
    const today =
      toDateInputValue(new Date());

    totalCount.textContent =
      installations.length;

    todayKpi.textContent =
      installations.filter(
        (installation) =>
          installation.scheduledDate === today
      ).length;

    progressCount.textContent =
      installations.filter(
        (installation) =>
          installation.status === "En camino" ||
          installation.status === "En proceso"
      ).length;

    completedCount.textContent =
      installations.filter(
        (installation) =>
          installation.status === "Completada"
      ).length;
  }

  function getFilteredInstallations() {
    const selectedDate =
      dateFilter.value;

    const selectedStatus =
      statusFilter.value;

    const searchValue =
      normalizeText(searchInput.value);

    return installations.filter(
      (installation) => {
        const matchesDate =
          !selectedDate ||
          installation.scheduledDate === selectedDate;

        const matchesStatus =
          !selectedStatus ||
          installation.status === selectedStatus;

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
          searchableContent.includes(searchValue);

        return (
          matchesDate &&
          matchesStatus &&
          matchesSearch
        );
      }
    );
  }

  function renderTable() {
    const filteredInstallations =
      getFilteredInstallations();

    const today =
      toDateInputValue(new Date());

    const todayInstallations =
      installations.filter(
        (installation) =>
          installation.scheduledDate === today
      );

    tableBody.innerHTML =
      renderAgendaRows(
        filteredInstallations
      );

    resultCount.textContent =
      `${filteredInstallations.length} ${
        filteredInstallations.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;

    todayCount.textContent =
      `${todayInstallations.length} ${
        todayInstallations.length === 1
          ? "trabajo"
          : "trabajos"
      }`;

    todayList.innerHTML =
      renderTodayList(
        todayInstallations
      );
  }

  function refreshAgenda() {
    installations =
      getAgendaInstallations(session);

    updateCounters();
    renderTable();
  }

  function openDetail(installationId) {
    const installation =
      installations.find(
        (currentInstallation) =>
          currentInstallation.id === installationId
      );

    if (!installation) {
      return;
    }

    dialogTitle.textContent =
      `Instalación #${installation.code}`;

    dialogContent.innerHTML =
      renderAgendaDetail(installation);

    dialog.showModal();
  }

  dateFilter.addEventListener(
    "change",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  searchInput.addEventListener(
    "input",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".agenda-view-button"
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
          "#saveAgendaInstallation"
        );

      if (!saveButton) {
        return;
      }

      const installationId =
        saveButton.dataset.installationId;

      const statusSelect =
        dialogContent.querySelector(
          "#agendaInstallationStatus"
        );

      const notesInput =
        dialogContent.querySelector(
          "#agendaInstallationNotes"
        );

      const message =
        dialogContent.querySelector(
          "#agendaInstallationMessage"
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
          status: statusSelect.value,
          notes: notesInput.value.trim()
        }
      );

      refreshAgenda();

      const updatedInstallation =
        installations.find(
          (installation) =>
            installation.id === installationId
        );

      if (!updatedInstallation) {
        dialog.close();
        return;
      }

      dialogContent.innerHTML =
        renderAgendaDetail(
          updatedInstallation
        );

      const updatedMessage =
        dialogContent.querySelector(
          "#agendaInstallationMessage"
        );

      if (updatedMessage) {
        updatedMessage.textContent =
          "Agenda actualizada correctamente.";

        updatedMessage.classList.add(
          "is-success"
        );
      }

      if (message) {
        message.textContent = "";
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

      if (relevantKeys.includes(event.key)) {
        refreshAgenda();
      }
    }
  );

  window.addEventListener(
    "hinet:installations-updated",
    refreshAgenda
  );

  refreshAgenda();
}
