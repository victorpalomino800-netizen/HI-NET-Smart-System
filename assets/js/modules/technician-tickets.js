const ADMIN_TICKETS_STORAGE_KEY =
  "hinet_demo_admin_tickets";

const CLIENT_TICKETS_STORAGE_KEY =
  "hinet_demo_client_tickets";

const TICKET_STATUS_STORAGE_KEY =
  "hinet_demo_ticket_statuses";

const TICKET_ASSIGNMENT_STORAGE_KEY =
  "hinet_demo_ticket_assignments";

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

const DEFAULT_TICKETS = [
  {
    id: "ticket-demo-1005",
    code: "T-1005",
    client: "Carlos Ramírez",
    subject: "Internet intermitente",
    description:
      "El servicio presenta cortes frecuentes durante la noche.",
    priority: "Alta",
    status: "Pendiente",
    source: "Administrador",
    createdAt: "2026-07-15T20:25:00.000Z"
  },
  {
    id: "ticket-demo-1004",
    code: "T-1004",
    client: "María López",
    subject: "Instalación nueva",
    description:
      "Solicitud para realizar una instalación de internet FTTH.",
    priority: "Media",
    status: "En proceso",
    source: "Administrador",
    createdAt: "2026-07-15T18:40:00.000Z"
  },
  {
    id: "ticket-demo-1003",
    code: "T-1003",
    client: "Empresa ABC",
    subject: "Caída total del servicio",
    description:
      "La empresa informa que actualmente no cuenta con conexión.",
    priority: "Crítica",
    status: "En proceso",
    source: "Administrador",
    createdAt: "2026-07-15T16:10:00.000Z"
  },
  {
    id: "ticket-demo-1002",
    code: "T-1002",
    client: "Juan Quispe",
    subject: "Configuración del router",
    description:
      "El cliente solicita cambiar el nombre y contraseña de la red.",
    priority: "Baja",
    status: "Resuelto",
    source: "Administrador",
    createdAt: "2026-07-14T15:30:00.000Z"
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
    "Pendiente",
    "En proceso",
    "En espera",
    "Resuelto",
    "Cancelado"
  ];

  return validStatuses.includes(status)
    ? status
    : "Pendiente";
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

function normalizeAdministratorTicket(
  record,
  index
) {
  return {
    id:
      record.id ??
      `admin-ticket-${index}`,

    code:
      record.code ??
      `T-${String(1101 + index).padStart(
        4,
        "0"
      )}`,

    client:
      record.client ||
      "Cliente sin nombre",

    subject:
      record.subject ||
      "Sin asunto",

    description:
      record.description ||
      "Sin descripción registrada.",

    priority:
      normalizePriority(record.priority),

    status:
      normalizeStatus(record.status),

    source: "Administrador",

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function normalizeClientTicket(
  record,
  index
) {
  return {
    id:
      record.id ??
      `client-ticket-${index}`,

    code:
      record.code ??
      `T-${String(2101 + index).padStart(
        4,
        "0"
      )}`,

    client:
      record.client ||
      "Cliente del portal",

    subject:
      record.subject ||
      "Sin asunto",

    description:
      record.description ||
      "Sin descripción registrada.",

    priority:
      normalizePriority(
        record.priority || "Media"
      ),

    status:
      normalizeStatus(record.status),

    category:
      record.category ||
      "Soporte general",

    source: "Portal del cliente",

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
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

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

  const normalizedSessionName =
    normalizeText(session?.name);

  const technician = getTechnicians().find(
    (currentTechnician) =>
      normalizeText(
        currentTechnician.name
      ) === normalizedSessionName
  );

  return technician?.id || "";
}

function getAllTickets() {
  const administratorTickets =
    readLocalRecords(
      ADMIN_TICKETS_STORAGE_KEY
    ).map(normalizeAdministratorTicket);

  const clientTickets =
    readLocalRecords(
      CLIENT_TICKETS_STORAGE_KEY
    ).map(normalizeClientTicket);

  const storedStatuses =
    readLocalObject(
      TICKET_STATUS_STORAGE_KEY
    );

  const storedAssignments =
    readLocalObject(
      TICKET_ASSIGNMENT_STORAGE_KEY
    );

  const technicians = getTechnicians();

  const techniciansById = new Map(
    technicians.map((technician) => [
      String(technician.id),
      technician
    ])
  );

  return [
    ...DEFAULT_TICKETS,
    ...administratorTickets,
    ...clientTickets
  ]
    .map((ticket) => {
      const rawAssignment =
        storedAssignments[ticket.id];

      const assignedTechnicianId =
        rawAssignment &&
        typeof rawAssignment === "object"
          ? String(rawAssignment.id ?? "")
          : String(rawAssignment ?? "");

      const assignedTechnician =
        techniciansById.get(
          assignedTechnicianId
        );

      const assignedTechnicianName =
        rawAssignment &&
        typeof rawAssignment === "object"
          ? rawAssignment.name ?? ""
          : assignedTechnician?.name ?? "";

      return {
        ...ticket,

        status: normalizeStatus(
          storedStatuses[ticket.id] ??
            ticket.status
        ),

        assignedTechnicianId,
        assignedTechnicianName
      };
    })
    .sort(
      (firstTicket, secondTicket) => {
        const firstDate =
          new Date(firstTicket.createdAt);

        const secondDate =
          new Date(secondTicket.createdAt);

        return secondDate - firstDate;
      }
    );
}

function getAssignedTickets(session) {
  const currentTechnicianId =
    String(
      resolveCurrentTechnicianId(session)
    );

  const currentTechnicianName =
    normalizeText(session?.name);

  const techniciansById = new Map(
    getTechnicians().map(
      (technician) => [
        String(technician.id),
        technician
      ]
    )
  );

  return getAllTickets().filter(
    (ticket) => {
      const assignedId =
        String(
          ticket.assignedTechnicianId ??
          ""
        );

      const assignedTechnician =
        techniciansById.get(assignedId);

      const assignedName =
        normalizeText(
          ticket.assignedTechnicianName ||
          assignedTechnician?.name ||
          assignedId
        );

      const matchesById =
        Boolean(currentTechnicianId) &&
        assignedId ===
          currentTechnicianId;

      const matchesByName =
        Boolean(currentTechnicianName) &&
        assignedName ===
          currentTechnicianName;

      return matchesById || matchesByName;
    }
  );
}
function saveTicketStatus(ticketId, status) {
  const storedStatuses =
    readLocalObject(
      TICKET_STATUS_STORAGE_KEY
    );

  storedStatuses[ticketId] =
    normalizeStatus(status);

  localStorage.setItem(
    TICKET_STATUS_STORAGE_KEY,
    JSON.stringify(storedStatuses)
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:tickets-updated"
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

function formatDate(dateValue) {
  const date =
    new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}

function getStatusClass(status) {
  const statusClasses = {
    Pendiente: "status--warning",
    "En proceso": "status--info",
    "En espera": "status--warning",
    Resuelto: "status--success",
    Cancelado: "status--danger"
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
    "Pendiente",
    "En proceso",
    "En espera",
    "Resuelto",
    "Cancelado"
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
function renderTicketRows(tickets) {
  if (tickets.length === 0) {
    return `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <h3>
              No tienes tickets asignados
            </h3>

            <p>
              Los tickets asignados por el
              administrador aparecerán aquí.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return tickets
    .map(
      (ticket) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(ticket.code)}
            </strong>
          </td>

          <td>
            ${escapeHtml(ticket.client)}
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(ticket.subject)}
              </strong>

              <small>
                ${escapeHtml(ticket.source)}
              </small>
            </div>
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  ticket.status
                )}
              "
            >
              ${escapeHtml(ticket.status)}
            </span>
          </td>

          <td>
            <span
              class="
                status
                ${getPriorityClass(
                  ticket.priority
                )}
              "
            >
              ${escapeHtml(
                ticket.priority
              )}
            </span>
          </td>

          <td>
            ${escapeHtml(
              formatDate(
                ticket.createdAt
              )
            )}
          </td>

          <td>
            <button
              class="
                button
                button--secondary
                technician-ticket-view
              "
              type="button"
              data-ticket-id="${
                escapeHtml(ticket.id)
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

function renderTicketDetail(ticket) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Ticket</span>

        <strong>
          #${escapeHtml(ticket.code)}
        </strong>
      </div>

      <div class="list-item">
        <span>Cliente</span>

        <strong>
          ${escapeHtml(ticket.client)}
        </strong>
      </div>

      <div class="list-item">
        <span>Asunto</span>

        <strong>
          ${escapeHtml(ticket.subject)}
        </strong>
      </div>

      <div class="list-item">
        <span>Prioridad</span>

        <span
          class="
            status
            ${getPriorityClass(
              ticket.priority
            )}
          "
        >
          ${escapeHtml(ticket.priority)}
        </span>
      </div>

      <div class="list-item">
        <span>Estado actual</span>

        <span
          class="
            status
            ${getStatusClass(
              ticket.status
            )}
          "
        >
          ${escapeHtml(ticket.status)}
        </span>
      </div>

      <div class="list-item">
        <span>Fecha</span>

        <strong>
          ${escapeHtml(
            formatDate(
              ticket.createdAt
            )
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
          ticket.description
        )}
      </p>
    </div>

    <div
      style="
        margin-top: 18px;
        padding: 18px;
        border:
          1px solid
          var(--color-border);
        border-radius: 16px;
      "
    >
      <div class="form-field">
        <label
          for="technicianTicketStatus"
        >
          Actualizar estado
        </label>

        <div class="input-group">
          <select
            id="technicianTicketStatus"
          >
            ${renderStatusOptions(
              ticket.status
            )}
          </select>
        </div>
      </div>

      <button
        id="saveTechnicianTicketStatus"
        class="
          button
          button--primary
          button--block
        "
        type="button"
        data-ticket-id="${
          escapeHtml(ticket.id)
        }"
        style="margin-top: 14px;"
      >
        Guardar estado
      </button>

      <p
        id="technicianTicketMessage"
        class="form-message"
        role="status"
        aria-live="polite"
      ></p>
    </div>
  `;
}

export function renderTechnicianTicketsModule(
  session
) {
  return `
    <section
      id="technicianTicketsModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Tickets de
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
              Aquí aparecen únicamente
              los trabajos asignados a tu
              cuenta.
            </p>
          </div>

          <span
            class="status status--success"
          >
            Técnico activo
          </span>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Total asignados
              </span>

              <div
                id="technicianTicketsTotal"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              ◉
            </span>
          </div>

          <span class="kpi-card__trend">
            Tickets de tu cuenta
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Pendientes
              </span>

              <div
                id="technicianTicketsPending"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              !
            </span>
          </div>

          <span class="kpi-card__trend">
            Requieren atención
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                En proceso
              </span>

              <div
                id="technicianTicketsProgress"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              ⚙
            </span>
          </div>

          <span class="kpi-card__trend">
            Trabajos activos
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Resueltos
              </span>

              <div
                id="technicianTicketsResolved"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              ✓
            </span>
          </div>

          <span class="kpi-card__trend">
            Trabajos completados
          </span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Buscar y filtrar
            </h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Busca por ticket, cliente
              o asunto.
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
            <label
              for="technicianTicketSearch"
            >
              Buscar
            </label>

            <div class="input-group">
              <input
                id="technicianTicketSearch"
                type="search"
                placeholder="
                  Ticket, cliente o asunto...
                "
              >
            </div>
          </div>

          <div class="form-field">
            <label
              for="technicianTicketStatusFilter"
            >
              Estado
            </label>

            <div class="input-group">
              <select
                id="technicianTicketStatusFilter"
              >
                <option value="">
                  Todos los estados
                </option>

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="En proceso">
                  En proceso
                </option>

                <option value="En espera">
                  En espera
                </option>

                <option value="Resuelto">
                  Resuelto
                </option>

                <option value="Cancelado">
                  Cancelado
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label
              for="technicianTicketPriorityFilter"
            >
              Prioridad
            </label>

            <div class="input-group">
              <select
                id="technicianTicketPriorityFilter"
              >
                <option value="">
                  Todas las prioridades
                </option>

                <option value="Baja">
                  Baja
                </option>

                <option value="Media">
                  Media
                </option>

                <option value="Alta">
                  Alta
                </option>

                <option value="Crítica">
                  Crítica
                </option>
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Mis tickets asignados
            </h2>

            <p
              id="technicianTicketsResults"
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
                <th>Ticket</th>
                <th>Cliente</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody
              id="technicianTicketsBody"
            ></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="technicianTicketDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span
              class="
                eyebrow
                eyebrow--dark
              "
            >
              Trabajo asignado
            </span>

            <h2
              id="technicianTicketTitle"
            >
              Detalle del ticket
            </h2>
          </div>

          <button
            id="closeTechnicianTicket"
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

        <div
          id="technicianTicketContent"
        ></div>

        <footer class="modal__actions">
          <button
            id="closeTechnicianTicketFooter"
            class="
              button
              button--secondary
            "
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </dialog>
  `;
}

export function initTechnicianTicketsModule(
  session
) {
  const moduleRoot =
    document.querySelector(
      "#technicianTicketsModule"
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
      "#technicianTicketSearch"
    );

  const statusFilter =
    document.querySelector(
      "#technicianTicketStatusFilter"
    );

  const priorityFilter =
    document.querySelector(
      "#technicianTicketPriorityFilter"
    );

  const tableBody =
    document.querySelector(
      "#technicianTicketsBody"
    );

  const resultCount =
    document.querySelector(
      "#technicianTicketsResults"
    );

  const totalCount =
    document.querySelector(
      "#technicianTicketsTotal"
    );

  const pendingCount =
    document.querySelector(
      "#technicianTicketsPending"
    );

  const progressCount =
    document.querySelector(
      "#technicianTicketsProgress"
    );

  const resolvedCount =
    document.querySelector(
      "#technicianTicketsResolved"
    );

  const detailDialog =
    document.querySelector(
      "#technicianTicketDialog"
    );

  const detailTitle =
    document.querySelector(
      "#technicianTicketTitle"
    );

  const detailContent =
    document.querySelector(
      "#technicianTicketContent"
    );

  const closeButton =
    document.querySelector(
      "#closeTechnicianTicket"
    );

  const closeFooter =
    document.querySelector(
      "#closeTechnicianTicketFooter"
    );

  let tickets = [];

  function updateCounters() {
    totalCount.textContent =
      tickets.length;

    pendingCount.textContent =
      tickets.filter(
        (ticket) =>
          ticket.status === "Pendiente"
      ).length;

    progressCount.textContent =
      tickets.filter(
        (ticket) =>
          ticket.status === "En proceso"
      ).length;

    resolvedCount.textContent =
      tickets.filter(
        (ticket) =>
          ticket.status === "Resuelto"
      ).length;
  }

  function getFilteredTickets() {
    const searchValue =
      searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus =
      statusFilter.value;

    const selectedPriority =
      priorityFilter.value;

    return tickets.filter((ticket) => {
      const searchableContent = [
        ticket.code,
        ticket.client,
        ticket.subject,
        ticket.description
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableContent.includes(
          searchValue
        );

      const matchesStatus =
        !selectedStatus ||
        ticket.status ===
          selectedStatus;

      const matchesPriority =
        !selectedPriority ||
        ticket.priority ===
          selectedPriority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }

  function renderTable() {
    const filteredTickets =
      getFilteredTickets();

    tableBody.innerHTML =
      renderTicketRows(
        filteredTickets
      );

    resultCount.textContent =
      `${filteredTickets.length} ${
        filteredTickets.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshTickets() {
    tickets =
      getAssignedTickets(session);

    updateCounters();
    renderTable();
  }

  function openTicketDetail(
    ticketId
  ) {
    const ticket = tickets.find(
      (currentTicket) =>
        currentTicket.id === ticketId
    );

    if (!ticket) {
      return;
    }

    detailTitle.textContent =
      `Ticket #${ticket.code}`;

    detailContent.innerHTML =
      renderTicketDetail(ticket);

    detailDialog.showModal();
  }

  searchInput.addEventListener(
    "input",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  priorityFilter.addEventListener(
    "change",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".technician-ticket-view"
        );

      if (!viewButton) {
        return;
      }

      openTicketDetail(
        viewButton.dataset.ticketId
      );
    }
  );

  detailContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveTechnicianTicketStatus"
        );

      if (!saveButton) {
        return;
      }

      const statusSelect =
        detailContent.querySelector(
          "#technicianTicketStatus"
        );

      if (!statusSelect) {
        return;
      }

      const ticketId =
        saveButton.dataset.ticketId;

      saveTicketStatus(
        ticketId,
        statusSelect.value
      );

      refreshTickets();

      const updatedTicket =
        tickets.find(
          (ticket) =>
            ticket.id === ticketId
        );

      if (!updatedTicket) {
        detailDialog.close();
        return;
      }

      detailTitle.textContent =
        `Ticket #${updatedTicket.code}`;

      detailContent.innerHTML =
        renderTicketDetail(
          updatedTicket
        );

      const message =
        detailContent.querySelector(
          "#technicianTicketMessage"
        );

      if (message) {
        message.textContent =
          "Estado actualizado correctamente.";

        message.classList.add(
          "is-success"
        );
      }
    }
  );

  closeButton.addEventListener(
    "click",
    () => {
      detailDialog.close();
    }
  );

  closeFooter.addEventListener(
    "click",
    () => {
      detailDialog.close();
    }
  );

  detailDialog.addEventListener(
    "click",
    (event) => {
      if (
        event.target === detailDialog
      ) {
        detailDialog.close();
      }
    }
  );

  window.addEventListener(
    "storage",
    (event) => {
      const relevantKeys = [
        ADMIN_TICKETS_STORAGE_KEY,
        CLIENT_TICKETS_STORAGE_KEY,
        TICKET_STATUS_STORAGE_KEY,
        TICKET_ASSIGNMENT_STORAGE_KEY,
        TECHNICIANS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(event.key)
      ) {
        refreshTickets();
      }
    }
  );

  window.addEventListener(
    "hinet:tickets-updated",
    refreshTickets
  );

  refreshTickets();
}