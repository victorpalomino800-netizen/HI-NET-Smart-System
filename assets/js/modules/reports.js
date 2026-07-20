export const REPORTS_MODULE = Object.freeze({
  name: "reports",
  status: "implemented",
  description:
    "Reportes operativos conectados con tickets, solicitudes, inventario, instalaciones y técnicos."
});

const TICKET_STATUS_STORAGE_KEY =
  "hinet_demo_ticket_statuses";

const TICKET_ASSIGNMENTS_STORAGE_KEY =
  "hinet_demo_ticket_assignments";

const CLIENT_REQUESTS_STORAGE_KEY =
  "hinet_demo_client_requests";

const CLIENT_REQUEST_STATUS_STORAGE_KEY =
  "hinet_demo_request_statuses";

const INVENTORY_ITEMS_STORAGE_KEY =
  "hinet_demo_inventory_items";

const INVENTORY_EDITS_STORAGE_KEY =
  "hinet_demo_inventory_edits";

const INVENTORY_MOVEMENTS_STORAGE_KEY =
  "hinet_demo_inventory_movements";

const INSTALLATIONS_STORAGE_KEY =
  "hinet_demo_installations";

const INSTALLATION_EDITS_STORAGE_KEY =
  "hinet_demo_installation_edits";

const TECHNICIANS_STORAGE_KEY =
  "hinet_demo_technicians";

const DEFAULT_TICKETS = [
  {
    id: "ticket-demo-1005",
    code: "T-1005",
    clientName: "Carlos Ramírez",
    subject: "Instalación nueva",
    category: "Instalación",
    priority: "Alta",
    status: "Abierto",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    createdAt: "2026-07-16T09:30:00.000Z"
  },
  {
    id: "ticket-demo-1004",
    code: "T-1004",
    clientName: "María López",
    subject: "Cambio de equipo",
    category: "Soporte",
    priority: "Media",
    status: "En proceso",
    technicianId: "tech-jose",
    technicianName: "José Mendoza",
    createdAt: "2026-07-15T12:10:00.000Z"
  },
  {
    id: "ticket-demo-1003",
    code: "T-1003",
    clientName: "Juan Quispe",
    subject: "Intermitencia nocturna",
    category: "Redes",
    priority: "Media",
    status: "Cerrado",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    createdAt: "2026-07-14T08:20:00.000Z"
  }
];

const DEFAULT_REQUESTS = [
  {
    id: "request-demo-2003",
    code: "REQ-2003",
    clientName: "Alejandro Cliente",
    type: "Instalación",
    status: "Pendiente",
    priority: "Alta",
    createdAt: "2026-07-16T18:30:00.000Z"
  },
  {
    id: "request-demo-2002",
    code: "REQ-2002",
    clientName: "Carlos Ramírez",
    type: "Soporte",
    status: "En revisión",
    priority: "Media",
    createdAt: "2026-07-15T11:00:00.000Z"
  },
  {
    id: "request-demo-2001",
    code: "REQ-2001",
    clientName: "María López",
    type: "Cambio de plan",
    status: "Aprobada",
    priority: "Baja",
    createdAt: "2026-07-14T10:00:00.000Z"
  }
];

const DEFAULT_TECHNICIANS = [
  {
    id: "tech-victor",
    name: "Víctor Técnico",
    email: "tecnico@hinet.com",
    specialty: "Soporte técnico",
    availability: "Disponible",
    status: "Activo"
  },
  {
    id: "tech-jose",
    name: "José Mendoza",
    email: "jose@hinet.com",
    specialty: "Instalación FTTH",
    availability: "En ruta",
    status: "Activo"
  },
  {
    id: "tech-luis",
    name: "Luis Quispe",
    email: "luis@hinet.com",
    specialty: "Redes",
    availability: "Ocupado",
    status: "Activo"
  }
];

