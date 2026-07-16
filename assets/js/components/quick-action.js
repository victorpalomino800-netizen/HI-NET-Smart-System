const actionConfigurations = {
  "administrator:tickets": {
    label: "Nuevo ticket",
    title: "Crear nuevo ticket",
    description: "Registra una nueva solicitud de soporte.",
    storageKey: "hinet_demo_admin_tickets",
    fields: [
      {
        name: "client",
        label: "Cliente",
        type: "text",
        placeholder: "Ejemplo: Carlos Ramírez",
        required: true
      },
      {
        name: "subject",
        label: "Asunto",
        type: "text",
        placeholder: "Ejemplo: Internet intermitente",
        required: true
      },
      {
        name: "priority",
        label: "Prioridad",
        type: "select",
        required: true,
        options: ["Baja", "Media", "Alta", "Crítica"]
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Describe detalladamente el problema...",
        required: true
      }
    ]
  },

  "administrator:clients": {
    label: "Nuevo cliente",
    title: "Registrar nuevo cliente",
    description: "Añade un cliente al sistema.",
    storageKey: "hinet_demo_clients",
    fields: [
      {
        name: "name",
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombres y apellidos",
        required: true
      },
      {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        placeholder: "cliente@correo.com",
        required: true
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "tel",
        placeholder: "987 654 321",
        required: true
      },
      {
        name: "address",
        label: "Dirección",
        type: "textarea",
        placeholder: "Dirección y referencia",
        required: true
      }
    ]
  },

  "administrator:inventory": {
    label: "Nuevo movimiento",
    title: "Registrar movimiento",
    description: "Registra una entrada o salida provisional.",
    storageKey: "hinet_demo_inventory_movements",
    fields: [
      {
        name: "movementType",
        label: "Tipo de movimiento",
        type: "select",
        required: true,
        options: ["Entrada", "Salida"]
      },
      {
        name: "item",
        label: "Producto o material",
        type: "text",
        placeholder: "Ejemplo: Patch Cord SC/APC",
        required: true
      },
      {
        name: "quantity",
        label: "Cantidad",
        type: "number",
        placeholder: "1",
        required: true
      },
      {
        name: "observation",
        label: "Observación",
        type: "textarea",
        placeholder: "Información adicional..."
      }
    ]
  },

  "administrator:technicians": {
    label: "Nuevo técnico",
    title: "Registrar técnico",
    description: "Añade un técnico a la plataforma.",
    storageKey: "hinet_demo_technicians",
    fields: [
      {
        name: "name",
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombres y apellidos",
        required: true
      },
      {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        placeholder: "tecnico@hinet.com",
        required: true
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "tel",
        placeholder: "987 654 321",
        required: true
      },
      {
        name: "specialty",
        label: "Especialidad",
        type: "select",
        required: true,
        options: [
          "Instalación FTTH",
          "Mantenimiento",
          "Redes",
          "Soporte técnico"
        ]
      }
    ]
  },

  "technician:materials": {
    label: "Registrar material",
    title: "Registrar material utilizado",
    description: "Registra los materiales utilizados durante un trabajo.",
    storageKey: "hinet_demo_technician_materials",
    fields: [
      {
        name: "material",
        label: "Material",
        type: "text",
        placeholder: "Ejemplo: Cable UTP Cat6",
        required: true
      },
      {
        name: "quantity",
        label: "Cantidad utilizada",
        type: "number",
        placeholder: "1",
        required: true
      },
      {
        name: "ticket",
        label: "Ticket o instalación",
        type: "text",
        placeholder: "Ejemplo: T-1005",
        required: true
      },
      {
        name: "observation",
        label: "Observación",
        type: "textarea",
        placeholder: "Describe el uso del material..."
      }
    ]
  },

  "technician:tickets": {
    label: "Actualizar ticket",
    title: "Actualizar ticket asignado",
    description: "Registra una actualización provisional.",
    storageKey: "hinet_demo_technician_updates",
    fields: [
      {
        name: "ticket",
        label: "Número de ticket",
        type: "text",
        placeholder: "Ejemplo: T-1005",
        required: true
      },
      {
        name: "status",
        label: "Nuevo estado",
        type: "select",
        required: true,
        options: ["En proceso", "En espera", "Resuelto"]
      },
      {
        name: "observation",
        label: "Observación",
        type: "textarea",
        placeholder: "Describe el trabajo realizado...",
        required: true
      }
    ]
  },

  "client:requests": {
    label: "Nueva solicitud",
    title: "Crear nueva solicitud",
    description: "Registra una solicitud relacionada con tu servicio.",
    storageKey: "hinet_demo_client_requests",
    fields: [
      {
        name: "requestType",
        label: "Tipo de solicitud",
        type: "select",
        required: true,
        options: [
          "Nuevo servicio",
          "Cambio de plan",
          "Cambio de dirección",
          "Consulta de cobertura"
        ]
      },
      {
        name: "subject",
        label: "Asunto",
        type: "text",
        placeholder: "Escribe un asunto",
        required: true
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Describe tu solicitud...",
        required: true
      }
    ]
  },

  "client:tickets": {
    label: "Abrir ticket",
    title: "Abrir ticket de soporte",
    description: "Cuéntanos qué problema estás presentando.",
    storageKey: "hinet_demo_client_tickets",
    fields: [
      {
        name: "category",
        label: "Categoría",
        type: "select",
        required: true,
        options: [
          "Conexión e internet",
          "Velocidad",
          "Router o equipos",
          "Facturación",
          "Consulta general"
        ]
      },
      {
        name: "subject",
        label: "Asunto",
        type: "text",
        placeholder: "Ejemplo: Internet intermitente",
        required: true
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Describe detalladamente el problema...",
        required: true
      }
    ]
  }
};

