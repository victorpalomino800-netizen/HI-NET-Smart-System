const INVENTORY_ITEMS_STORAGE_KEY =
  "hinet_demo_inventory_items";

const INVENTORY_EDITS_STORAGE_KEY =
  "hinet_demo_inventory_edits";

const INVENTORY_MOVEMENTS_STORAGE_KEY =
  "hinet_demo_inventory_movements";

const DEFAULT_ITEMS = [
  {
    id: "inventory-demo-4005",
    code: "INV-4005",
    name: "Router WiFi 6",
    type: "Producto",
    category: "Equipos",
    unit: "unidad",
    stock: 8,
    minimumStock: 3,
    location: "Almacén principal",
    description:
      "Router de doble banda para instalaciones residenciales.",
    createdAt: "2026-07-15T19:10:00.000Z"
  },
  {
    id: "inventory-demo-4004",
    code: "INV-4004",
    name: "ONU GPON",
    type: "Producto",
    category: "Equipos",
    unit: "unidad",
    stock: 4,
    minimumStock: 4,
    location: "Almacén principal",
    description:
      "Equipo terminal óptico utilizado en instalaciones FTTH.",
    createdAt: "2026-07-14T15:20:00.000Z"
  },
  {
    id: "inventory-demo-4003",
    code: "INV-4003",
    name: "Cable drop de fibra",
    type: "Material",
    category: "Fibra óptica",
    unit: "metro",
    stock: 380,
    minimumStock: 150,
    location: "Estante B-02",
    description:
      "Cable drop para acometidas de instalaciones de fibra óptica.",
    createdAt: "2026-07-12T12:30:00.000Z"
  },
  {
    id: "inventory-demo-4002",
    code: "INV-4002",
    name: "Conector rápido SC/APC",
    type: "Material",
    category: "Conectores",
    unit: "unidad",
    stock: 18,
    minimumStock: 20,
    location: "Estante A-03",
    description:
      "Conector rápido para terminaciones de fibra óptica.",
    createdAt: "2026-07-10T10:15:00.000Z"
  },
  {
    id: "inventory-demo-4001",
    code: "INV-4001",
    name: "Roseta óptica",
    type: "Material",
    category: "Instalación",
    unit: "unidad",
    stock: 0,
    minimumStock: 10,
    location: "Estante A-01",
    description:
      "Roseta de terminación óptica para instalaciones domiciliarias.",
    createdAt: "2026-07-05T09:00:00.000Z"
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

function normalizeNumber(value, fallback = 0) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? Math.max(0, parsedValue)
    : fallback;
}

function normalizeType(type) {
  return ["Producto", "Material"].includes(type)
    ? type
    : "Material";
}

function normalizeItem(record, index) {
  return {
    id:
      record.id ??
      `local-inventory-${index}`,

    code:
      record.code ??
      `INV-${String(4101 + index).padStart(
        4,
        "0"
      )}`,

    name:
      record.name ||
      "Elemento sin nombre",

    type:
      normalizeType(record.type),

    category:
      record.category ||
      "Sin categoría",

    unit:
      record.unit ||
      "unidad",

    stock:
      normalizeNumber(record.stock),

    minimumStock:
      normalizeNumber(
        record.minimumStock
      ),

    location:
      record.location ||
      "Sin ubicación",

    description:
      record.description ||
      "Sin descripción registrada.",

    createdAt:
      record.createdAt ||
      new Date().toISOString()
  };
}

function getStockStatus(item) {
  if (item.stock <= 0) {
    return "Agotado";
  }

  if (item.stock <= item.minimumStock) {
    return "Stock bajo";
  }

  return "Disponible";
}

function getAllItems() {
  const localItems =
    readLocalRecords(
      INVENTORY_ITEMS_STORAGE_KEY
    ).map(normalizeItem);

  const storedEdits =
    readLocalObject(
      INVENTORY_EDITS_STORAGE_KEY
    );

  return [
    ...DEFAULT_ITEMS,
    ...localItems
  ]
    .map((item) => {
      const changes =
        storedEdits[item.id] ?? {};

      const normalizedItem = {
        ...item,
        ...changes,
        type: normalizeType(
          changes.type ?? item.type
        ),
        stock: normalizeNumber(
          changes.stock ?? item.stock
        ),
        minimumStock: normalizeNumber(
          changes.minimumStock ??
            item.minimumStock
        )
      };

      return {
        ...normalizedItem,
        status:
          getStockStatus(normalizedItem)
      };
    })
    .sort(
      (firstItem, secondItem) => {
        const firstDate =
          new Date(firstItem.createdAt);

        const secondDate =
          new Date(secondItem.createdAt);

        return secondDate - firstDate;
      }
    );
}

function saveItemChanges(itemId, changes) {
  const storedEdits =
    readLocalObject(
      INVENTORY_EDITS_STORAGE_KEY
    );

  storedEdits[itemId] = {
    ...(storedEdits[itemId] ?? {}),
    ...changes
  };

  localStorage.setItem(
    INVENTORY_EDITS_STORAGE_KEY,
    JSON.stringify(storedEdits)
  );

  dispatchInventoryUpdate();
}

function createItem(itemData) {
  const localItems =
    readLocalRecords(
      INVENTORY_ITEMS_STORAGE_KEY
    );

  const now = Date.now();

  const newItem = normalizeItem(
    {
      id: `inventory-${now}`,
      code: `INV-${String(now).slice(-4)}`,
      ...itemData,
      createdAt: new Date().toISOString()
    },
    localItems.length
  );

  localItems.unshift(newItem);

  saveLocalRecords(
    INVENTORY_ITEMS_STORAGE_KEY,
    localItems
  );

  dispatchInventoryUpdate();
}

function registerMovement({
  item,
  movementType,
  quantity,
  note
}) {
  const normalizedQuantity =
    normalizeNumber(quantity);

  if (normalizedQuantity <= 0) {
    return {
      ok: false,
      message:
        "La cantidad debe ser mayor que cero."
    };
  }

  const isExit =
    movementType === "Salida";

  if (
    isExit &&
    normalizedQuantity > item.stock
  ) {
    return {
      ok: false,
      message:
        "La salida supera el stock disponible."
    };
  }

  const newStock = isExit
    ? item.stock - normalizedQuantity
    : item.stock + normalizedQuantity;

  saveItemChanges(item.id, {
    stock: newStock
  });

  const movements =
    readLocalRecords(
      INVENTORY_MOVEMENTS_STORAGE_KEY
    );

  movements.unshift({
    id: `movement-${Date.now()}`,
    itemId: item.id,
    itemCode: item.code,
    itemName: item.name,
    movementType,
    quantity: normalizedQuantity,
    previousStock: item.stock,
    newStock,
    note:
      String(note ?? "").trim() ||
      "Sin observación",
    createdAt: new Date().toISOString()
  });

  saveLocalRecords(
    INVENTORY_MOVEMENTS_STORAGE_KEY,
    movements
  );

  dispatchInventoryUpdate();

  return {
    ok: true,
    message:
      "Movimiento registrado correctamente."
  };
}

function dispatchInventoryUpdate() {
  window.dispatchEvent(
    new CustomEvent(
      "hinet:inventory-updated"
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
    Disponible: "status--success",
    "Stock bajo": "status--warning",
    Agotado: "status--danger"
  };

  return (
    statusClasses[status] ||
    "status--warning"
  );
}

function renderTypeOptions(currentType) {
  return ["Producto", "Material"]
    .map(
      (type) => `
        <option
          value="${type}"
          ${
            type === currentType
              ? "selected"
              : ""
          }
        >
          ${type}
        </option>
      `
    )
    .join("");
}

function renderItemRows(items) {
  if (items.length === 0) {
    return `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <h3>
              No se encontraron elementos
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

  return items
    .map(
      (item) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(item.code)}
            </strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(item.name)}
              </strong>

              <small>
                ${escapeHtml(item.location)}
              </small>
            </div>
          </td>

          <td>${escapeHtml(item.type)}</td>

          <td>
            ${escapeHtml(item.category)}
          </td>

          <td>
            <strong>${item.stock}</strong>
            ${escapeHtml(item.unit)}
          </td>

          <td>
            ${item.minimumStock}
            ${escapeHtml(item.unit)}
          </td>

          <td>
            <span
              class="status ${getStatusClass(
                item.status
              )}"
            >
              ${escapeHtml(item.status)}
            </span>
          </td>

          <td>
            ${escapeHtml(
              formatDate(item.createdAt)
            )}
          </td>

          <td>
            <button
              class="button button--secondary inventory-view-button"
              type="button"
              data-item-id="${escapeHtml(
                item.id
              )}"
            >
              Ver
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderItemForm(item = null) {
  const isEditing = Boolean(item);

  return `
    <div class="quick-action__grid">
      <div class="form-field">
        <label for="inventoryItemName">
          Nombre
        </label>

        <div class="input-group">
          <input
            id="inventoryItemName"
            type="text"
            value="${escapeHtml(
              item?.name ?? ""
            )}"
            placeholder="Ej. Router WiFi 6"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryItemType">
          Tipo
        </label>

        <div class="input-group">
          <select id="inventoryItemType">
            ${renderTypeOptions(
              item?.type ?? "Material"
            )}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryItemCategory">
          Categoría
        </label>

        <div class="input-group">
          <input
            id="inventoryItemCategory"
            type="text"
            value="${escapeHtml(
              item?.category ?? ""
            )}"
            placeholder="Ej. Fibra óptica"
          >
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryItemUnit">
          Unidad
        </label>

        <div class="input-group">
          <input
            id="inventoryItemUnit"
            type="text"
            value="${escapeHtml(
              item?.unit ?? "unidad"
            )}"
            placeholder="unidad, metro, caja..."
          >
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryItemStock">
          Stock actual
        </label>

        <div class="input-group">
          <input
            id="inventoryItemStock"
            type="number"
            min="0"
            step="1"
            value="${item?.stock ?? 0}"
            ${isEditing ? "readonly" : ""}
          >
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryItemMinimum">
          Stock mínimo
        </label>

        <div class="input-group">
          <input
            id="inventoryItemMinimum"
            type="number"
            min="0"
            step="1"
            value="${item?.minimumStock ?? 0}"
          >
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="inventoryItemLocation">
          Ubicación
        </label>

        <div class="input-group">
          <input
            id="inventoryItemLocation"
            type="text"
            value="${escapeHtml(
              item?.location ?? ""
            )}"
            placeholder="Ej. Estante A-01"
          >
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="inventoryItemDescription">
          Descripción
        </label>

        <div class="input-group">
          <textarea
            id="inventoryItemDescription"
            rows="4"
            placeholder="Descripción del elemento..."
          >${escapeHtml(
            item?.description ?? ""
          )}</textarea>
        </div>
      </div>
    </div>

    <button
      id="saveInventoryItem"
      class="button button--primary button--block"
      type="button"
      data-item-id="${escapeHtml(
        item?.id ?? ""
      )}"
      data-mode="${
        isEditing ? "edit" : "create"
      }"
      style="margin-top: 18px;"
    >
      ${
        isEditing
          ? "Guardar cambios"
          : "Registrar elemento"
      }
    </button>

    <p
      id="inventoryItemMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

