export const TECHNICIANS_MODULE = Object.freeze({
  name: "technicians",
  status: "implemented",
  description:
    "Gestión de técnicos conectada con instalaciones, calendario y agenda."
});

const TECHNICIANS_STORAGE_KEY =
  "hinet_demo_technicians";

const INSTALLATIONS_STORAGE_KEY =
  "hinet_demo_installations";

const INSTALLATION_EDITS_STORAGE_KEY =
  "hinet_demo_installation_edits";

const DEFAULT_TECHNICIANS = [
  {
    id: "tech-victor",
    name: "Víctor Técnico",
    email: "tecnico@hinet.com",
    phone: "999 111 222",
    specialty: "Soporte técnico",
    zone: "Cañete",
    status: "Activo",
    availability: "Disponible",
    notes:
      "Técnico demo conectado con tickets, agenda, instalaciones y materiales.",
    createdAt: "2026-07-10T09:00:00.000Z"
  },
  {
    id: "tech-jose",
    name: "José Mendoza",
    email: "jose@hinet.com",
    phone: "999 222 333",
    specialty: "Instalación FTTH",
    zone: "Imperial",
    status: "Activo",
    availability: "En ruta",
    notes:
      "Especialista en instalaciones FTTH y cambios de equipo.",
    createdAt: "2026-07-09T10:00:00.000Z"
  },
  {
    id: "tech-luis",
    name: "Luis Quispe",
    email: "luis@hinet.com",
    phone: "999 333 444",
    specialty: "Redes",
    zone: "Quilmaná",
    status: "Activo",
    availability: "Ocupado",
    notes:
      "Soporte de redes, mantenimiento y revisión técnica.",
    createdAt: "2026-07-08T11:00:00.000Z"
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
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeTechnician(record, index) {
  return {
    id:
      record.id ??
      `local-technician-${index}`,

    name:
      record.name ||
      "Técnico sin nombre",

    email:
      record.email ||
      "sin-correo@hinet.com",

    phone:
      record.phone ||
      "Sin teléfono",

    specialty:
      record.specialty ||
      "Soporte técnico",

    zone:
      record.zone ||
      "Cañete",

    status:
      ["Activo", "Inactivo"].includes(
        record.status
      )
        ? record.status
        : "Activo",

    availability:
      [
        "Disponible",
        "Ocupado",
        "En ruta",
        "Descanso"
      ].includes(record.availability)
        ? record.availability
        : "Disponible",

    notes:
      record.notes || "",

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

    clientName:
      record.clientName ||
      "Cliente sin asignar",

    address:
      record.address ||
      "Sin dirección",

    serviceType:
      record.serviceType ||
      "Instalación FTTH",

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
      record.priority ||
      "Media",

    status:
      record.status ||
      "Programada",

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
  ].forEach((technician, index) => {
    techniciansById.set(
      technician.id,
      normalizeTechnician(
        technician,
        index
      )
    );
  });

  return Array.from(
    techniciansById.values()
  );
}

function getInstallations() {
  const localInstallations =
    readLocalRecords(
      INSTALLATIONS_STORAGE_KEY
    ).map(normalizeInstallation);

  const storedEdits =
    readLocalObject(
      INSTALLATION_EDITS_STORAGE_KEY
    );

  return [
    ...DEFAULT_INSTALLATIONS,
    ...localInstallations
  ].map((installation, index) => {
    const normalizedInstallation =
      normalizeInstallation(
        installation,
        index
      );

    const changes =
      storedEdits[
        normalizedInstallation.id
      ] ?? {};

    return {
      ...normalizedInstallation,
      ...changes
    };
  });
}

function getTechnicianStats(technicianId) {
  const installations =
    getInstallations().filter(
      (installation) =>
        installation.technicianId ===
        technicianId
    );

  const activeInstallations =
    installations.filter(
      (installation) =>
        ![
          "Completada",
          "Cancelada"
        ].includes(
          installation.status
        )
    );

  const completedInstallations =
    installations.filter(
      (installation) =>
        installation.status ===
        "Completada"
    );

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const todayInstallations =
    installations.filter(
      (installation) =>
        installation.scheduledDate ===
        today
    );

  return {
    total: installations.length,
    active: activeInstallations.length,
    completed: completedInstallations.length,
    today: todayInstallations.length
  };
}

function upsertTechnician(technician) {
  const localTechnicians =
    readLocalRecords(
      TECHNICIANS_STORAGE_KEY
    );

  const existingIndex =
    localTechnicians.findIndex(
      (currentTechnician) =>
        currentTechnician.id ===
        technician.id
    );

  if (existingIndex >= 0) {
    localTechnicians[existingIndex] = {
      ...localTechnicians[existingIndex],
      ...technician
    };
  } else {
    localTechnicians.unshift(
      technician
    );
  }

  saveLocalRecords(
    TECHNICIANS_STORAGE_KEY,
    localTechnicians
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:technicians-updated"
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:installations-updated"
    )
  );
}

function createTechnician(formData) {
  const timestamp = Date.now();

  const newTechnician = {
    id: `tech-${timestamp}`,
    ...formData,
    createdAt:
      new Date().toISOString()
  };

  upsertTechnician(
    newTechnician
  );

  return newTechnician;
}

function getStatusClass(status) {
  return status === "Activo"
    ? "status--success"
    : "status--danger";
}

function getAvailabilityClass(availability) {
  const classes = {
    Disponible: "status--success",
    Ocupado: "status--warning",
    "En ruta": "status--info",
    Descanso: "status--danger"
  };

  return classes[availability] ||
    "status--warning";
}

function renderSpecialtyOptions(currentSpecialty = "") {
  const specialties = [
    "Soporte técnico",
    "Instalación FTTH",
    "Redes",
    "Fibra óptica",
    "Mantenimiento"
  ];

  return specialties
    .map(
      (specialty) => `
        <option
          value="${specialty}"
          ${
            specialty === currentSpecialty
              ? "selected"
              : ""
          }
        >
          ${specialty}
        </option>
      `
    )
    .join("");
}

function renderStatusOptions(currentStatus = "Activo") {
  return ["Activo", "Inactivo"]
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

function renderAvailabilityOptions(currentAvailability = "Disponible") {
  return [
    "Disponible",
    "Ocupado",
    "En ruta",
    "Descanso"
  ]
    .map(
      (availability) => `
        <option
          value="${availability}"
          ${
            availability === currentAvailability
              ? "selected"
              : ""
          }
        >
          ${availability}
        </option>
      `
    )
    .join("");
}

function renderTechnicianRows(technicians) {
  if (technicians.length === 0) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>No se encontraron técnicos</h3>
            <p>Prueba cambiando la búsqueda o los filtros.</p>
          </div>
        </td>
      </tr>
    `;
  }

  return technicians
    .map((technician) => {
      const stats =
        getTechnicianStats(
          technician.id
        );

      return `
        <tr>
          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(
                  technician.name
                )}
              </strong>

              <small>
                ${escapeHtml(
                  technician.email
                )}
              </small>
            </div>
          </td>

          <td>
            ${escapeHtml(
              technician.phone
            )}
          </td>

          <td>
            ${escapeHtml(
              technician.specialty
            )}
          </td>

          <td>
            ${escapeHtml(
              technician.zone
            )}
          </td>

          <td>
            <span class="status ${getStatusClass(technician.status)}">
              ${escapeHtml(
                technician.status
              )}
            </span>
          </td>

          <td>
            <span class="status ${getAvailabilityClass(technician.availability)}">
              ${escapeHtml(
                technician.availability
              )}
            </span>
          </td>

          <td>
            ${stats.total} asignadas · ${stats.completed} completadas
          </td>

          <td>
            <button
              class="button button--secondary technician-view-button"
              type="button"
              data-technician-id="${escapeHtml(
                technician.id
              )}"
            >
              Ver
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderTechnicianInstallationsList(technicianId) {
  const installations =
    getInstallations()
      .filter(
        (installation) =>
          installation.technicianId ===
          technicianId
      )
      .slice(0, 5);

  if (installations.length === 0) {
    return `
      <div class="empty-state">
        <h3>Sin trabajos asignados</h3>
        <p>Cuando se asigne una instalación, aparecerá aquí.</p>
      </div>
    `;
  }

  return installations
    .map(
      (installation) => `
        <div class="list-item">
          <div class="list-item__main">
            <strong>
              #${escapeHtml(
                installation.code
              )}
              · ${escapeHtml(
                installation.clientName
              )}
            </strong>

            <small>
              ${escapeHtml(
                installation.scheduledDate
              )}
              ${escapeHtml(
                installation.scheduledTime
              )}
              · ${escapeHtml(
                installation.serviceType
              )}
            </small>
          </div>

          <span class="status">
            ${escapeHtml(
              installation.status
            )}
          </span>
        </div>
      `
    )
    .join("");
}