const DEFAULT_INVENTORY = [
  {
    id: "inventory-demo-4005",
    code: "INV-4005",
    name: "Router WiFi 6",
    type: "Producto",
    category: "Equipos",
    stock: 8,
    minStock: 3,
    unit: "unidad"
  },
  {
    id: "inventory-demo-4004",
    code: "INV-4004",
    name: "ONU GPON",
    type: "Producto",
    category: "Equipos",
    stock: 4,
    minStock: 4,
    unit: "unidad"
  },
  {
    id: "inventory-demo-4003",
    code: "INV-4003",
    name: "Cable drop de fibra",
    type: "Material",
    category: "Fibra óptica",
    stock: 380,
    minStock: 150,
    unit: "metro"
  },
  {
    id: "inventory-demo-4002",
    code: "INV-4002",
    name: "Conector rápido SC/APC",
    type: "Material",
    category: "Conectores",
    stock: 18,
    minStock: 20,
    unit: "unidad"
  },
  {
    id: "inventory-demo-4001",
    code: "INV-4001",
    name: "Roseta óptica",
    type: "Material",
    category: "Instalación",
    stock: 0,
    minStock: 10,
    unit: "unidad"
  }
];

const DEFAULT_INSTALLATIONS = [
  {
    id: "installation-demo-5003",
    code: "INST-5003",
    clientName: "Carlos Ramírez",
    address: "San Vicente de Cañete",
    serviceType: "Instalación FTTH",
    scheduledDate: "2026-07-20",
    scheduledTime: "10:30",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    priority: "Alta",
    status: "Programada",
    createdAt: "2026-07-16T13:20:00.000Z"
  },
  {
    id: "installation-demo-5002",
    code: "INST-5002",
    clientName: "María López",
    address: "Imperial, Cañete",
    serviceType: "Cambio de equipo",
    scheduledDate: "2026-07-19",
    scheduledTime: "16:00",
    technicianId: "tech-jose",
    technicianName: "José Mendoza",
    priority: "Media",
    status: "En camino",
    createdAt: "2026-07-15T12:10:00.000Z"
  },
  {
    id: "installation-demo-5001",
    code: "INST-5001",
    clientName: "Juan Quispe",
    address: "Quilmaná, Cañete",
    serviceType: "Revisión técnica",
    scheduledDate: "2026-07-18",
    scheduledTime: "09:00",
    technicianId: "tech-victor",
    technicianName: "Víctor Técnico",
    priority: "Media",
    status: "Completada",
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
      `No se pudieron leer registros de ${storageKey}:`,
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(date);
}

function getStatusClass(status) {
  const normalizedStatus =
    normalizeText(status);

  if (
    normalizedStatus.includes("cerrado") ||
    normalizedStatus.includes("completada") ||
    normalizedStatus.includes("aprobada") ||
    normalizedStatus.includes("activo")
  ) {
    return "status--success";
  }

  if (
    normalizedStatus.includes("proceso") ||
    normalizedStatus.includes("camino") ||
    normalizedStatus.includes("revision")
  ) {
    return "status--info";
  }

  if (
    normalizedStatus.includes("cancelada") ||
    normalizedStatus.includes("agotado") ||
    normalizedStatus.includes("critica")
  ) {
    return "status--danger";
  }

  return "status--warning";
}

function getPercent(value, total) {
  if (!total) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((value / total) * 100)
  );
}

function countBy(records, propertyName) {
  return records.reduce(
    (summary, record) => {
      const value =
        record[propertyName] ||
        "Sin definir";

      summary[value] =
        (summary[value] || 0) + 1;

      return summary;
    },
    {}
  );
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
    specialty:
      record.specialty ||
      "Soporte técnico",
    availability:
      record.availability ||
      "Disponible",
    status:
      record.status ||
      "Activo"
  };
}