function renderMovementForm(item) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Elemento</span>
        <strong>${escapeHtml(item.name)}</strong>
      </div>

      <div class="list-item">
        <span>Stock actual</span>
        <strong>
          ${item.stock} ${escapeHtml(item.unit)}
        </strong>
      </div>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label for="inventoryMovementType">
          Tipo de movimiento
        </label>

        <div class="input-group">
          <select id="inventoryMovementType">
            <option value="Entrada">
              Entrada
            </option>

            <option value="Salida">
              Salida
            </option>
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="inventoryMovementQuantity">
          Cantidad
        </label>

        <div class="input-group">
          <input
            id="inventoryMovementQuantity"
            type="number"
            min="1"
            step="1"
            value="1"
          >
        </div>
      </div>

      <div class="form-field quick-action__full">
        <label for="inventoryMovementNote">
          Observación
        </label>

        <div class="input-group">
          <textarea
            id="inventoryMovementNote"
            rows="3"
            placeholder="Compra, instalación, devolución..."
          ></textarea>
        </div>
      </div>
    </div>

    <button
      id="saveInventoryMovement"
      class="button button--primary button--block"
      type="button"
      data-item-id="${escapeHtml(item.id)}"
      style="margin-top: 18px;"
    >
      Registrar movimiento
    </button>

    <p
      id="inventoryMovementMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