function renderTechnicianDetail(technician) {
  const stats =
    getTechnicianStats(
      technician.id
    );

  return `
    <section class="kpi-grid">
      <article class="kpi-card">
        <div class="kpi-card__top">
          <div>
            <span class="kpi-card__label">Asignadas</span>
            <div class="kpi-card__value">${stats.total}</div>
          </div>
          <span class="kpi-card__icon">▣</span>
        </div>
        <span class="kpi-card__trend">Instalaciones vinculadas</span>
      </article>

      <article class="kpi-card">
        <div class="kpi-card__top">
          <div>
            <span class="kpi-card__label">Activas</span>
            <div class="kpi-card__value">${stats.active}</div>
          </div>
          <span class="kpi-card__icon">⚙</span>
        </div>
        <span class="kpi-card__trend">Pendientes o en proceso</span>
      </article>

      <article class="kpi-card">
        <div class="kpi-card__top">
          <div>
            <span class="kpi-card__label">Hoy</span>
            <div class="kpi-card__value">${stats.today}</div>
          </div>
          <span class="kpi-card__icon">●</span>
        </div>
        <span class="kpi-card__trend">Trabajos de la fecha</span>
      </article>

      <article class="kpi-card">
        <div class="kpi-card__top">
          <div>
            <span class="kpi-card__label">Completadas</span>
            <div class="kpi-card__value">${stats.completed}</div>
          </div>
          <span class="kpi-card__icon">✓</span>
        </div>
        <span class="kpi-card__trend">Finalizadas</span>
      </article>
    </section>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="technicianNameInput">
          Nombre
        </label>

        <div class="input-group">
          <input
            id="technicianNameInput"
            type="text"
            value="${escapeHtml(
              technician.name
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="technicianEmailInput">
          Correo
        </label>

        <div class="input-group">
          <input
            id="technicianEmailInput"
            type="email"
            value="${escapeHtml(
              technician.email
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="technicianPhoneInput">
          Teléfono
        </label>

        <div class="input-group">
          <input
            id="technicianPhoneInput"
            type="text"
            value="${escapeHtml(
              technician.phone
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="technicianSpecialtyInput">
          Especialidad
        </label>

        <div class="input-group">
          <select id="technicianSpecialtyInput">
            ${renderSpecialtyOptions(
              technician.specialty
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="technicianZoneInput">
          Zona
        </label>

        <div class="input-group">
          <input
            id="technicianZoneInput"
            type="text"
            value="${escapeHtml(
              technician.zone
            )}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="technicianStatusInput">
          Estado
        </label>

        <div class="input-group">
          <select id="technicianStatusInput">
            ${renderStatusOptions(
              technician.status
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="technicianAvailabilityInput">
          Disponibilidad
        </label>

        <div class="input-group">
          <select id="technicianAvailabilityInput">
            ${renderAvailabilityOptions(
              technician.availability
            )}
          </select>
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="technicianNotesInput">
          Observaciones
        </label>

        <div class="input-group">
          <textarea
            id="technicianNotesInput"
            rows="4"
          >${escapeHtml(
            technician.notes
          )}</textarea>
        </div>
      </div>
    </div>

    <button
      id="saveTechnicianButton"
      class="button button--primary button--block"
      type="button"
      data-technician-id="${escapeHtml(
        technician.id
      )}"
      style="margin-top: 18px; color: #ffffff;"
    >
      Guardar cambios
    </button>

    <p
      id="technicianDetailMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>

    <article
      class="card"
      style="margin-top: 18px;"
    >
      <header class="card__header">
        <div>
          <h2>Trabajos vinculados</h2>
          <p style="margin-top: 6px; color: var(--color-muted);">
            Últimas instalaciones asignadas al técnico.
          </p>
        </div>
      </header>

      <div class="list">
        ${renderTechnicianInstallationsList(
          technician.id
        )}
      </div>
    </article>
  `;
}