function normalizeInventoryItem(record, index) {
  return {
    id:
      record.id ??
      `local-inventory-${index}`,
    code:
      record.code ??
      `INV-${String(4101 + index).padStart(4, "0")}`,
    name:
      record.name ||
      "Elemento sin nombre",
    type:
      record.type ||
      "Material",
    category:
      record.category ||
      "General",
    stock:
      Number(record.stock ?? 0),
    minStock:
      Number(record.minStock ?? 0),
    unit:
      record.unit ||
      "unidad"
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
    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function normalizeRequest(record, index) {
  return {
    id:
      record.id ??
      `local-request-${index}`,
    code:
      record.code ??
      `REQ-${String(2101 + index).padStart(4, "0")}`,
    clientName:
      record.clientName ||
      record.name ||
      "Cliente",
    type:
      record.type ||
      record.requestType ||
      "Soporte",
    priority:
      record.priority ||
      "Media",
    status:
      record.status ||
      "Pendiente",
    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function getTickets() {
  const statusChanges =
    readLocalObject(
      TICKET_STATUS_STORAGE_KEY
    );

  const assignmentChanges =
    readLocalObject(
      TICKET_ASSIGNMENTS_STORAGE_KEY
    );

  return DEFAULT_TICKETS.map(
    (ticket) => {
      const status =
        statusChanges[ticket.id] ||
        ticket.status;

      const assignment =
        assignmentChanges[ticket.id] ||
        {};

      return {
        ...ticket,
        status,
        technicianId:
          assignment.technicianId ||
          ticket.technicianId,
        technicianName:
          assignment.technicianName ||
          ticket.technicianName
      };
    }
  );
}

function getRequests() {
  const localRequests =
    readLocalRecords(
      CLIENT_REQUESTS_STORAGE_KEY
    ).map(normalizeRequest);

  const statusChanges =
    readLocalObject(
      CLIENT_REQUEST_STATUS_STORAGE_KEY
    );

  return [
    ...DEFAULT_REQUESTS,
    ...localRequests
  ].map((request) => ({
    ...request,
    status:
      statusChanges[request.id] ||
      request.status
  }));
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

function getInventoryItems() {
  const localItems =
    readLocalRecords(
      INVENTORY_ITEMS_STORAGE_KEY
    ).map(normalizeInventoryItem);

  const edits =
    readLocalObject(
      INVENTORY_EDITS_STORAGE_KEY
    );

  return [
    ...DEFAULT_INVENTORY,
    ...localItems
  ].map((item, index) => {
    const normalizedItem =
      normalizeInventoryItem(
        item,
        index
      );

    const changes =
      edits[normalizedItem.id] ?? {};

    return normalizeInventoryItem(
      {
        ...normalizedItem,
        ...changes
      },
      index
    );
  });
}

function getInstallations() {
  const localInstallations =
    readLocalRecords(
      INSTALLATIONS_STORAGE_KEY
    ).map(normalizeInstallation);

  const edits =
    readLocalObject(
      INSTALLATION_EDITS_STORAGE_KEY
    );

  return [
    ...DEFAULT_INSTALLATIONS,
    ...localInstallations
  ]
    .map((installation, index) => {
      const normalizedInstallation =
        normalizeInstallation(
          installation,
          index
        );

      const changes =
        edits[
          normalizedInstallation.id
        ] ?? {};

      return normalizeInstallation(
        {
          ...normalizedInstallation,
          ...changes
        },
        index
      );
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

        return secondDate - firstDate;
      }
    );
}

function getMovements() {
  return readLocalRecords(
    INVENTORY_MOVEMENTS_STORAGE_KEY
  )
    .map((movement, index) => ({
      id:
        movement.id ??
        `movement-${index}`,
      itemName:
        movement.itemName ||
        movement.productName ||
        "Elemento",
      movementType:
        movement.movementType ||
        movement.type ||
        "Movimiento",
      quantity:
        Number(movement.quantity ?? 0),
      technicianName:
        movement.technicianName ||
        "Sistema",
      createdAt:
        movement.createdAt ||
        new Date().toISOString()
    }))
    .sort(
      (firstMovement, secondMovement) =>
        new Date(secondMovement.createdAt) -
        new Date(firstMovement.createdAt)
    );
}

function getDashboardData() {
  const tickets = getTickets();
  const requests = getRequests();
  const technicians = getTechnicians();
  const inventoryItems = getInventoryItems();
  const installations = getInstallations();
  const movements = getMovements();

  const pendingRequests =
    requests.filter(
      (request) =>
        !["Aprobada", "Rechazada", "Cerrada"].includes(
          request.status
        )
    );

  const activeInstallations =
    installations.filter(
      (installation) =>
        !["Completada", "Cancelada"].includes(
          installation.status
        )
    );

  const lowStockItems =
    inventoryItems.filter(
      (item) =>
        item.stock <= item.minStock
    );

  const outOfStockItems =
    inventoryItems.filter(
      (item) =>
        item.stock <= 0
    );

  return {
    tickets,
    requests,
    pendingRequests,
    technicians,
    inventoryItems,
    lowStockItems,
    outOfStockItems,
    installations,
    activeInstallations,
    movements
  };
}

function renderDistribution(summary, total) {
  const entries =
    Object.entries(summary);

  if (entries.length === 0) {
    return `
      <div class="empty-state">
        <h3>Sin datos</h3>
        <p>Aún no hay registros para mostrar.</p>
      </div>
    `;
  }

  return entries
    .sort((a, b) => b[1] - a[1])
    .map(
      ([label, value]) => {
        const percent =
          getPercent(value, total);

        return `
          <div class="list-item">
            <div class="list-item__main">
              <strong>${escapeHtml(label)}</strong>
              <small>${value} registros · ${percent}%</small>

              <div
                style="
                  margin-top: 8px;
                  height: 8px;
                  border-radius: 999px;
                  background: var(--color-primary-soft);
                  overflow: hidden;
                "
              >
                <div
                  style="
                    width: ${percent}%;
                    height: 100%;
                    border-radius: inherit;
                    background: var(--color-primary);
                  "
                ></div>
              </div>
            </div>

            <span class="status ${getStatusClass(label)}">
              ${value}
            </span>
          </div>
        `;
      }
    )
    .join("");
}

function renderTechnicianLoad(technicians, installations) {
  if (technicians.length === 0) {
    return `
      <div class="empty-state">
        <h3>Sin técnicos</h3>
        <p>Registra técnicos para ver su carga operativa.</p>
      </div>
    `;
  }

  const maxLoad =
    Math.max(
      ...technicians.map((technician) =>
        installations.filter(
          (installation) =>
            installation.technicianId ===
            technician.id
        ).length
      ),
      1
    );

  return technicians
    .map((technician) => {
      const assigned =
        installations.filter(
          (installation) =>
            installation.technicianId ===
            technician.id
        );

      const active =
        assigned.filter(
          (installation) =>
            !["Completada", "Cancelada"].includes(
              installation.status
            )
        );

      const completed =
        assigned.filter(
          (installation) =>
            installation.status === "Completada"
        );

      const percent =
        getPercent(assigned.length, maxLoad);

      return `
        <div class="list-item">
          <div class="list-item__main">
            <strong>${escapeHtml(technician.name)}</strong>
            <small>
              ${escapeHtml(technician.specialty)}
              · ${escapeHtml(technician.availability)}
            </small>

            <small>
              ${assigned.length} asignadas ·
              ${active.length} activas ·
              ${completed.length} completadas
            </small>

            <div
              style="
                margin-top: 8px;
                height: 8px;
                border-radius: 999px;
                background: var(--color-primary-soft);
                overflow: hidden;
              "
            >
              <div
                style="
                  width: ${percent}%;
                  height: 100%;
                  border-radius: inherit;
                  background: var(--color-primary);
                "
              ></div>
            </div>
          </div>

          <span class="status ${getStatusClass(technician.status)}">
            ${escapeHtml(technician.status)}
          </span>
        </div>
      `;
    })
    .join("");
}

function renderLowStock(items) {
  if (items.length === 0) {
    return `
      <div class="empty-state">
        <h3>Stock saludable</h3>
        <p>No hay elementos por debajo del stock mínimo.</p>
      </div>
    `;
  }

  return items
    .map(
      (item) => `
        <div class="list-item">
          <div class="list-item__main">
            <strong>${escapeHtml(item.name)}</strong>
            <small>
              ${escapeHtml(item.code)}
              · ${escapeHtml(item.category)}
              · ${escapeHtml(item.type)}
            </small>
          </div>

          <span class="status ${item.stock <= 0 ? "status--danger" : "status--warning"}">
            ${item.stock} / mínimo ${item.minStock}
          </span>
        </div>
      `
    )
    .join("");
}

function renderMovements(movements) {
  if (movements.length === 0) {
    return `
      <div class="empty-state">
        <h3>Sin movimientos</h3>
        <p>Los movimientos de inventario aparecerán aquí.</p>
      </div>
    `;
  }

  return movements
    .slice(0, 6)
    .map(
      (movement) => `
        <div class="list-item">
          <div class="list-item__main">
            <strong>
              ${escapeHtml(movement.movementType)}
              · ${escapeHtml(movement.itemName)}
            </strong>

            <small>
              Cantidad: ${escapeHtml(movement.quantity)}
              · Responsable: ${escapeHtml(movement.technicianName)}
            </small>
          </div>

          <small>
            ${escapeHtml(formatDate(movement.createdAt))}
          </small>
        </div>
      `
    )
    .join("");
}

function renderRecentInstallations(installations) {
  if (installations.length === 0) {
    return `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <h3>Sin instalaciones</h3>
            <p>Cuando programes instalaciones, aparecerán aquí.</p>
          </div>
        </td>
      </tr>
    `;
  }

  return installations
    .slice(0, 8)
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

          <td>${escapeHtml(installation.technicianName)}</td>

          <td>
            <span class="status ${getStatusClass(installation.status)}">
              ${escapeHtml(installation.status)}
            </span>
          </td>

          <td>
            ${escapeHtml(formatDate(installation.scheduledDate))}
            ${escapeHtml(installation.scheduledTime)}
          </td>

          <td>${escapeHtml(installation.serviceType)}</td>
        </tr>
      `
    )
    .join("");
}

export function renderReportsModule() {
  return `
    <section
      id="reportsModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>Reportes operativos</h2>

            <p style="margin-top: 6px; color: var(--color-muted);">
              Vista general de tickets, solicitudes, instalaciones, técnicos e inventario.
            </p>
          </div>

          <span class="status status--success">
            Datos conectados
          </span>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Tickets</span>
              <div id="reportsTicketsTotal" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">◉</span>
          </div>
          <span class="kpi-card__trend">Tickets registrados</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Solicitudes pendientes</span>
              <div id="reportsRequestsPending" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">▣</span>
          </div>
          <span class="kpi-card__trend">Requieren revisión</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Instalaciones activas</span>
              <div id="reportsInstallationsActive" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">□</span>
          </div>
          <span class="kpi-card__trend">Pendientes o en proceso</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Stock bajo</span>
              <div id="reportsLowStock" class="kpi-card__value">0</div>
            </div>
            <span class="kpi-card__icon">◇</span>
          </div>
          <span class="kpi-card__trend">Elementos por revisar</span>
        </article>
      </section>

      <section class="dashboard-grid">
        <div class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <div>
                <h2>Tickets por estado</h2>
                <p style="margin-top: 6px; color: var(--color-muted);">
                  Distribución operativa de atención.
                </p>
              </div>
            </header>

            <div id="reportsTicketsDistribution" class="list"></div>
          </article>

          <article class="card">
            <header class="card__header">
              <div>
                <h2>Instalaciones por estado</h2>
                <p style="margin-top: 6px; color: var(--color-muted);">
                  Avance de trabajos programados.
                </p>
              </div>
            </header>

            <div id="reportsInstallationsDistribution" class="list"></div>
          </article>
        </div>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <div>
                <h2>Carga por técnico</h2>
                <p style="margin-top: 6px; color: var(--color-muted);">
                  Asignaciones y trabajos activos.
                </p>
              </div>
            </header>

            <div id="reportsTechnicianLoad" class="list"></div>
          </article>
        </aside>
      </section>

      <section class="dashboard-grid">
        <article class="card">
          <header class="card__header">
            <div>
              <h2>Inventario crítico</h2>
              <p style="margin-top: 6px; color: var(--color-muted);">
                Elementos agotados o por debajo del mínimo.
              </p>
            </div>
          </header>

          <div id="reportsLowStockList" class="list"></div>
        </article>

        <article class="card">
          <header class="card__header">
            <div>
              <h2>Movimientos recientes</h2>
              <p style="margin-top: 6px; color: var(--color-muted);">
                Últimas entradas y salidas registradas.
              </p>
            </div>
          </header>

          <div id="reportsMovementsList" class="list"></div>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Últimas instalaciones</h2>
            <p style="margin-top: 6px; color: var(--color-muted);">
              Resumen de trabajos programados y ejecutados.
            </p>
          </div>
        </header>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Servicio</th>
              </tr>
            </thead>

            <tbody id="reportsInstallationsTable"></tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

export function initReportsModule() {
  const moduleRoot =
    document.querySelector("#reportsModule");

  if (
    !moduleRoot ||
    moduleRoot.dataset.initialized === "true"
  ) {
    return;
  }

  moduleRoot.dataset.initialized = "true";

  const ticketsTotal =
    document.querySelector(
      "#reportsTicketsTotal"
    );

  const requestsPending =
    document.querySelector(
      "#reportsRequestsPending"
    );

  const installationsActive =
    document.querySelector(
      "#reportsInstallationsActive"
    );

  const lowStockTotal =
    document.querySelector(
      "#reportsLowStock"
    );

  const ticketsDistribution =
    document.querySelector(
      "#reportsTicketsDistribution"
    );

  const installationsDistribution =
    document.querySelector(
      "#reportsInstallationsDistribution"
    );

  const technicianLoad =
    document.querySelector(
      "#reportsTechnicianLoad"
    );

  const lowStockList =
    document.querySelector(
      "#reportsLowStockList"
    );

  const movementsList =
    document.querySelector(
      "#reportsMovementsList"
    );

  const installationsTable =
    document.querySelector(
      "#reportsInstallationsTable"
    );

  function refreshReports() {
    const data =
      getDashboardData();

    ticketsTotal.textContent =
      data.tickets.length;

    requestsPending.textContent =
      data.pendingRequests.length;

    installationsActive.textContent =
      data.activeInstallations.length;

    lowStockTotal.textContent =
      data.lowStockItems.length;

    ticketsDistribution.innerHTML =
      renderDistribution(
        countBy(data.tickets, "status"),
        data.tickets.length
      );

    installationsDistribution.innerHTML =
      renderDistribution(
        countBy(data.installations, "status"),
        data.installations.length
      );

    technicianLoad.innerHTML =
      renderTechnicianLoad(
        data.technicians,
        data.installations
      );

    lowStockList.innerHTML =
      renderLowStock(
        data.lowStockItems
      );

    movementsList.innerHTML =
      renderMovements(
        data.movements
      );

    installationsTable.innerHTML =
      renderRecentInstallations(
        data.installations
      );
  }

  window.addEventListener(
    "storage",
    (event) => {
      const relevantKeys = [
        TICKET_STATUS_STORAGE_KEY,
        TICKET_ASSIGNMENTS_STORAGE_KEY,
        CLIENT_REQUESTS_STORAGE_KEY,
        CLIENT_REQUEST_STATUS_STORAGE_KEY,
        INVENTORY_ITEMS_STORAGE_KEY,
        INVENTORY_EDITS_STORAGE_KEY,
        INVENTORY_MOVEMENTS_STORAGE_KEY,
        INSTALLATIONS_STORAGE_KEY,
        INSTALLATION_EDITS_STORAGE_KEY,
        TECHNICIANS_STORAGE_KEY
      ];

      if (relevantKeys.includes(event.key)) {
        refreshReports();
      }
    }
  );

  [
    "hinet:tickets-updated",
    "hinet:requests-updated",
    "hinet:inventory-updated",
    "hinet:installations-updated",
    "hinet:technicians-updated"
  ].forEach((eventName) => {
    window.addEventListener(
      eventName,
      refreshReports
    );
  });

  refreshReports();
}
