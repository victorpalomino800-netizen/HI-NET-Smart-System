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
      "Material sin nombre",

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

function getAllMaterials() {
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
    .filter(
      (item) =>
        item.type === "Material"
    )
    .sort(
      (firstItem, secondItem) => {
        const firstName =
          String(firstItem.name);

        const secondName =
          String(secondItem.name);

        return firstName.localeCompare(
          secondName,
          "es"
        );
      }
    );
}

function saveMaterialStock(
  materialId,
  newStock
) {
  const storedEdits =
    readLocalObject(
      INVENTORY_EDITS_STORAGE_KEY
    );

  storedEdits[materialId] = {
    ...(storedEdits[materialId] ?? {}),
    stock: normalizeNumber(newStock)
  };

  localStorage.setItem(
    INVENTORY_EDITS_STORAGE_KEY,
    JSON.stringify(storedEdits)
  );
}

function registerMaterialUsage({
  material,
  quantity,
  workReference,
  note,
  session
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

  if (
    normalizedQuantity >
    material.stock
  ) {
    return {
      ok: false,
      message:
        "La cantidad supera el stock disponible."
    };
  }

  const newStock =
    material.stock -
    normalizedQuantity;

  saveMaterialStock(
    material.id,
    newStock
  );

  const technicianName =
    String(
      session?.name ??
      "Técnico"
    ).trim();

  const technicianEmail =
    String(
      session?.email ??
      ""
    ).trim();

  const cleanReference =
    String(
      workReference ?? ""
    ).trim();

  const cleanNote =
    String(note ?? "").trim();

  const movementNote = [
    `Uso registrado por ${technicianName}`,
    cleanReference
      ? `Trabajo: ${cleanReference}`
      : "",
    cleanNote
  ]
    .filter(Boolean)
    .join(" | ");

  const movements =
    readLocalRecords(
      INVENTORY_MOVEMENTS_STORAGE_KEY
    );

  movements.unshift({
    id: `movement-${Date.now()}`,
    itemId: material.id,
    itemCode: material.code,
    itemName: material.name,
    movementType: "Salida",
    quantity:
      normalizedQuantity,
    previousStock:
      material.stock,
    newStock,
    note:
      movementNote ||
      "Uso de material registrado por técnico",
    technicianName,
    technicianEmail,
    source: "Técnico",
    createdAt:
      new Date().toISOString()
  });

  saveLocalRecords(
    INVENTORY_MOVEMENTS_STORAGE_KEY,
    movements
  );

  window.dispatchEvent(
    new CustomEvent(
      "hinet:inventory-updated"
    )
  );

  return {
    ok: true,
    message:
      "Uso de material registrado correctamente."
  };
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
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

function formatDate(dateValue) {
  const date =
    new Date(dateValue);

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

function getTechnicianUsages(
  session
) {
  const technicianEmail =
    normalizeText(
      session?.email
    );

  const technicianName =
    normalizeText(
      session?.name
    );

  return readLocalRecords(
    INVENTORY_MOVEMENTS_STORAGE_KEY
  )
    .filter((movement) => {
      if (
        movement.movementType !==
        "Salida"
      ) {
        return false;
      }

      const movementEmail =
        normalizeText(
          movement.technicianEmail
        );

      const movementName =
        normalizeText(
          movement.technicianName
        );

      return (
        (
          technicianEmail &&
          movementEmail ===
            technicianEmail
        ) ||
        (
          technicianName &&
          movementName ===
            technicianName
        )
      );
    })
    .sort(
      (firstMovement, secondMovement) =>
        new Date(
          secondMovement.createdAt
        ) -
        new Date(
          firstMovement.createdAt
        )
    );
}

function renderMaterialRows(
  materials
) {
  if (
    materials.length === 0
  ) {
    return `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <h3>
              No se encontraron materiales
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

  return materials
    .map(
      (material) => `
        <tr>
          <td>
            <strong>
              #${escapeHtml(
                material.code
              )}
            </strong>
          </td>

          <td>
            <div class="list-item__main">
              <strong>
                ${escapeHtml(
                  material.name
                )}
              </strong>

              <small>
                ${escapeHtml(
                  material.location
                )}
              </small>
            </div>
          </td>

          <td>
            ${escapeHtml(
              material.category
            )}
          </td>

          <td>
            <strong>
              ${material.stock}
            </strong>
            ${escapeHtml(
              material.unit
            )}
          </td>

          <td>
            ${material.minimumStock}
            ${escapeHtml(
              material.unit
            )}
          </td>

          <td>
            <span
              class="
                status
                ${getStatusClass(
                  material.status
                )}
              "
            >
              ${escapeHtml(
                material.status
              )}
            </span>
          </td>

          <td>
            ${escapeHtml(
              material.description
            )}
          </td>

          <td>
            <button
              class="
                button
                button--primary
                technician-material-use
              "
              type="button"
              data-material-id="${
                escapeHtml(
                  material.id
                )
              }"
              ${
                material.stock <= 0
                  ? "disabled"
                  : ""
              }
              style="
                color: #ffffff;
                opacity: ${
                  material.stock <= 0
                    ? "0.55"
                    : "1"
                };
              "
            >
              Registrar uso
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderUsageRows(usages) {
  if (
    usages.length === 0
  ) {
    return `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <h3>
              Aún no registraste materiales
            </h3>

            <p>
              Los consumos realizados aparecerán aquí.
            </p>
          </div>
        </td>
      </tr>
    `;
  }

  return usages
    .slice(0, 10)
    .map(
      (usage) => `
        <tr>
          <td>
            ${escapeHtml(
              usage.itemCode
            )}
          </td>

          <td>
            ${escapeHtml(
              usage.itemName
            )}
          </td>

          <td>
            ${usage.quantity}
          </td>

          <td>
            ${usage.previousStock}
            →
            ${usage.newStock}
          </td>

          <td>
            ${escapeHtml(
              usage.note
            )}
          </td>

          <td>
            ${escapeHtml(
              formatDate(
                usage.createdAt
              )
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

function renderUsageForm(
  material,
  session
) {
  return `
    <div class="list">
      <div class="list-item">
        <span>Material</span>

        <strong>
          ${escapeHtml(
            material.name
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Ubicación</span>

        <strong>
          ${escapeHtml(
            material.location
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Stock disponible</span>

        <strong>
          ${material.stock}
          ${escapeHtml(
            material.unit
          )}
        </strong>
      </div>

      <div class="list-item">
        <span>Técnico</span>

        <strong>
          ${escapeHtml(
            session?.name ||
            "Técnico"
          )}
        </strong>
      </div>
    </div>

    <div
      class="quick-action__grid"
      style="margin-top: 18px;"
    >
      <div class="form-field">
        <label
          for="materialUsageQuantity"
        >
          Cantidad utilizada
        </label>

        <div class="input-group">
          <input
            id="materialUsageQuantity"
            type="number"
            min="1"
            max="${material.stock}"
            step="1"
            value="1"
          >
        </div>
      </div>

      <div class="form-field">
        <label
          for="materialUsageReference"
        >
          Ticket o instalación
        </label>

        <div class="input-group">
          <input
            id="materialUsageReference"
            type="text"
            placeholder="Ej. T-1005 o INST-002"
          >
        </div>
      </div>

      <div
        class="
          form-field
          quick-action__full
        "
      >
        <label
          for="materialUsageNote"
        >
          Observación
        </label>

        <div class="input-group">
          <textarea
            id="materialUsageNote"
            rows="4"
            placeholder="Describe dónde se utilizó el material..."
          ></textarea>
        </div>
      </div>
    </div>

    <button
      id="saveMaterialUsage"
      class="
        button
        button--primary
        button--block
      "
      type="button"
      data-material-id="${
        escapeHtml(
          material.id
        )
      }"
      ${
        material.stock <= 0
          ? "disabled"
          : ""
      }
      style="
        margin-top: 18px;
        color: #ffffff;
      "
    >
      Confirmar uso de material
    </button>

    <p
      id="materialUsageMessage"
      class="form-message"
      role="status"
      aria-live="polite"
    ></p>
  `;
}

export function renderMaterialsModule(
  session
) {
  return `
    <section
      id="technicianMaterialsModule"
      class="dashboard-stack"
    >
      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Materiales disponibles
            </h2>

            <p
              style="
                margin-top: 6px;
                color:
                  var(--color-muted);
              "
            >
              Consulta el stock y registra
              los materiales utilizados.
            </p>
          </div>

          <span
            class="
              status
              status--success
            "
          >
            ${escapeHtml(
              session?.name ||
              "Técnico activo"
            )}
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
                Materiales
              </span>

              <div
                id="technicianMaterialsTotal"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              ◇
            </span>
          </div>

          <span class="kpi-card__trend">
            Materiales registrados
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Disponibles
              </span>

              <div
                id="technicianMaterialsAvailable"
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
            Con stock disponible
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Stock bajo
              </span>

              <div
                id="technicianMaterialsLow"
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
            Requieren reposición
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span
                class="kpi-card__label"
              >
                Usos registrados
              </span>

              <div
                id="technicianMaterialsUsages"
                class="kpi-card__value"
              >
                0
              </div>
            </div>

            <span
              class="kpi-card__icon"
            >
              ▤
            </span>
          </div>

          <span class="kpi-card__trend">
            Consumos del técnico
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
                color:
                  var(--color-muted);
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
              repeat(
                auto-fit,
                minmax(190px, 1fr)
              );
            gap: 16px;
          "
        >
          <div class="form-field">
            <label
              for="technicianMaterialSearch"
            >
              Buscar
            </label>

            <div class="input-group">
              <input
                id="technicianMaterialSearch"
                type="search"
                placeholder="Código, material o categoría..."
              >
            </div>
          </div>

          <div class="form-field">
            <label
              for="technicianMaterialStatusFilter"
            >
              Estado
            </label>

            <div class="input-group">
              <select
                id="technicianMaterialStatusFilter"
              >
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

          <div class="form-field">
            <label
              for="technicianMaterialCategoryFilter"
            >
              Categoría
            </label>

            <div class="input-group">
              <select
                id="technicianMaterialCategoryFilter"
              >
                <option value="">
                  Todas las categorías
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
              Inventario de materiales
            </h2>

            <p
              id="technicianMaterialsResults"
              style="
                margin-top: 6px;
                color:
                  var(--color-muted);
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
                <th>Material</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody
              id="technicianMaterialsBody"
            ></tbody>
          </table>
        </div>
      </article>

      <article class="card">
        <header class="card__header">
          <div>
            <h2>
              Mis consumos recientes
            </h2>

            <p
              style="
                margin-top: 6px;
                color:
                  var(--color-muted);
              "
            >
              Materiales utilizados por
              tu cuenta.
            </p>
          </div>
        </header>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Stock</th>
                <th>Observación</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody
              id="technicianMaterialUsagesBody"
            ></tbody>
          </table>
        </div>
      </article>
    </section>

    <dialog
      id="technicianMaterialDialog"
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
              Salida de inventario
            </span>

            <h2
              id="technicianMaterialDialogTitle"
            >
              Registrar uso
            </h2>
          </div>

          <button
            id="closeTechnicianMaterialDialog"
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
          id="technicianMaterialDialogContent"
        ></div>

        <footer class="modal__actions">
          <button
            id="closeTechnicianMaterialDialogFooter"
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

export function initMaterialsModule(
  session
) {
  const moduleRoot =
    document.querySelector(
      "#technicianMaterialsModule"
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
      "#technicianMaterialSearch"
    );

  const statusFilter =
    document.querySelector(
      "#technicianMaterialStatusFilter"
    );

  const categoryFilter =
    document.querySelector(
      "#technicianMaterialCategoryFilter"
    );

  const tableBody =
    document.querySelector(
      "#technicianMaterialsBody"
    );

  const usagesBody =
    document.querySelector(
      "#technicianMaterialUsagesBody"
    );

  const resultCount =
    document.querySelector(
      "#technicianMaterialsResults"
    );

  const totalCount =
    document.querySelector(
      "#technicianMaterialsTotal"
    );

  const availableCount =
    document.querySelector(
      "#technicianMaterialsAvailable"
    );

  const lowCount =
    document.querySelector(
      "#technicianMaterialsLow"
    );

  const usagesCount =
    document.querySelector(
      "#technicianMaterialsUsages"
    );

  const usageDialog =
    document.querySelector(
      "#technicianMaterialDialog"
    );

  const usageDialogTitle =
    document.querySelector(
      "#technicianMaterialDialogTitle"
    );

  const usageContent =
    document.querySelector(
      "#technicianMaterialDialogContent"
    );

  const closeButton =
    document.querySelector(
      "#closeTechnicianMaterialDialog"
    );

  const closeFooter =
    document.querySelector(
      "#closeTechnicianMaterialDialogFooter"
    );

  let materials = [];
  let usages = [];

  function updateCategoryOptions() {
    const selectedCategory =
      categoryFilter.value;

    const categories =
      Array.from(
        new Set(
          materials.map(
            (material) =>
              material.category
          )
        )
      ).sort((first, second) =>
        first.localeCompare(
          second,
          "es"
        )
      );

    categoryFilter.innerHTML = `
      <option value="">
        Todas las categorías
      </option>

      ${categories
        .map(
          (category) => `
            <option
              value="${escapeHtml(
                category
              )}"
            >
              ${escapeHtml(
                category
              )}
            </option>
          `
        )
        .join("")}
    `;

    if (
      categories.includes(
        selectedCategory
      )
    ) {
      categoryFilter.value =
        selectedCategory;
    }
  }

  function updateCounters() {
    totalCount.textContent =
      materials.length;

    availableCount.textContent =
      materials.filter(
        (material) =>
          material.stock > 0
      ).length;

    lowCount.textContent =
      materials.filter(
        (material) =>
          material.status ===
          "Stock bajo"
      ).length;

    usagesCount.textContent =
      usages.length;
  }

  function getFilteredMaterials() {
    const searchValue =
      normalizeText(
        searchInput.value
      );

    const selectedStatus =
      statusFilter.value;

    const selectedCategory =
      categoryFilter.value;

    return materials.filter(
      (material) => {
        const searchableContent =
          normalizeText(
            [
              material.code,
              material.name,
              material.category,
              material.location,
              material.description
            ].join(" ")
          );

        const matchesSearch =
          !searchValue ||
          searchableContent.includes(
            searchValue
          );

        const matchesStatus =
          !selectedStatus ||
          material.status ===
            selectedStatus;

        const matchesCategory =
          !selectedCategory ||
          material.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }

  function renderTable() {
    const filteredMaterials =
      getFilteredMaterials();

    tableBody.innerHTML =
      renderMaterialRows(
        filteredMaterials
      );

    resultCount.textContent =
      `${filteredMaterials.length} ${
        filteredMaterials.length === 1
          ? "registro encontrado"
          : "registros encontrados"
      }`;

    usagesBody.innerHTML =
      renderUsageRows(usages);
  }

  function refreshMaterials() {
    materials =
      getAllMaterials();

    usages =
      getTechnicianUsages(
        session
      );

    updateCategoryOptions();
    updateCounters();
    renderTable();
  }

  function openUsageDialog(
    materialId
  ) {
    const material =
      materials.find(
        (currentMaterial) =>
          currentMaterial.id ===
          materialId
      );

    if (!material) {
      return;
    }

    usageDialogTitle.textContent =
      `Uso de ${material.name}`;

    usageContent.innerHTML =
      renderUsageForm(
        material,
        session
      );

    usageDialog.showModal();
  }

  searchInput.addEventListener(
    "input",
    renderTable
  );

  statusFilter.addEventListener(
    "change",
    renderTable
  );

  categoryFilter.addEventListener(
    "change",
    renderTable
  );

  tableBody.addEventListener(
    "click",
    (event) => {
      const useButton =
        event.target.closest(
          ".technician-material-use"
        );

      if (
        !useButton ||
        useButton.disabled
      ) {
        return;
      }

      openUsageDialog(
        useButton.dataset.materialId
      );
    }
  );

  usageContent.addEventListener(
    "click",
    (event) => {
      const saveButton =
        event.target.closest(
          "#saveMaterialUsage"
        );

      if (!saveButton) {
        return;
      }

      const material =
        materials.find(
          (currentMaterial) =>
            currentMaterial.id ===
            saveButton.dataset.materialId
        );

      const quantityInput =
        usageContent.querySelector(
          "#materialUsageQuantity"
        );

      const referenceInput =
        usageContent.querySelector(
          "#materialUsageReference"
        );

      const noteInput =
        usageContent.querySelector(
          "#materialUsageNote"
        );

      const message =
        usageContent.querySelector(
          "#materialUsageMessage"
        );

      if (
        !material ||
        !quantityInput ||
        !referenceInput ||
        !noteInput
      ) {
        return;
      }

      const result =
        registerMaterialUsage({
          material,
          quantity:
            quantityInput.value,
          workReference:
            referenceInput.value,
          note:
            noteInput.value,
          session
        });

      if (!result.ok) {
        if (message) {
          message.textContent =
            result.message;

          message.classList.remove(
            "is-success"
          );
        }

        return;
      }

      refreshMaterials();

      const updatedMaterial =
        materials.find(
          (currentMaterial) =>
            currentMaterial.id ===
            material.id
        );

      if (!updatedMaterial) {
        usageDialog.close();
        return;
      }

      usageContent.innerHTML =
        renderUsageForm(
          updatedMaterial,
          session
        );

      const updatedMessage =
        usageContent.querySelector(
          "#materialUsageMessage"
        );

      if (updatedMessage) {
        updatedMessage.textContent =
          result.message;

        updatedMessage.classList.add(
          "is-success"
        );
      }
    }
  );

  closeButton.addEventListener(
    "click",
    () => {
      usageDialog.close();
    }
  );

  closeFooter.addEventListener(
    "click",
    () => {
      usageDialog.close();
    }
  );

  usageDialog.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        usageDialog
      ) {
        usageDialog.close();
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
        relevantKeys.includes(
          event.key
        )
      ) {
        refreshMaterials();
      }
    }
  );

  window.addEventListener(
    "hinet:inventory-updated",
    refreshMaterials
  );

  refreshMaterials();
}