function renderCreateForm() {
  return `
    <div class="quick-action__grid">
      <div class="form-field">
        <label for="newTechnicianName">
          Nombre completo
        </label>

        <div class="input-group">
          <input
            id="newTechnicianName"
            type="text"
            placeholder="Ej. Pedro Ramos"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="newTechnicianEmail">
          Correo
        </label>

        <div class="input-group">
          <input
            id="newTechnicianEmail"
            type="email"
            placeholder="pedro@hinet.com"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="newTechnicianPhone">
          Teléfono
        </label>

        <div class="input-group">
          <input
            id="newTechnicianPhone"
            type="text"
            placeholder="999 555 666"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="newTechnicianSpecialty">
          Especialidad
        </label>

        <div class="input-group">
          <select id="newTechnicianSpecialty">
            ${renderSpecialtyOptions(
              "Instalación FTTH"
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="newTechnicianZone">
          Zona
        </label>

        <div class="input-group">
          <input
            id="newTechnicianZone"
            type="text"
            value="Cañete"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="newTechnicianAvailability">
          Disponibilidad
        </label>

        <div class="input-group">
          <select id="newTechnicianAvailability">
            ${renderAvailabilityOptions(
              "Disponible"
            )}
          </select>
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="newTechnicianNotes">
          Observaciones
        </label>

        <div class="input-group">
          <textarea
            id="newTechnicianNotes"
            rows="4"
            placeholder="Observaciones del técnico..."
          ></textarea>
        </div>
      </div>
    </div>

    <button
      id="saveNewTechnicianButton"
      class="button button--primary button--block"
      type="button"
      style="margin-top: 18px; color: #ffffff;"
    >
      Registrar técnico
    </button>

    <p
      id="newTechnicianMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

export function renderTechniciansModule() {
  return `
    <section
      id="techniciansModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>Gestión de técnicos</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Administra técnicos, disponibilidad, especialidad y carga de trabajo.
            </p>
          </div>

          <button
            id="openTechnicianCreate"
            class="button button--primary"
            type="button"
            style="color: #ffffff; opacity: 1;"
          >
            + Nuevo técnico
          </button>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Total</span>
              <div id="techniciansTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">♙</span>
          </div>
          <span class="kpi-card__trend">Técnicos registrados</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Activos</span>
              <div id="techniciansActive" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">✓</span>
          </div>
          <span class="kpi-card__trend">Disponibles para asignación</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Disponibles</span>
              <div id="techniciansAvailable" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">●</span>
          </div>
          <span class="kpi-card__trend">Sin bloqueo operativo</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Trabajos activos</span>
              <div id="techniciansAssigned" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">▣</span>
          </div>
          <span class="kpi-card__trend">Instalaciones no cerradas</span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Buscar y filtrar</h2>
            <p style="margin-top: 6px; color: var(--color-muted);">
              Busca por nombre, correo, zona o especialidad.
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
            <label for="technicianSearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="technicianSearch"
                type="search"
                placeholder="Nombre, correo o zona..."
              >
            </div>
          </div>

          <div class="form-field">
            <label for="technicianSpecialtyFilter">
              Especialidad
            </label>

            <div class="input-group">
              <select id="technicianSpecialtyFilter">
                <option value="">Todas</option>
                <option value="Soporte técnico">Soporte técnico</option>
                <option value="Instalación FTTH">Instalación FTTH</option>
                <option value="Redes">Redes</option>
                <option value="Fibra óptica">Fibra óptica</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="technicianStatusFilter">
              Estado
            </label>

            <div class="input-group">
              <select id="technicianStatusFilter">
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="technicianAvailabilityFilter">
              Disponibilidad
            </label>

            <div class="input-group">
              <select id="technicianAvailabilityFilter">
                <option value="">Todas</option>
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
                <option value="En ruta">En ruta</option>
                <option value="Descanso">Descanso</option>
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Lista de técnicos</h2>
            <p
              id="techniciansResults"
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
                <th>Técnico</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Zona</th>
                <th>Estado</th>
                <th>Disponibilidad</th>
                <th>Trabajos</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="techniciansTableBody"></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="technicianDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Técnico
            </span>

            <h2 id="technicianDialogTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeTechnicianDialog"
            class="button button--icon modal__close"
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="technicianDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeTechnicianDialogFooter"
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

export function initTechniciansModule() {
  const moduleRoot =
    document.querySelector(
      "#techniciansModule"
    );

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized === "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized = "true";

  const searchInput =
    document.querySelector(
      "#technicianSearch"
    );

  const specialtyFilter =
    document.querySelector(
      "#technicianSpecialtyFilter"
    );

  const statusFilter =
    document.querySelector(
      "#technicianStatusFilter"
    );

  const availabilityFilter =
    document.querySelector(
      "#technicianAvailabilityFilter"
    );

  const tableBody =
    document.querySelector(
      "#techniciansTableBody"
    );

  const resultCount =
    document.querySelector(
      "#techniciansResults"
    );

  const totalCount =
    document.querySelector(
      "#techniciansTotal"
    );

  const activeCount =
    document.querySelector(
      "#techniciansActive"
    );

  const availableCount =
    document.querySelector(
      "#techniciansAvailable"
    );

  const assignedCount =
    document.querySelector(
      "#techniciansAssigned"
    );

  const createButton =
    document.querySelector(
      "#openTechnicianCreate"
    );

  const dialog =
    document.querySelector(
      "#technicianDialog"
    );

  const dialogTitle =
    document.querySelector(
      "#technicianDialogTitle"
    );

  const dialogContent =
    document.querySelector(
      "#technicianDialogContent"
    );

  const closeButton =
    document.querySelector(
      "#closeTechnicianDialog"
    );

  const closeFooter =
    document.querySelector(
      "#closeTechnicianDialogFooter"
    );

  let technicians = [];

  function updateCounters() {
    totalCount.textContent =
      technicians.length;

    activeCount.textContent =
      technicians.filter(
        (technician) =>
          technician.status ===
          "Activo"
      ).length;

    availableCount.textContent =
      technicians.filter(
        (technician) =>
          technician.availability ===
            "Disponible" &&
          technician.status ===
            "Activo"
      ).length;

    assignedCount.textContent =
      technicians.reduce(
        (total, technician) =>
          total +
          getTechnicianStats(
            technician.id
          ).active,
        0
      );
  }

  function getFilteredTechnicians() {
    const searchValue =
      normalizeText(
        searchInput.value
      );

    const selectedSpecialty =
      specialtyFilter.value;

    const selectedStatus =
      statusFilter.value;

    const selectedAvailability =
      availabilityFilter.value;

    return technicians.filter(
      (technician) => {
        const searchableContent =
          normalizeText(
            [
              technician.name,
              technician.email,
              technician.phone,
              technician.specialty,
              technician.zone
            ].join(" ")
          );

        const matchesSearch =
          !searchValue ||
          searchableContent.includes(
            searchValue
          );

        const matchesSpecialty =
          !selectedSpecialty ||
          technician.specialty ===
            selectedSpecialty;

        const matchesStatus =
          !selectedStatus ||
          technician.status ===
            selectedStatus;

        const matchesAvailability =
          !selectedAvailability ||
          technician.availability ===
            selectedAvailability;

        return (
          matchesSearch &&
          matchesSpecialty &&
          matchesStatus &&
          matchesAvailability
        );
      }
    );
  }

  function renderTable() {
    const filteredTechnicians =
      getFilteredTechnicians();

    tableBody.innerHTML =
      renderTechnicianRows(
        filteredTechnicians
      );

    resultCount.textContent =
      `${filteredTechnicians.length} ${
        filteredTechnicians.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshTechnicians() {
    technicians =
      getTechnicians();

    updateCounters();
    renderTable();
  }

  function openDetail(technicianId) {
    const technician =
      technicians.find(
        (currentTechnician) =>
          currentTechnician.id ===
          technicianId
      );

    if (!technician) {
      return;
    }

    dialogTitle.textContent =
      technician.name;

    dialogContent.innerHTML =
      renderTechnicianDetail(
        technician
      );

    dialog.showModal();
  }

  function openCreate() {
    dialogTitle.textContent =
      "Nuevo técnico";

    dialogContent.innerHTML =
      renderCreateForm();

    dialog.showModal();
  }

  searchInput.addEventListener(
    "input",
    renderTable
  );

  specialtyFilter.addEventListener(
    "change",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  availabilityFilter.addEventListener(
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
          ".technician-view-button"
        );

      if (!viewButton) {
        return;
      }

      openDetail(
        viewButton.dataset.technicianId
      );
    }
  );

  dialogContent.addEventListener(
    "click",
    (event) => {
      const createSaveButton =
        event.target.closest(
          "#saveNewTechnicianButton"
        );

      const updateSaveButton =
        event.target.closest(
          "#saveTechnicianButton"
        );

      if (createSaveButton) {
        const nameInput =
          dialogContent.querySelector(
            "#newTechnicianName"
          );

        const emailInput =
          dialogContent.querySelector(
            "#newTechnicianEmail"
          );

        const phoneInput =
          dialogContent.querySelector(
            "#newTechnicianPhone"
          );

        const specialtyInput =
          dialogContent.querySelector(
            "#newTechnicianSpecialty"
          );

        const zoneInput =
          dialogContent.querySelector(
            "#newTechnicianZone"
          );

        const availabilityInput =
          dialogContent.querySelector(
            "#newTechnicianAvailability"
          );

        const notesInput =
          dialogContent.querySelector(
            "#newTechnicianNotes"
          );

        const message =
          dialogContent.querySelector(
            "#newTechnicianMessage"
          );

        if (
          !nameInput ||
          !emailInput ||
          !phoneInput ||
          !specialtyInput ||
          !zoneInput ||
          !availabilityInput ||
          !notesInput
        ) {
          return;
        }

        if (
          !nameInput.value.trim() ||
          !emailInput.value.trim() ||
          !phoneInput.value.trim()
        ) {
          if (message) {
            message.textContent =
              "Completa nombre, correo y teléfono.";
          }

          return;
        }

        const technician =
          createTechnician({
            name:
              nameInput.value.trim(),
            email:
              emailInput.value.trim(),
            phone:
              phoneInput.value.trim(),
            specialty:
              specialtyInput.value,
            zone:
              zoneInput.value.trim() ||
              "Cañete",
            status:
              "Activo",
            availability:
              availabilityInput.value,
            notes:
              notesInput.value.trim()
          });

        refreshTechnicians();

        dialogTitle.textContent =
          technician.name;

        dialogContent.innerHTML =
          renderTechnicianDetail(
            technician
          );

        const detailMessage =
          dialogContent.querySelector(
            "#technicianDetailMessage"
          );

        if (detailMessage) {
          detailMessage.textContent =
            "Técnico registrado correctamente.";

          detailMessage.classList.add(
            "is-success"
          );
        }

        return;
      }

      if (updateSaveButton) {
        const technicianId =
          updateSaveButton.dataset
            .technicianId;

        const existingTechnician =
          technicians.find(
            (technician) =>
              technician.id ===
              technicianId
          );

        if (!existingTechnician) {
          return;
        }

        const nameInput =
          dialogContent.querySelector(
            "#technicianNameInput"
          );

        const emailInput =
          dialogContent.querySelector(
            "#technicianEmailInput"
          );

        const phoneInput =
          dialogContent.querySelector(
            "#technicianPhoneInput"
          );

        const specialtyInput =
          dialogContent.querySelector(
            "#technicianSpecialtyInput"
          );

        const zoneInput =
          dialogContent.querySelector(
            "#technicianZoneInput"
          );

        const statusInput =
          dialogContent.querySelector(
            "#technicianStatusInput"
          );

        const availabilityInput =
          dialogContent.querySelector(
            "#technicianAvailabilityInput"
          );

        const notesInput =
          dialogContent.querySelector(
            "#technicianNotesInput"
          );

        if (
          !nameInput ||
          !emailInput ||
          !phoneInput ||
          !specialtyInput ||
          !zoneInput ||
          !statusInput ||
          !availabilityInput ||
          !notesInput
        ) {
          return;
        }

        upsertTechnician({
          ...existingTechnician,
          name:
            nameInput.value.trim() ||
            existingTechnician.name,
          email:
            emailInput.value.trim() ||
            existingTechnician.email,
          phone:
            phoneInput.value.trim() ||
            existingTechnician.phone,
          specialty:
            specialtyInput.value,
          zone:
            zoneInput.value.trim() ||
            "Cañete",
          status:
            statusInput.value,
          availability:
            availabilityInput.value,
          notes:
            notesInput.value.trim()
        });

        refreshTechnicians();

        const updatedTechnician =
          technicians.find(
            (technician) =>
              technician.id ===
              technicianId
          );

        if (!updatedTechnician) {
          dialog.close();
          return;
        }

        dialogTitle.textContent =
          updatedTechnician.name;

        dialogContent.innerHTML =
          renderTechnicianDetail(
            updatedTechnician
          );

        const message =
          dialogContent.querySelector(
            "#technicianDetailMessage"
          );

        if (message) {
          message.textContent =
            "Técnico actualizado correctamente.";

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
        TECHNICIANS_STORAGE_KEY,
        INSTALLATIONS_STORAGE_KEY,
        INSTALLATION_EDITS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(
          event.key
        )
      ) {
        refreshTechnicians();
      }
    }
  );

  window.addEventListener(
    "hinet:technicians-updated",
    refreshTechnicians
  );

  window.addEventListener(
    "hinet:installations-updated",
    refreshTechnicians
  );

  refreshTechnicians();
}
