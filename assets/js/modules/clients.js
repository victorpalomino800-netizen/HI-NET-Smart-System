const CLIENTS_STORAGE_KEY =
  "hinet_demo_clients";

const CLIENT_EDITS_STORAGE_KEY =
  "hinet_demo_client_edits";

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
      "No se pudieron leer los clientes:",
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
    "Activo",
    "Pendiente",
    "Suspendido"
  ];

  return validStatuses.includes(status)
    ? status
    : "Activo";
}

function normalizePlan(plan) {
  const validPlans = [
    "Plan Básico",
    "Plan Hogar",
    "Plan Gamer",
    "Plan Empresa"
  ];

  return validPlans.includes(plan)
    ? plan
    : "Plan Básico";
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
      normalizePlan(record.plan),

    status:
      normalizeStatus(record.status),

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function getAllClients() {
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
  ]
    .map((client) => {
      const changes =
        storedEdits[client.id] ?? {};

      return {
        ...client,
        ...changes,
        plan: normalizePlan(
          changes.plan ?? client.plan
        ),
        status: normalizeStatus(
          changes.status ?? client.status
        )
      };
    })
    .sort(
      (firstClient, secondClient) => {
        const firstDate =
          new Date(firstClient.createdAt);

        const secondDate =
          new Date(secondClient.createdAt);

        return secondDate - firstDate;
      }
    );
}

