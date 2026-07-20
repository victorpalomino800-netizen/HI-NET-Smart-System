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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

function formatMonth(dateValue) {
  return new Intl.DateTimeFormat(
    "es-PE",
    {
      month: "long",
      year: "numeric"
    }
  ).format(dateValue);
}

function toDateInputValue(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function renderTechnicianOptions() {
  return getTechnicians()
    .map(
      (technician) => `
        <option value="${escapeHtml(technician.id)}">
          ${escapeHtml(technician.name)}
        </option>
      `
    )
    .join("");
}

function getMonthKey(dateValue) {
  return `${dateValue.getFullYear()}-${String(
    dateValue.getMonth() + 1
  ).padStart(2, "0")}`;
}

function isSameMonth(dateText, selectedMonth) {
  return dateText.startsWith(
    getMonthKey(selectedMonth)
  );
}

function renderDayInstallations(installations) {
  if (installations.length === 0) {
    return `
      <div class="empty-state">
        <h3>No hay instalaciones para esta fecha</h3>
        <p>Cambia de día o programa una instalación desde el módulo Instalaciones.</p>
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
              · #${escapeHtml(installation.code)}
            </strong>

            <small>
              ${escapeHtml(installation.clientName)}
              · ${escapeHtml(installation.address)}
            </small>

            <small>
              ${escapeHtml(installation.serviceType)}
              · Técnico: ${escapeHtml(installation.technicianName)}
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

function renderInstallationRows(installations) {
  if (installations.length === 0) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>No se encontraron instalaciones</h3>
            <p>Prueba cambiando el mes o los filtros.</p>
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
          <td>${escapeHtml(installation.technicianName)}</td>

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

          <td>
            <a
              class="button button--secondary"
              href="section.html?view=installations"
            >
              Gestionar
            </a>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderCalendarGrid({
  selectedMonth,
  selectedDate,
  installations
}) {
  const year =
    selectedMonth.getFullYear();

  const month =
    selectedMonth.getMonth();

  const firstDay =
    new Date(year, month, 1);

  const startDate =
    new Date(firstDay);

  const dayOfWeek =
    (firstDay.getDay() + 6) % 7;

  startDate.setDate(
    firstDay.getDate() - dayOfWeek
  );

  const days = Array.from(
    { length: 42 },
    (_, index) => {
      const currentDate =
        new Date(startDate);

      currentDate.setDate(
        startDate.getDate() + index
      );

      return currentDate;
    }
  );

  const weekdays = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom"
  ];

  const header = weekdays
    .map(
      (weekday) => `
        <div
          style="
            font-weight: 700;
            color: var(--color-muted);
            padding: 10px;
            text-align: center;
          "
        >
          ${weekday}
        </div>
      `
    )
    .join("");

  const cells = days
    .map((currentDate) => {
      const dateKey =
        toDateInputValue(currentDate);

      const dayInstallations =
        installations.filter(
          (installation) =>
            installation.scheduledDate === dateKey
        );

      const isCurrentMonth =
        currentDate.getMonth() === month;

      const isSelected =
        dateKey === selectedDate;

      const hasItems =
        dayInstallations.length > 0;

      return `
        <button
          class="calendar-day-button"
          type="button"
          data-date="${dateKey}"
          style="
            min-height: 96px;
            padding: 10px;
            border:
              1px solid
              ${
                isSelected
                  ? "var(--color-primary)"
                  : "var(--color-border)"
              };
            border-radius: 16px;
            background:
              ${
                isSelected
                  ? "var(--color-primary-soft)"
                  : "var(--color-surface)"
              };
            color:
              ${
                isCurrentMonth
                  ? "var(--color-text)"
                  : "var(--color-muted)"
              };
            text-align: left;
            cursor: pointer;
            opacity: ${isCurrentMonth ? "1" : "0.45"};
          "
        >
          <strong>${currentDate.getDate()}</strong>

          ${
            hasItems
              ? `
                <div style="margin-top: 8px;">
                  <span class="status status--info">
                    ${dayInstallations.length}
                    ${dayInstallations.length === 1 ? "trabajo" : "trabajos"}
                  </span>
                </div>

                <small
                  style="
                    display: block;
                    margin-top: 8px;
                    color: var(--color-muted);
                  "
                >
                  ${escapeHtml(dayInstallations[0].scheduledTime)}
                  · ${escapeHtml(dayInstallations[0].clientName)}
                </small>
              `
              : ""
          }
        </button>
      `;
    })
    .join("");

  return `
    <div
      style="
        display: grid;
        grid-template-columns: repeat(7, minmax(90px, 1fr));
        gap: 8px;
      "
    >
      ${header}
      ${cells}
    </div>
  `;
}

export function renderCalendarModule() {
  return `
    <section
      id="adminCalendarModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>Calendario de instalaciones</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Visualiza por mes las instalaciones programadas y sus técnicos asignados.
            </p>
          </div>

          <a
            class="button button--primary"
            href="section.html?view=installations"
            style="color: #ffffff;"
          >
            Gestionar instalaciones
          </a>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Del mes</span>
              <div id="calendarMonthTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">□</span>
          </div>
          <span class="kpi-card__trend">Instalaciones en calendario</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Hoy</span>
              <div id="calendarTodayTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">●</span>
          </div>
          <span class="kpi-card__trend">Trabajos de la fecha actual</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">En ejecución</span>
              <div id="calendarProgressTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">⚙</span>
          </div>
          <span class="kpi-card__trend">En camino o en proceso</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Completadas</span>
              <div id="calendarCompletedTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">✓</span>
          </div>
          <span class="kpi-card__trend">Trabajos finalizados</span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Filtros del calendario</h2>
            <p style="margin-top: 6px; color: var(--color-muted);">
              Filtra por técnico, estado o texto.
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
            <label for="calendarSearch">Buscar</label>
            <div class="input-group">
              <input
                id="calendarSearch"
                type="search"
                placeholder="Cliente, dirección o código..."
              >
            </div>
          </div>

          <div class="form-field">
            <label for="calendarStatusFilter">Estado</label>
            <div class="input-group">
              <select id="calendarStatusFilter">
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
            <label for="calendarTechnicianFilter">Técnico</label>
            <div class="input-group">
              <select id="calendarTechnicianFilter">
                <option value="">Todos los técnicos</option>
                ${renderTechnicianOptions()}
              </select>
            </div>
          </div>
        </div>
      </article>

      <section class="dashboard-grid">
        <article class="card">
          <header class="card__header">
            <button
              id="calendarPreviousMonth"
              class="button button--secondary"
              type="button"
            >
              ← Mes anterior
            </button>

            <h2 id="calendarMonthLabel">Calendario</h2>

            <button
              id="calendarNextMonth"
              class="button button--secondary"
              type="button"
            >
              Mes siguiente →
            </button>
          </header>

          <div id="calendarGrid"></div>
        </article>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <div>
                <h2 id="calendarSelectedTitle">Día seleccionado</h2>
                <p
                  id="calendarSelectedCount"
                  style="margin-top: 6px; color: var(--color-muted);"
                >
                  0 trabajos
                </p>
              </div>
            </header>

            <div id="calendarSelectedList" class="list"></div>
          </article>
        </aside>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Instalaciones del mes</h2>
            <p
              id="calendarResults"
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
                <th>Técnico</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="calendarTableBody"></tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

export function initCalendarModule() {
  const moduleRoot =
    document.querySelector("#adminCalendarModule");

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized === "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized = "true";

  const searchInput =
    document.querySelector("#calendarSearch");

  const statusFilter =
    document.querySelector("#calendarStatusFilter");

  const technicianFilter =
    document.querySelector("#calendarTechnicianFilter");

  const monthLabel =
    document.querySelector("#calendarMonthLabel");

  const calendarGrid =
    document.querySelector("#calendarGrid");

  const selectedTitle =
    document.querySelector("#calendarSelectedTitle");

  const selectedCount =
    document.querySelector("#calendarSelectedCount");

  const selectedList =
    document.querySelector("#calendarSelectedList");

  const tableBody =
    document.querySelector("#calendarTableBody");

  const resultCount =
    document.querySelector("#calendarResults");

  const previousButton =
    document.querySelector("#calendarPreviousMonth");

  const nextButton =
    document.querySelector("#calendarNextMonth");

  const monthTotal =
    document.querySelector("#calendarMonthTotal");

  const todayTotal =
    document.querySelector("#calendarTodayTotal");

  const progressTotal =
    document.querySelector("#calendarProgressTotal");

  const completedTotal =
    document.querySelector("#calendarCompletedTotal");

  let installations = [];
  let selectedMonth = new Date();
  let selectedDate = toDateInputValue(new Date());

  function getFilteredInstallations() {
    const searchValue =
      normalizeText(searchInput.value);

    const selectedStatus =
      statusFilter.value;

    const selectedTechnician =
      technicianFilter.value;

    return installations.filter((installation) => {
      const matchesMonth =
        isSameMonth(
          installation.scheduledDate,
          selectedMonth
        );

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
        searchableContent.includes(searchValue);

      const matchesStatus =
        !selectedStatus ||
        installation.status === selectedStatus;

      const matchesTechnician =
        !selectedTechnician ||
        installation.technicianId === selectedTechnician;

      return (
        matchesMonth &&
        matchesSearch &&
        matchesStatus &&
        matchesTechnician
      );
    });
  }

  function updateCounters(monthInstallations) {
    const today =
      toDateInputValue(new Date());

    monthTotal.textContent =
      monthInstallations.length;

    todayTotal.textContent =
      installations.filter(
        (installation) =>
          installation.scheduledDate === today
      ).length;

    progressTotal.textContent =
      monthInstallations.filter(
        (installation) =>
          installation.status === "En camino" ||
          installation.status === "En proceso"
      ).length;

    completedTotal.textContent =
      monthInstallations.filter(
        (installation) =>
          installation.status === "Completada"
      ).length;
  }

  function renderSelectedDay(monthInstallations) {
    const dayInstallations =
      monthInstallations.filter(
        (installation) =>
          installation.scheduledDate === selectedDate
      );

    selectedTitle.textContent =
      formatDate(selectedDate);

    selectedCount.textContent =
      `${dayInstallations.length} ${
        dayInstallations.length === 1
          ? "trabajo"
          : "trabajos"
      }`;

    selectedList.innerHTML =
      renderDayInstallations(dayInstallations);
  }

  function renderCalendar() {
    const monthInstallations =
      getFilteredInstallations();

    monthLabel.textContent =
      formatMonth(selectedMonth);

    calendarGrid.innerHTML =
      renderCalendarGrid({
        selectedMonth,
        selectedDate,
        installations: monthInstallations
      });

    tableBody.innerHTML =
      renderInstallationRows(
        monthInstallations
      );

    resultCount.textContent =
      `${monthInstallations.length} ${
        monthInstallations.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;

    updateCounters(monthInstallations);
    renderSelectedDay(monthInstallations);
  }

  function refreshCalendar() {
    installations =
      getAllInstallations();

    renderCalendar();
  }

  searchInput.addEventListener(
    "input",
    renderCalendar
  );

  statusFilter.addEventListener(
    "change",
    renderCalendar
  );

  technicianFilter.addEventListener(
    "change",
    renderCalendar
  );

  previousButton.addEventListener(
    "click",
    () => {
      selectedMonth =
        new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth() - 1,
          1
        );

      selectedDate =
        toDateInputValue(selectedMonth);

      renderCalendar();
    }
  );

  nextButton.addEventListener(
    "click",
    () => {
      selectedMonth =
        new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth() + 1,
          1
        );

      selectedDate =
        toDateInputValue(selectedMonth);

      renderCalendar();
    }
  );

  calendarGrid.addEventListener(
    "click",
    (event) => {
      const dayButton =
        event.target.closest(
          ".calendar-day-button"
        );

      if (!dayButton) {
        return;
      }

      selectedDate =
        dayButton.dataset.date;

      selectedMonth =
        new Date(`${selectedDate}T00:00:00`);

      renderCalendar();
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
        refreshCalendar();
      }
    }
  );

  window.addEventListener(
    "hinet:installations-updated",
    refreshCalendar
  );

  refreshCalendar();
}