function getConfiguration(role, view) {
  const key = `${role}:${view}`;

  return (
    actionConfigurations[key] ?? {
      label: "Nueva acción",
      title: "Registrar nueva acción",
      description: "Completa la información para registrar esta acción.",
      storageKey: `hinet_demo_${role}_${view}`,
      fields: [
        {
          name: "title",
          label: "Título",
          type: "text",
          placeholder: "Escribe un título",
          required: true
        },
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          placeholder: "Escribe una descripción...",
          required: true
        }
      ]
    }
  );
}

function renderField(field) {
  const requiredMark = field.required ? " *" : "";
  const requiredAttribute = field.required ? "required" : "";

  if (field.type === "select") {
    const options = field.options
      .map(
        (option) => `
          <option value="${option}">
            ${option}
          </option>
        `
      )
      .join("");

    return `
      <div class="form-field">
        <label for="quick_${field.name}">
          ${field.label}${requiredMark}
        </label>

        <div class="input-group">
          <select
            id="quick_${field.name}"
            name="${field.name}"
            ${requiredAttribute}
          >
            <option value="">Selecciona una opción</option>
            ${options}
          </select>
        </div>
      </div>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div class="form-field quick-action__full">
        <label for="quick_${field.name}">
          ${field.label}${requiredMark}
        </label>

        <div class="input-group input-group--textarea">
          <textarea
            id="quick_${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder ?? ""}"
            ${requiredAttribute}
          ></textarea>
        </div>
      </div>
    `;
  }

  return `
    <div class="form-field">
      <label for="quick_${field.name}">
        ${field.label}${requiredMark}
      </label>

      <div class="input-group">
        <input
          id="quick_${field.name}"
          name="${field.name}"
          type="${field.type}"
          placeholder="${field.placeholder ?? ""}"
          ${field.type === "number" ? 'min="1"' : ""}
          ${requiredAttribute}
        >
      </div>
    </div>
  `;
}

function createDialog(configuration) {
  document.querySelector("#quickActionDialog")?.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "quickActionDialog";
  dialog.className = "modal";

  dialog.innerHTML = `
    <form id="quickActionForm" class="modal__content">
      <header class="modal__header">
        <div>
          <span class="eyebrow eyebrow--dark">Registro provisional</span>
          <h2>${configuration.title}</h2>
        </div>

        <button
          id="closeQuickAction"
          class="button button--icon modal__close"
          type="button"
          aria-label="Cerrar"
        >
          ×
        </button>
      </header>

      <p>${configuration.description}</p>

      <div class="quick-action__grid">
        ${configuration.fields.map(renderField).join("")}
      </div>

      <p
        id="quickActionMessage"
        class="form-message"
        role="status"
        aria-live="polite"
      ></p>

      <footer class="modal__actions">
        <button
          id="cancelQuickAction"
          class="button button--secondary"
          type="button"
        >
          Cancelar
        </button>

        <button class="button button--primary" type="submit">
          Guardar registro
        </button>
      </footer>
    </form>
  `;

  document.body.appendChild(dialog);

  return dialog;
}

function saveDemoRecord(storageKey, record) {
  const storedRecords = localStorage.getItem(storageKey);

  let records = [];

  if (storedRecords) {
    try {
      records = JSON.parse(storedRecords);
    } catch (error) {
      console.error("No se pudieron leer los registros locales:", error);
    }
  }

  records.push(record);

  localStorage.setItem(storageKey, JSON.stringify(records));
}

export function getPrimaryActionLabel(role, view) {
  return getConfiguration(role, view).label;
}

export function bindPrimaryAction({
  role,
  view,
  button,
  autoOpen = false
}) {
  if (!button) {
    return;
  }

  const configuration = getConfiguration(role, view);

  function openDialog() {
    const dialog = createDialog(configuration);
    const form = dialog.querySelector("#quickActionForm");
    const closeButton = dialog.querySelector("#closeQuickAction");
    const cancelButton = dialog.querySelector("#cancelQuickAction");
    const message = dialog.querySelector("#quickActionMessage");

    closeButton.addEventListener("click", () => {
      dialog.close();
    });

    cancelButton.addEventListener("click", () => {
      dialog.close();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const formData = new FormData(form);
      const record = Object.fromEntries(formData.entries());

record.id = crypto.randomUUID();
record.createdAt = new Date().toISOString();
record.status = "demo-local";

saveDemoRecord(configuration.storageKey, record);

if (configuration.storageKey.includes("tickets")) {
  window.dispatchEvent(
    new CustomEvent("hinet:tickets-updated")
  );
}

if (configuration.storageKey.includes("requests")) {
  window.dispatchEvent(
    new CustomEvent("hinet:requests-updated")
  );
}

if (configuration.storageKey.includes("clients")) {
  window.dispatchEvent(
    new CustomEvent("hinet:clients-updated")
  );
}

message.textContent =
  "Registro guardado correctamente en la versión local.";

message.classList.add("is-success");

form.reset();

window.setTimeout(() => {
  dialog.close();
}, 900);
    });

    dialog.showModal();
  }

  button.addEventListener("click", openDialog);

  if (autoOpen) {
    openDialog();
  }
}