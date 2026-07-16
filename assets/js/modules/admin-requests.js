const CLIENT_REQUESTS_STORAGE_KEY =
  "hinet_demo_client_requests";

const REQUEST_STATUS_STORAGE_KEY =
  "hinet_demo_request_statuses";

const DEFAULT_REQUESTS = [
  {
    id: "request-demo-2002",
    code: "S-2002",
    client: "Alejandro Cliente",
    requestType: "Consulta de cobertura",
    subject: "Cobertura en Quilmaná",
    description:
      "Deseo conocer si existe cobertura disponible en mi dirección.",
    status: "En proceso",
    createdAt: "2026-07-15T18:30:00.000Z"
  },
  {
    id: "request-demo-2001",
    code: "S-2001",
    client: "Alejandro Cliente",
    requestType: "Cambio de plan",
    subject: "Mejorar velocidad de internet",
    description:
      "Solicito información para cambiar mi plan actual.",
    status: "Completada",
    createdAt: "2026-07-13T15:10:00.000Z"
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
      "No se pudieron leer las solicitudes:",
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
    "Completada",
    "Cancelada"
  ];

  return validStatuses.includes(status)
    ? status
    : "Pendiente";
}

function normalizeRequest(record, index) {
  return {
    id:
      record.id ??
      `client-request-${index}`,

    code:
      record.code ??
      `S-${String(2101 + index).padStart(
        4,
        "0"
      )}`,

    client:
      record.client ||
      "Alejandro Cliente",

    requestType:
      record.requestType ||
      "Solicitud general",

    subject:
      record.subject ||
      "Sin asunto",

    description:
      record.description ||
      "Sin descripción registrada.",

    status:
      normalizeStatus(record.status),

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function getAllRequests() {
  const localRequests =
    readLocalRecords(
      CLIENT_REQUESTS_STORAGE_KEY
    ).map(normalizeRequest);

  const storedStatuses =
    readLocalObject(
      REQUEST_STATUS_STORAGE_KEY
    );

  return [
    ...DEFAULT_REQUESTS,
    ...localRequests
  ]
    .map((request) => ({
      ...request,

      status: normalizeStatus(
        storedStatuses[request.id] ??
          request.status
      )
    }))
    .sort(
      (firstRequest, secondRequest) => {
        const firstDate =
          new Date(firstRequest.createdAt);

        const secondDate =
          new Date(secondRequest.createdAt);

        return secondDate - firstDate;
      }
    );
}

function saveRequestStatus(
  requestId,
  status
) {
  const storedStatuses =
    readLocalObject(
      REQUEST_STATUS_STORAGE_KEY
    );

  storedStatuses[requestId] =
    normalizeStatus(status);

  localStorage.setItem(
    REQUEST_STATUS_STORAGE_KEY,
    JSON.stringify(storedStatuses)
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:requests-updated"
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
    Completada: "status--success",
    Cancelada: "status--danger"
  };

  return (
    statusClasses[status] ||
    "status--warning"
  );
}

function renderStatusOptions(
  currentStatus
) {
  const statuses = [
    "Pendiente",
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

function renderRequestRows(requests) {
  if (requests.length === 0) {
    return `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <h3>
              No se encontraron solicitudes
            </h3>

            <p>
              Prueba cambiando la búsqueda
              o los filtros.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return requests
    .map(
      (request) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(request.code)}
            </strong>
          </td>

          <td>
            ${escapeHtml(request.client)}
          </td>

          <td>
            ${escapeHtml(
              request.requestType
            )}
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(
                  request.subject
                )}
              </strong>

              <small>
                Portal del cliente
              </small>
            </div>
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  request.status
                )}
              "
            >
              ${escapeHtml(
                request.status
              )}
            </span>
          </td>

          <td>
            ${escapeHtml(
              formatDate(
                request.createdAt
              )
            )}
          </td>

          <td>
            <button
              class="
                button
                button--secondary
                admin-request-view
              "
              type="button"
              data-request-id="${
                escapeHtml(request.id)
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

function renderRequestDetail(request) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Solicitud</span>

        <strong>
          #${escapeHtml(request.code)}
        </strong>
      </div>

      <div class="list-item">
        <span>Cliente</span>

        <strong>
          ${escapeHtml(request.client)}
        </strong>
      </div>

      <div class="list-item">
        <span>Tipo</span>

        <strong>
          ${escapeHtml(
            request.requestType
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Asunto</span>

        <strong>
          ${escapeHtml(request.subject)}
        </strong>
      </div>

      <div class="list-item">
        <span>Estado actual</span>

        <span
          class="
            status
            ${getStatusClass(
              request.status
            )}
          "
        >
          ${escapeHtml(request.status)}
        </span>
      </div>

      <div class="list-item">
        <span>Fecha</span>

        <strong>
          ${escapeHtml(
            formatDate(
              request.createdAt
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
          request.description
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
        <label for="adminRequestStatus">
          Actualizar estado
        </label>

        <div class="input-group">
          <select id="adminRequestStatus">
            ${renderStatusOptions(
              request.status
            )}
          </select>
        </div>
      </div>

      <button
        id="saveAdminRequestStatus"
        class="
          button
          button--primary
          button--block
        "
        type="button"
        data-request-id="${
          escapeHtml(request.id)
        }"
        style="margin-top: 14px;"
      >
        Guardar estado
      </button>

      <p
        id="adminRequestMessage"
        class="form-message"
        role="status"
        aria-live="polite"
      ></p>
    </div>
  `;
}

export function renderAdminRequestsModule() {
  return `
    <section
      id="adminRequestsModule"
      class="dashboard-stack"
    >
      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Total
              </span>

              <div
                id="adminRequestsTotal"
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
            Solicitudes registradas
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Pendientes
              </span>

              <div
                id="adminRequestsPending"
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
            Esperando atención
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                En proceso
              </span>

              <div
                id="adminRequestsProgress"
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
            Siendo atendidas
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Completadas
              </span>

              <div
                id="adminRequestsCompleted"
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
            Solicitudes finalizadas
          </span>
        </article>
      </section>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Buscar y filtrar solicitudes
            </h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Busca por número, cliente,
              tipo o asunto.
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
            <label for="adminRequestSearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="adminRequestSearch"
                type="search"
                placeholder="
                  Número, cliente o asunto...
                "
              >
            </div>
          </div>

          <div class="form-field">
            <label
              for="adminRequestStatusFilter"
            >
              Estado
            </label>

            <div class="input-group">
              <select
                id="adminRequestStatusFilter"
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

                <option value="Completada">
                  Completada
                </option>

                <option value="Cancelada">
                  Cancelada
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label
              for="adminRequestTypeFilter"
            >
              Tipo
            </label>

            <div class="input-group">
              <select
                id="adminRequestTypeFilter"
              >
                <option value="">
                  Todos los tipos
                </option>

                <option value="Nuevo servicio">
                  Nuevo servicio
                </option>

                <option value="Cambio de plan">
                  Cambio de plan
                </option>

                <option value="Cambio de dirección">
                  Cambio de dirección
                </option>

                <option value="Consulta de cobertura">
                  Consulta de cobertura
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
              Solicitudes de clientes
            </h2>

            <p
              id="adminRequestsResults"
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
                <th>Solicitud</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody
              id="adminRequestsBody"
            ></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="adminRequestDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span
              class="eyebrow eyebrow--dark"
            >
              Solicitud del cliente
            </span>

            <h2 id="adminRequestTitle">
              Detalle
            </h2>
          </div>

          <button
            id="closeAdminRequest"
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
          id="adminRequestContent"
        ></div>

        <footer class="modal__actions">
          <button
            id="closeAdminRequestFooter"
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

export function initAdminRequestsModule() {
  const moduleRoot =
    document.querySelector(
      "#adminRequestsModule"
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
      "#adminRequestSearch"
    );

  const statusFilter =
    document.querySelector(
      "#adminRequestStatusFilter"
    );

  const typeFilter =
    document.querySelector(
      "#adminRequestTypeFilter"
    );

  const tableBody =
    document.querySelector(
      "#adminRequestsBody"
    );

  const resultCount =
    document.querySelector(
      "#adminRequestsResults"
    );

  const totalCount =
    document.querySelector(
      "#adminRequestsTotal"
    );

  const pendingCount =
    document.querySelector(
      "#adminRequestsPending"
    );

  const progressCount =
    document.querySelector(
      "#adminRequestsProgress"
    );

  const completedCount =
    document.querySelector(
      "#adminRequestsCompleted"
    );

  const detailDialog =
    document.querySelector(
      "#adminRequestDialog"
    );

  const detailTitle =
    document.querySelector(
      "#adminRequestTitle"
    );

  const detailContent =
    document.querySelector(
      "#adminRequestContent"
    );

  const closeButton =
    document.querySelector(
      "#closeAdminRequest"
    );

  const closeFooter =
    document.querySelector(
      "#closeAdminRequestFooter"
    );

  let requests = [];

  function updateCounters() {
    totalCount.textContent =
      requests.length;

    pendingCount.textContent =
      requests.filter(
        (request) =>
          request.status === "Pendiente"
      ).length;

    progressCount.textContent =
      requests.filter(
        (request) =>
          request.status === "En proceso"
      ).length;

    completedCount.textContent =
      requests.filter(
        (request) =>
          request.status === "Completada"
      ).length;
  }

  function getFilteredRequests() {
    const searchValue =
      searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus =
      statusFilter.value;

    const selectedType =
      typeFilter.value;

    return requests.filter((request) => {
      const searchableContent = [
        request.code,
        request.client,
        request.requestType,
        request.subject,
        request.description
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
        request.status ===
          selectedStatus;

      const matchesType =
        !selectedType ||
        request.requestType ===
          selectedType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }

  function renderTable() {
    const filteredRequests =
      getFilteredRequests();

    tableBody.innerHTML =
      renderRequestRows(
        filteredRequests
      );

    resultCount.textContent =
      `${filteredRequests.length} ${
        filteredRequests.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function refreshRequests() {
    requests = getAllRequests();

    updateCounters();
    renderTable();
  }

  function openRequestDetail(requestId) {
    const request = requests.find(
      (currentRequest) =>
        currentRequest.id === requestId
    );

    if (!request) {
      return;
    }

    detailTitle.textContent =
      `Solicitud #${request.code}`;

    detailContent.innerHTML =
      renderRequestDetail(request);

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

  typeFilter.addEventListener(
    "change",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const viewButton =
        event.target.closest(
          ".admin-request-view"
        );

      if (!viewButton) {
        return;
      }

      openRequestDetail(
        viewButton.dataset.requestId
      );
    }
  );

  detailContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveAdminRequestStatus"
        );

      if (!saveButton) {
        return;
      }

      const statusSelect =
        detailContent.querySelector(
          "#adminRequestStatus"
        );

      if (!statusSelect) {
        return;
      }

      const requestId =
        saveButton.dataset.requestId;

      saveRequestStatus(
        requestId,
        statusSelect.value
      );

      refreshRequests();

      const updatedRequest =
        requests.find(
          (request) =>
            request.id === requestId
        );

      if (!updatedRequest) {
        detailDialog.close();
        return;
      }

      detailTitle.textContent =
        `Solicitud #${updatedRequest.code}`;

      detailContent.innerHTML =
        renderRequestDetail(
          updatedRequest
        );

      const message =
        detailContent.querySelector(
          "#adminRequestMessage"
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
        CLIENT_REQUESTS_STORAGE_KEY,
        REQUEST_STATUS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(event.key)
      ) {
        refreshRequests();
      }
    }
  );

  window.addEventListener(
    "hinet:requests-updated",
    refreshRequests
  );

  refreshRequests();
}