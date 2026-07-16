import { requireRole } from "../auth.js";
import { renderLayout } from "../components/layout.js";

import {
  bindPrimaryAction,
  getPrimaryActionLabel
} from "../components/quick-action.js";

const sectionDefinitions = {
  administrator: {
    tickets: {
      title: "Gestión de tickets",
      description:
        "Administra y realiza seguimiento a las solicitudes de soporte.",
      icon: "◉",
      nextStep:
        "Construiremos aquí la tabla completa de tickets del diseño de Figma."
    },

    clients: {
      title: "Gestión de clientes",
      description:
        "Consulta, registra y actualiza la información de los clientes.",
      icon: "♙",
      nextStep:
        "Añadiremos búsqueda, filtros, detalle y registro de clientes."
    },

    inventory: {
      title: "Inventario",
      description:
        "Controla productos, materiales, entradas, salidas y alertas.",
      icon: "◇",
      nextStep:
        "Separaremos el inventario de productos del inventario de materiales."
    },

    technicians: {
      title: "Gestión de técnicos",
      description:
        "Administra técnicos, disponibilidad, trabajos y rendimiento.",
      icon: "⚙",
      nextStep:
        "Crearemos la tabla de técnicos y su pantalla de detalle."
    },

    installations: {
      title: "Instalaciones",
      description:
        "Gestiona visitas técnicas e instalaciones programadas.",
      icon: "▣",
      nextStep:
        "Añadiremos estados, dirección, cliente y técnico asignado."
    },

    reports: {
      title: "Dashboard de reportes",
      description:
        "Analiza tickets, instalaciones, inventario y rendimiento.",
      icon: "▤",
      nextStep:
        "Implementaremos gráficos y filtros utilizando datos reales."
    },

    calendar: {
      title: "Calendario",
      description:
        "Consulta trabajos, visitas, instalaciones y actividades.",
      icon: "□",
      nextStep:
        "Crearemos las vistas mensual, semanal y diaria."
    },

    settings: {
      title: "Configuración",
      description:
        "Administra parámetros generales, usuarios y preferencias.",
      icon: "⚙",
      nextStep:
        "Añadiremos empresa, seguridad, notificaciones y permisos."
    }
  },

  technician: {
    tickets: {
      title: "Tickets asignados",
      description:
        "Consulta los trabajos asignados a tu cuenta.",
      icon: "◉",
      nextStep:
        "Aquí aparecerán los tickets reales asignados al técnico."
    },

    installations: {
      title: "Instalaciones asignadas",
      description:
        "Gestiona visitas e instalaciones programadas.",
      icon: "▣",
      nextStep:
        "Añadiremos actualización de estados y evidencias."
    },

    materials: {
      title: "Materiales",
      description:
        "Consulta y registra los materiales utilizados.",
      icon: "◇",
      nextStep:
        "Se conectará con el inventario técnico de Supabase."
    },

    agenda: {
      title: "Agenda",
      description:
        "Revisa tus trabajos y horarios programados.",
      icon: "□",
      nextStep:
        "Añadiremos calendario y ruta de visitas."
    },

    history: {
      title: "Historial",
      description:
        "Consulta las actividades y trabajos completados.",
      icon: "▤",
      nextStep:
        "Mostraremos instalaciones, tickets y movimientos."
    },

    profile: {
      title: "Mi perfil",
      description:
        "Consulta y actualiza tu información personal.",
      icon: "♙",
      nextStep:
        "Se conectará con el perfil autenticado de Supabase."
    }
  },

  client: {
    requests: {
      title: "Mis solicitudes",
      description:
        "Consulta el estado de tus solicitudes de servicio.",
      icon: "▣",
      nextStep:
        "Añadiremos seguimiento y detalle de solicitudes."
    },

    plan: {
      title: "Mi plan",
      description:
        "Consulta tu plan actual y opciones de mejora.",
      icon: "◇",
      nextStep:
        "Aquí aparecerán velocidad, precio y características."
    },

    tickets: {
      title: "Soporte",
      description:
        "Crea y consulta tus tickets de soporte.",
      icon: "◉",
      nextStep:
        "Añadiremos listado, creación y detalle de tickets."
    },

    billing: {
      title: "Facturación",
      description:
        "Consulta facturas, pagos y próximos vencimientos.",
      icon: "▤",
      nextStep:
        "Se conectará con las facturas reales del cliente."
    },

    documents: {
      title: "Mis documentos",
      description:
        "Consulta contratos, comprobantes y reportes.",
      icon: "□",
      nextStep:
        "Añadiremos vista previa y descarga de documentos."
    },

    profile: {
      title: "Mis datos",
      description:
        "Administra tu información personal y direcciones.",
      icon: "♙",
      nextStep:
        "Se conectará con el perfil real del cliente."
    },

    settings: {
      title: "Configuración",
      description:
        "Administra preferencias, seguridad y notificaciones.",
      icon: "⚙",
      nextStep:
        "Añadiremos cambio de contraseña y preferencias."
    }
  }
};