function saveClientChanges(
  clientId,
  changes
) {
  const storedEdits =
    readLocalObject(
      CLIENT_EDITS_STORAGE_KEY
    );

  storedEdits[clientId] = {
    ...(storedEdits[clientId] ?? {}),
    ...changes
  };

  localStorage.setItem(
    CLIENT_EDITS_STORAGE_KEY,
    JSON.stringify(storedEdits)
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:clients-updated"
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
  const date = new Date(dateValue);

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
  const statusClasses = {
    Activo: "status--success",
    Pendiente: "status--warning",
    Suspendido: "status--danger"
  };

  return (
    statusClasses[status] ||
    "status--warning"
  );
}

function renderPlanOptions(currentPlan) {
  const plans = [
    "Plan Básico",
    "Plan Hogar",
    "Plan Gamer",
    "Plan Empresa"
  ];

  return plans
    .map(
      (plan) => `
        <option
          value="${plan}"
          ${plan === currentPlan ? "selected" : ""}
        >
          ${plan}
        </option>
      `
    )
    .join("");
}

function renderStatusOptions(
  currentStatus
) {
  const statuses = [
    "Activo",
    "Pendiente",
    "Suspendido"
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

function renderClientRows(clients) {
  if (clients.length === 0) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>
              No se encontraron clientes
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

  return clients
    .map(
      (client) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(client.code)}
            </strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(client.name)}
              </strong>

              <small>
                ${escapeHtml(client.email)}
              </small>
            </div>
          </td>

          <td>
            ${escapeHtml(client.phone)}
          </td>

          <td>
            ${escapeHtml(client.address)}
          </td>

          <td>
            ${escapeHtml(client.plan)}
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  client.status
                )}
              "
            >
              ${escapeHtml(client.status)}
            </span>
          </td>

          <td>
            ${escapeHtml(
              formatDate(client.createdAt)
            )}
          </td>

          <td>
            <button
              class="
                button
                button--secondary
                client-view-button
              "
              type="button"
              data-client-id="${
                escapeHtml(client.id)
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

function renderClientDetail(client) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Código</span>

        <strong>
          #${escapeHtml(client.code)}
        </strong>
      </div>

      <div class="list-item">
        <span>Fecha de registro</span>

        <strong>
          ${escapeHtml(
            formatDate(client.createdAt)
          )}
        </strong>
      </div>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="clientEditName">
          Nombre completo
        </label>

        <div class="input-group">
          <input
            id="clientEditName"
            type="text"
            value="${escapeHtml(client.name)}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="clientEditEmail">
          Correo electrónico
        </label>

        <div class="input-group">
          <input
            id="clientEditEmail"
            type="email"
            value="${escapeHtml(client.email)}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="clientEditPhone">
          Teléfono
        </label>

        <div class="input-group">
          <input
            id="clientEditPhone"
            type="tel"
            value="${escapeHtml(client.phone)}"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="clientEditPlan">
          Plan contratado
        </label>

        <div class="input-group">
          <select id="clientEditPlan">
            ${renderPlanOptions(client.plan)}
          </select>
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="clientEditAddress">
          Dirección
        </label>

        <div class="input-group">
          <input
            id="clientEditAddress"
            type="text"
            value="${escapeHtml(client.address)}"
          >
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="clientEditStatus">
          Estado del cliente
        </label>

        <div class="input-group">
          <select id="clientEditStatus">
            ${renderStatusOptions(
              client.status
            )}
          </select>
        </div>
      </div>
    </div>

    <button
      id="saveClientChanges"
      class="
        button
        button--primary
        button--block
      "
      type="button"
      data-client-id="${escapeHtml(client.id)}"
      style="margin-top: 18px;"
    >
      Guardar cambios
    </button>

    <p
      id="clientEditMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

export function renderClientsModule() {
  return `
    <section
      id="clientsModule"
      class="dashboard-stack"
    >
      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Total de clientes
              </span>

              <div
                id="clientsTotal"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ♙
            </span>
          </div>

          <span class="kpi-card__trend">
            Clientes registrados
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Activos
              </span>

              <div
                id="clientsActive"
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
            Servicio habilitado
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Pendientes
              </span>

              <div
                id="clientsPending"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              !
            </span>
          </div>

          <span class="kpi-card__trend">
            Esperando activación
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Suspendidos
              </span>

              <div
                id="clientsSuspended"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">
              ×
            </span>
          </div>

          <span class="kpi-card__trend">
            Servicio suspendido
          </span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Buscar y filtrar clientes
            </h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Busca por código, nombre,
              correo o teléfono.
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
            <label for="clientSearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="clientSearch"
                type="search"
                placeholder="
                  Código, nombre o correo...
                "
              >
            </div>
          </div>

          <div class="form-field">
            <label for="clientStatusFilter">
              Estado
            </label>

            <div class="input-group">
              <select id="clientStatusFilter">
                <option value="">
                  Todos los estados
                </option>

                <option value="Activo">
                  Activo
                </option>

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="Suspendido">
                  Suspendido
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="clientPlanFilter">
              Plan
            </label>

            <div class="input-group">
              <select id="clientPlanFilter">
                <option value="">
                  Todos los planes
                </option>

                <option value="Plan Básico">
                  Plan Básico
                </option>

                <option value="Plan Hogar">
                  Plan Hogar
                </option>

                <option value="Plan Gamer">
                  Plan Gamer
                </option>

                <option value="Plan Empresa">
                  Plan Empresa
                </option>
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Listado de clientes</h2>

            <p
              id="clientsResults"
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
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="clientsTableBody"></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="clientDetailDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span
              class="eyebrow eyebrow--dark"
            >
              Información del cliente
            </span>

            <h2 id="clientDetailTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeClientDetail"
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

        <div id="clientDetailContent"></div>

        <footer class="modal__actions">
          <button
            id="closeClientDetailFooter"
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

export function initClientsModule() {
  const moduleRoot =
    document.querySelector(
      "#clientsModule"
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
      "#clientSearch"
    );

  const statusFilter =
    document.querySelector(
      "#clientStatusFilter"
    );

  const planFilter =
    document.querySelector(
      "#clientPlanFilter"
    );

  const tableBody =
    document.querySelector(
      "#clientsTableBody"
    );

  const resultCount =
    document.querySelector(
      "#clientsResults"
    );

  const totalCount =
    document.querySelector(
      "#clientsTotal"
    );

  const activeCount =
    document.querySelector(
      "#clientsActive"
    );

  const pendingCount =
    document.querySelector(
      "#clientsPending"
    );

  const suspendedCount =
    document.querySelector(
      "#clientsSuspended"
    );

  const detailDialog =
    document.querySelector(
      "#clientDetailDialog"
    );

  const detailTitle =
    document.querySelector(
      "#clientDetailTitle"
    );

  const detailContent =
    document.querySelector(
      "#clientDetailContent"
    );

  const closeButton =
    document.querySelector(
      "#closeClientDetail"
    );

  const closeFooter =
    document.querySelector(
      "#closeClientDetailFooter"
    );

  let clients = [];

  function updateCounters() {
    totalCount.textContent =
      clients.length;

    activeCount.textContent =
      clients.filter(
        (client) =>
          client.status === "Activo"
      ).length;

    pendingCount.textContent =
      clients.filter(
        (client) =>
          client.status === "Pendiente"
      ).length;

    suspendedCount.textContent =
      clients.filter(
        (client) =>
          client.status === "Suspendido"
      ).length;
  }

  function getFilteredClients() {
    const searchValue =
      searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus =
      statusFilter.value;

    const selectedPlan =
      planFilter.value;

    return clients.filter((client) => {
      const searchableContent = [
        client.code,
        client.name,
        client.email,
        client.phone,
        client.address
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
        client.status ===
          selectedStatus;

      const matchesPlan =
        !selectedPlan ||
        client.plan ===
          selectedPlan;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan
      );
    });
  }

  function renderTable() {
    const filteredClients =
      getFilteredClients();

    tableBody.innerHTML =
      renderClientRows(
        filteredClients
      );

    resultCount.textContent =
      `${filteredClients.length} ${
        filteredClients.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshClients() {
    clients = getAllClients();

    updateCounters();
    renderTable();
  }

  function openClientDetail(clientId) {
    const client = clients.find(
      (currentClient) =>
        currentClient.id === clientId
    );

    if (!client) {
      return;
    }

    detailTitle.textContent =
      client.name;

    detailContent.innerHTML =
      renderClientDetail(client);

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

  planFilter.addEventListener(
    "change",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".client-view-button"
        );

      if (!viewButton) {
        return;
      }

      openClientDetail(
        viewButton.dataset.clientId
      );
    }
  );

  detailContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveClientChanges"
        );

      if (!saveButton) {
        return;
      }

      const nameInput =
        detailContent.querySelector(
          "#clientEditName"
        );

      const emailInput =
        detailContent.querySelector(
          "#clientEditEmail"
        );

      const phoneInput =
        detailContent.querySelector(
          "#clientEditPhone"
        );

      const addressInput =
        detailContent.querySelector(
          "#clientEditAddress"
        );

      const planSelect =
        detailContent.querySelector(
          "#clientEditPlan"
        );

      const statusSelect =
        detailContent.querySelector(
          "#clientEditStatus"
        );

      const message =
        detailContent.querySelector(
          "#clientEditMessage"
        );

      if (
        !nameInput ||
        !emailInput ||
        !phoneInput ||
        !addressInput ||
        !planSelect ||
        !statusSelect
      ) {
        return;
      }

      if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        !phoneInput.value.trim() ||
        !addressInput.value.trim()
      ) {
        if (message) {
          message.textContent =
            "Completa todos los campos obligatorios.";

          message.classList.remove(
            "is-success"
          );
        }

        return;
      }

      const clientId =
        saveButton.dataset.clientId;

      saveClientChanges(
        clientId,
        {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          address:
            addressInput.value.trim(),
          plan: planSelect.value,
          status: statusSelect.value
        }
      );

      refreshClients();

      const updatedClient =
        clients.find(
          (client) =>
            client.id === clientId
        );

      if (!updatedClient) {
        detailDialog.close();
        return;
      }

      detailTitle.textContent =
        updatedClient.name;

      detailContent.innerHTML =
        renderClientDetail(
          updatedClient
        );

      const updatedMessage =
        detailContent.querySelector(
          "#clientEditMessage"
        );

      if (updatedMessage) {
        updatedMessage.textContent =
          "Cliente actualizado correctamente.";

        updatedMessage.classList.add(
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
        CLIENTS_STORAGE_KEY,
        CLIENT_EDITS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(event.key)
      ) {
        refreshClients();
      }
    }
  );

  window.addEventListener(
    "hinet:clients-updated",
    refreshClients
  );

  refreshClients();
}