function renderMovementRows(movements) {
  if (movements.length === 0) {
    return `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <h3>
              Aún no hay movimientos
            </h3>

            <p>
              Las entradas y salidas aparecerán aquí.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return movements
    .slice(0, 12)
    .map(
      (movement) => `
        <tr>
          <td>
            ${escapeHtml(movement.itemCode)}
          </td>

          <td>
            ${escapeHtml(movement.itemName)}
          </td>

          <td>
            <span
              class="status ${
                movement.movementType ===
                "Entrada"
                  ? "status--success"
                  : "status--warning"
              }"
            >
              ${escapeHtml(
                movement.movementType
              )}
            </span>
          </td>

          <td>${movement.quantity}</td>

          <td>
            ${escapeHtml(movement.note)}
          </td>

          <td>
            ${escapeHtml(
              formatDate(movement.createdAt)
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

export function renderInventoryModule() {
  return `
    <section
      id="inventoryModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>Control de inventario</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Administra productos, materiales,
              stock y movimientos.
            </p>
          </div>

          <button
  id="openInventoryCreate"
  class="button button--primary"
  type="button"
  style="
    color: #ffffff;
    opacity: 1;
  "
>
  + Nuevo elemento
</button>
        </header>
      </article>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Elementos
              </span>

              <div
                id="inventoryTotalItems"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">◇</span>
          </div>

          <span class="kpi-card__trend">
            Productos y materiales
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Unidades en stock
              </span>

              <div
                id="inventoryTotalStock"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">▣</span>
          </div>

          <span class="kpi-card__trend">
            Suma del stock registrado
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Stock bajo
              </span>

              <div
                id="inventoryLowStock"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">!</span>
          </div>

          <span class="kpi-card__trend">
            Requieren reposición
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Agotados
              </span>

              <div
                id="inventoryOutOfStock"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span class="kpi-card__icon">×</span>
          </div>

          <span class="kpi-card__trend">
            Sin unidades disponibles
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
              Busca por código, nombre,
              categoría o ubicación.
            </p>
          </div>
        </header>

        <div
          style="
            display: grid;
            grid-template-columns:
              repeat(auto-fit, minmax(190px, 1fr));
            gap: 16px;
          "
        >
          <div class="form-field">
            <label for="inventorySearch">
              Buscar
            </label>

            <div class="input-group">
              <input
                id="inventorySearch"
                type="search"
                placeholder="Código, nombre o categoría..."
              >
            </div>
          </div>

          <div class="form-field">
            <label for="inventoryTypeFilter">
              Tipo
            </label>

            <div class="input-group">
              <select id="inventoryTypeFilter">
                <option value="">
                  Todos los tipos
                </option>

                <option value="Producto">
                  Producto
                </option>

                <option value="Material">
                  Material
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="inventoryStatusFilter">
              Estado
            </label>

            <div class="input-group">
              <select id="inventoryStatusFilter">
                <option value="">
                  Todos los estados
                </option>

                <option value="Disponible">
                  Disponible
                </option>

                <option value="Stock bajo">
                  Stock bajo
                </option>

                <option value="Agotado">
                  Agotado
                </option>
              </select>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Inventario actual</h2>

            <p
              id="inventoryResults"
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
                <th>Elemento</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody id="inventoryTableBody"></tbody>
          </table>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>Movimientos recientes</h2>

            <p
              style="
                margin-top: 6px;
                color: var(--color-muted);
              "
            >
              Últimas entradas y salidas registradas.
            </p>
          </div>
        </header>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Elemento</th>
                <th>Movimiento</th>
                <th>Cantidad</th>
                <th>Observación</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody id="inventoryMovementsBody"></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="inventoryItemDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Inventario
            </span>

            <h2 id="inventoryItemDialogTitle">
              Nuevo elemento
            </h2>
          </div>

          <button
            id="closeInventoryItemDialog"
            class="button button--icon modal__close"
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="inventoryItemDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeInventoryItemDialogFooter"
            class="button button--secondary"
            type="button"
          >
            Cerrar
          </button>
        </footer>
      </article>
    </dialog>

    <dialog
      id="inventoryMovementDialog"
      class="modal"
    >
      <article class="modal__content">
        <header class="modal__header">
          <div>
            <span class="eyebrow eyebrow--dark">
              Movimiento de stock
            </span>

            <h2 id="inventoryMovementDialogTitle">
              Registrar movimiento
            </h2>
          </div>

          <button
            id="closeInventoryMovementDialog"
            class="button button--icon modal__close"
            type="button"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div id="inventoryMovementDialogContent"></div>

        <footer class="modal__actions">
          <button
            id="closeInventoryMovementDialogFooter"
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

export function initInventoryModule() {
  const moduleRoot =
    document.querySelector(
      "#inventoryModule"
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
      "#inventorySearch"
    );

  const typeFilter =
    document.querySelector(
      "#inventoryTypeFilter"
    );

  const statusFilter =
    document.querySelector(
      "#inventoryStatusFilter"
    );

  const tableBody =
    document.querySelector(
      "#inventoryTableBody"
    );

  const movementsBody =
    document.querySelector(
      "#inventoryMovementsBody"
    );

  const resultCount =
    document.querySelector(
      "#inventoryResults"
    );

  const totalItemsCount =
    document.querySelector(
      "#inventoryTotalItems"
    );

  const totalStockCount =
    document.querySelector(
      "#inventoryTotalStock"
    );

  const lowStockCount =
    document.querySelector(
      "#inventoryLowStock"
    );

  const outOfStockCount =
    document.querySelector(
      "#inventoryOutOfStock"
    );

  const createButton =
    document.querySelector(
      "#openInventoryCreate"
    );

  const itemDialog =
    document.querySelector(
      "#inventoryItemDialog"
    );

  const itemDialogTitle =
    document.querySelector(
      "#inventoryItemDialogTitle"
    );

  const itemDialogContent =
    document.querySelector(
      "#inventoryItemDialogContent"
    );

  const closeItemDialog =
    document.querySelector(
      "#closeInventoryItemDialog"
    );

  const closeItemDialogFooter =
    document.querySelector(
      "#closeInventoryItemDialogFooter"
    );

  const movementDialog =
    document.querySelector(
      "#inventoryMovementDialog"
    );

  const movementDialogTitle =
    document.querySelector(
      "#inventoryMovementDialogTitle"
    );

  const movementDialogContent =
    document.querySelector(
      "#inventoryMovementDialogContent"
    );

  const closeMovementDialog =
    document.querySelector(
      "#closeInventoryMovementDialog"
    );

  const closeMovementDialogFooter =
    document.querySelector(
      "#closeInventoryMovementDialogFooter"
    );

  let items = [];

  function updateCounters() {
    totalItemsCount.textContent =
      items.length;

    totalStockCount.textContent =
      items.reduce(
        (total, item) =>
          total + item.stock,
        0
      );

    lowStockCount.textContent =
      items.filter(
        (item) =>
          item.status === "Stock bajo"
      ).length;

    outOfStockCount.textContent =
      items.filter(
        (item) =>
          item.status === "Agotado"
      ).length;
  }

  function getFilteredItems() {
    const searchValue =
      searchInput.value
        .trim()
        .toLowerCase();

    const selectedType =
      typeFilter.value;

    const selectedStatus =
      statusFilter.value;

    return items.filter((item) => {
      const searchableContent = [
        item.code,
        item.name,
        item.category,
        item.location,
        item.description
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableContent.includes(
          searchValue
        );

      const matchesType =
        !selectedType ||
        item.type === selectedType;

      const matchesStatus =
        !selectedStatus ||
        item.status === selectedStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }

  function renderTable() {
    const filteredItems =
      getFilteredItems();

    tableBody.innerHTML =
      renderItemRows(filteredItems);

    resultCount.textContent =
      `${filteredItems.length} ${
        filteredItems.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;
  }

  function renderMovements() {
    const movements =
      readLocalRecords(
        INVENTORY_MOVEMENTS_STORAGE_KEY
      );

    movementsBody.innerHTML =
      renderMovementRows(movements);
  }

  function refreshInventory() {
    items = getAllItems();

    updateCounters();
    renderTable();
    renderMovements();
  }

  function getFormValues() {
    const nameInput =
      itemDialogContent.querySelector(
        "#inventoryItemName"
      );

    const typeSelect =
      itemDialogContent.querySelector(
        "#inventoryItemType"
      );

    const categoryInput =
      itemDialogContent.querySelector(
        "#inventoryItemCategory"
      );

    const unitInput =
      itemDialogContent.querySelector(
        "#inventoryItemUnit"
      );

    const stockInput =
      itemDialogContent.querySelector(
        "#inventoryItemStock"
      );

    const minimumInput =
      itemDialogContent.querySelector(
        "#inventoryItemMinimum"
      );

    const locationInput =
      itemDialogContent.querySelector(
        "#inventoryItemLocation"
      );

    const descriptionInput =
      itemDialogContent.querySelector(
        "#inventoryItemDescription"
      );

    if (
      !nameInput ||
      !typeSelect ||
      !categoryInput ||
      !unitInput ||
      !stockInput ||
      !minimumInput ||
      !locationInput ||
      !descriptionInput
    ) {
      return null;
    }

    return {
      name: nameInput.value.trim(),
      type: typeSelect.value,
      category:
        categoryInput.value.trim(),
      unit: unitInput.value.trim(),
      stock: normalizeNumber(
        stockInput.value
      ),
      minimumStock: normalizeNumber(
        minimumInput.value
      ),
      location:
        locationInput.value.trim(),
      description:
        descriptionInput.value.trim()
    };
  }

  function validateItemData(itemData) {
    if (
      !itemData.name ||
      !itemData.category ||
      !itemData.unit ||
      !itemData.location
    ) {
      return (
        "Completa nombre, categoría, " +
        "unidad y ubicación."
      );
    }

    return "";
  }

  function openCreateDialog() {
    itemDialogTitle.textContent =
      "Nuevo elemento";

    itemDialogContent.innerHTML =
      renderItemForm();

    itemDialog.showModal();
  }

  function openEditDialog(itemId) {
    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId
    );

    if (!item) {
      return;
    }

    itemDialogTitle.textContent =
      item.name;

    itemDialogContent.innerHTML = `
      ${renderItemForm(item)}

      <button
        id="openInventoryMovement"
        class="button button--secondary button--block"
        type="button"
        data-item-id="${escapeHtml(item.id)}"
        style="margin-top: 12px;"
      >
        Registrar entrada o salida
      </button>
    `;

    itemDialog.showModal();
  }

  function openMovementForm(itemId) {
    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId
    );

    if (!item) {
      return;
    }

    movementDialogTitle.textContent =
      item.name;

    movementDialogContent.innerHTML =
      renderMovementForm(item);

    movementDialog.showModal();
  }

  createButton.addEventListener(
    "click",
    openCreateDialog
  );

  searchInput.addEventListener(
    "input",
    renderTable
  );

  typeFilter.addEventListener(
    "change",
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
          ".inventory-view-button"
        );

      if (!viewButton) {
        return;
      }

      openEditDialog(
        viewButton.dataset.itemId
      );
    }
  );

  itemDialogContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveInventoryItem"
        );

      const movementButton =
        event.target.closest(
          "#openInventoryMovement"
        );

      if (movementButton) {
        itemDialog.close();

        openMovementForm(
          movementButton.dataset.itemId
        );

        return;
      }

      if (!saveButton) {
        return;
      }

      const message =
        itemDialogContent.querySelector(
          "#inventoryItemMessage"
        );

      const itemData = getFormValues();

      if (!itemData) {
        return;
      }

      const validationMessage =
        validateItemData(itemData);

      if (validationMessage) {
        if (message) {
          message.textContent =
            validationMessage;

          message.classList.remove(
            "is-success"
          );
        }

        return;
      }

      if (
        saveButton.dataset.mode ===
        "create"
      ) {
        createItem(itemData);

        refreshInventory();

        if (message) {
          message.textContent =
            "Elemento registrado correctamente.";

          message.classList.add(
            "is-success"
          );
        }

        return;
      }

      const itemId =
        saveButton.dataset.itemId;

      saveItemChanges(itemId, {
        name: itemData.name,
        type: itemData.type,
        category: itemData.category,
        unit: itemData.unit,
        minimumStock:
          itemData.minimumStock,
        location: itemData.location,
        description:
          itemData.description
      });

      refreshInventory();

      const updatedItem = items.find(
        (item) => item.id === itemId
      );

      if (updatedItem) {
        itemDialogTitle.textContent =
          updatedItem.name;

        itemDialogContent.innerHTML = `
          ${renderItemForm(updatedItem)}

          <button
            id="openInventoryMovement"
            class="button button--secondary button--block"
            type="button"
            data-item-id="${escapeHtml(
              updatedItem.id
            )}"
            style="margin-top: 12px;"
          >
            Registrar entrada o salida
          </button>
        `;

        const updatedMessage =
          itemDialogContent.querySelector(
            "#inventoryItemMessage"
          );

        if (updatedMessage) {
          updatedMessage.textContent =
            "Elemento actualizado correctamente.";

          updatedMessage.classList.add(
            "is-success"
          );
        }
      }
    }
  );

  movementDialogContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveInventoryMovement"
        );

      if (!saveButton) {
        return;
      }

      const typeSelect =
        movementDialogContent.querySelector(
          "#inventoryMovementType"
        );

      const quantityInput =
        movementDialogContent.querySelector(
          "#inventoryMovementQuantity"
        );

      const noteInput =
        movementDialogContent.querySelector(
          "#inventoryMovementNote"
        );

      const message =
        movementDialogContent.querySelector(
          "#inventoryMovementMessage"
        );

      if (
        !typeSelect ||
        !quantityInput ||
        !noteInput
      ) {
        return;
      }

      const item = items.find(
        (currentItem) =>
          currentItem.id ===
          saveButton.dataset.itemId
      );

      if (!item) {
        return;
      }

      const result = registerMovement({
        item,
        movementType: typeSelect.value,
        quantity: quantityInput.value,
        note: noteInput.value
      });

      if (message) {
        message.textContent =
          result.message;

        message.classList.toggle(
          "is-success",
          result.ok
        );
      }

      if (!result.ok) {
        return;
      }

      refreshInventory();

      const updatedItem = items.find(
        (currentItem) =>
          currentItem.id === item.id
      );

      if (updatedItem) {
        movementDialogContent.innerHTML =
          renderMovementForm(updatedItem);

        const updatedMessage =
          movementDialogContent.querySelector(
            "#inventoryMovementMessage"
          );

        if (updatedMessage) {
          updatedMessage.textContent =
            result.message;

          updatedMessage.classList.add(
            "is-success"
          );
        }
      }
    }
  );

  [
    closeItemDialog,
    closeItemDialogFooter
  ].forEach((button) => {
    button.addEventListener(
      "click",
      () => itemDialog.close()
    );
  });

  [
    closeMovementDialog,
    closeMovementDialogFooter
  ].forEach((button) => {
    button.addEventListener(
      "click",
      () => movementDialog.close()
    );
  });

  itemDialog.addEventListener(
    "click",
    (event) => {
      if (event.target === itemDialog) {
        itemDialog.close();
      }
    }
  );

  movementDialog.addEventListener(
    "click",
    (event) => {
      if (
        event.target === movementDialog
      ) {
        movementDialog.close();
      }
    }
  );

  window.addEventListener(
    "storage",
    (event) => {
      const relevantKeys = [
        INVENTORY_ITEMS_STORAGE_KEY,
        INVENTORY_EDITS_STORAGE_KEY,
        INVENTORY_MOVEMENTS_STORAGE_KEY
      ];

      if (
        relevantKeys.includes(event.key)
      ) {
        refreshInventory();
      }
    }
  );

  window.addEventListener(
    "hinet:inventory-updated",
    refreshInventory
  );

  refreshInventory();
}