function getRequestedView() {
  const params = new URLSearchParams(window.location.search);

  return params.get("view") || "";
}

function getSection(role, view) {
  return sectionDefinitions[role]?.[view] ?? null;
}

const role = document.body.dataset.requiredRole;
const session = requireRole(role);
const root = document.querySelector("#appLayout");

const view = getRequestedView();
const section = getSection(role, view);

const params = new URLSearchParams(window.location.search);
const shouldOpenQuickAction = params.get("quick") === "1";

if (session && root) {
  if (!section) {
    window.location.replace("dashboard.html");
  } else {
    const primaryActionLabel = getPrimaryActionLabel(role, view);

    document.title = `${section.title} | HI-NET Smart System`;

    renderLayout({
      root,
      session,
      role,

      content: `
        <section class="page-heading">
          <div>
            <h1>${section.title}</h1>
            <p>${section.description}</p>
          </div>

          <button
            id="primaryActionButton"
            class="button button--primary"
            type="button"
          >
            + ${primaryActionLabel}
          </button>
        </section>

        <section class="dashboard-grid">
          <div class="dashboard-stack">
            <article class="card">
              <header class="card__header">
                <h2>Vista inicial del módulo</h2>

                <span class="status status--success">
                  Navegación activa
                </span>
              </header>

              <div class="empty-state">
                <div
                  style="
                    width: 72px;
                    height: 72px;
                    display: grid;
                    place-items: center;
                    margin: 0 auto 18px;
                    border-radius: 22px;
                    background: var(--color-primary-soft);
                    color: var(--color-primary);
                    font-size: 30px;
                  "
                >
                  ${section.icon}
                </div>

                <h2>${section.title}</h2>

                <p
                  style="
                    max-width: 560px;
                    margin: 12px auto 0;
                    line-height: 1.7;
                  "
                >
                  La navegación de este apartado ya funciona correctamente.
                  Esta pantalla será reemplazada por el diseño definitivo
                  cuando desarrollemos el módulo.
                </p>
              </div>
            </article>
          </div>

          <aside class="dashboard-stack">
            <article class="card">
              <header class="card__header">
                <h2>Estado del módulo</h2>
              </header>

              <div class="list">
                <div class="list-item">
                  <strong>Navegación</strong>

                  <span class="status status--success">
                    Operativa
                  </span>
                </div>

                <div class="list-item">
                  <strong>Diseño final</strong>

                  <span class="status status--warning">
                    Pendiente
                  </span>
                </div>

                <div class="list-item">
                  <strong>Supabase</strong>

                  <span class="status status--warning">
                    Pendiente
                  </span>
                </div>
              </div>
            </article>

            <article class="card">
              <header class="card__header">
                <h2>Siguiente mejora</h2>
              </header>

              <p
                style="
                  color: var(--color-muted);
                  line-height: 1.7;
                "
              >
                ${section.nextStep}
              </p>
            </article>
          </aside>
        </section>
      `
    });
    bindPrimaryAction({
  role,
  view,
  button: document.querySelector("#primaryActionButton"),
  autoOpen: shouldOpenQuickAction
});

if (shouldOpenQuickAction) {
  const cleanUrl = new URL(window.location.href);

  cleanUrl.searchParams.delete("quick");

  window.history.replaceState(
    {},
    document.title,
    cleanUrl.href
  );
}
  }
}