import { logout } from "../auth.js";
import { getInitials } from "../ui.js";

const navigationByRole = {
  administrator: [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: "⌂",
      href: "dashboard.html"
    },
    {
      key: "tickets",
      label: "Tickets",
      icon: "◉",
      href: "section.html?view=tickets"
    },
    {
      key: "clients",
      label: "Clientes",
      icon: "♙",
      href: "section.html?view=clients"
    },
    {
      key: "inventory",
      label: "Inventario",
      icon: "◇",
      href: "section.html?view=inventory"
    },
    {
      key: "technicians",
      label: "Técnicos",
      icon: "⚙",
      href: "section.html?view=technicians"
    },
    {
      key: "installations",
      label: "Instalaciones",
      icon: "▣",
      href: "section.html?view=installations"
    },
    {
      key: "reports",
      label: "Reportes",
      icon: "▤",
      href: "section.html?view=reports"
    },
    {
      key: "calendar",
      label: "Calendario",
      icon: "□",
      href: "section.html?view=calendar"
    },
    {
      key: "settings",
      label: "Configuración",
      icon: "⚙",
      href: "section.html?view=settings"
    }
  ],

  technician: [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: "⌂",
      href: "dashboard.html"
    },
    {
      key: "tickets",
      label: "Tickets asignados",
      icon: "◉",
      href: "section.html?view=tickets"
    },
    {
      key: "installations",
      label: "Instalaciones",
      icon: "▣",
      href: "section.html?view=installations"
    },
    {
      key: "materials",
      label: "Materiales",
      icon: "◇",
      href: "section.html?view=materials"
    },
    {
      key: "agenda",
      label: "Agenda",
      icon: "□",
      href: "section.html?view=agenda"
    },
    {
      key: "history",
      label: "Historial",
      icon: "▤",
      href: "section.html?view=history"
    },
    {
      key: "profile",
      label: "Perfil",
      icon: "♙",
      href: "section.html?view=profile"
    }
  ],

  client: [
    {
      key: "dashboard",
      label: "Inicio",
      icon: "⌂",
      href: "dashboard.html"
    },
    {
      key: "requests",
      label: "Mis solicitudes",
      icon: "▣",
      href: "section.html?view=requests"
    },
    {
      key: "plan",
      label: "Mi plan",
      icon: "◇",
      href: "section.html?view=plan"
    },
    {
      key: "tickets",
      label: "Soporte",
      icon: "◉",
      href: "section.html?view=tickets"
    },
    {
      key: "billing",
      label: "Facturación",
      icon: "▤",
      href: "section.html?view=billing"
    },
    {
      key: "documents",
      label: "Documentos",
      icon: "□",
      href: "section.html?view=documents"
    },
    {
      key: "profile",
      label: "Mis datos",
      icon: "♙",
      href: "section.html?view=profile"
    },
    {
      key: "settings",
      label: "Configuración",
      icon: "⚙",
      href: "section.html?view=settings"
    }
  ]
};

const titlesByRole = {
  administrator: "Dashboard administrativo",
  technician: "Panel técnico",
  client: "Portal del cliente"
};

function getCurrentView() {
  const currentFile =
    window.location.pathname.split("/").pop() || "dashboard.html";

  if (currentFile === "dashboard.html") {
    return "dashboard";
  }

  const params = new URLSearchParams(window.location.search);

  return params.get("view") || "dashboard";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderLayout({
  root,
  session,
  role,
  content
}) {
  if (!root) {
    throw new Error("No se encontró el contenedor principal de la aplicación.");
  }

  const navigation = navigationByRole[role] ?? [];
  const currentView = getCurrentView();

  const safeName = escapeHtml(session.name);
  const safeEmail = escapeHtml(session.email);
  const safeTitle = escapeHtml(titlesByRole[role] ?? "HI-NET Smart System");

  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar__brand">
          <a class="brand" href="dashboard.html">
            <span class="brand__symbol">HN</span>

            <span>
              <strong>HI-NET</strong>
              <small>INTERNATIONAL</small>
            </span>
          </a>
        </div>

        <div class="sidebar__profile">
          <strong>${safeName}</strong>
          <span>${safeTitle}</span>
        </div>

        <nav class="sidebar__nav" aria-label="Navegación del sistema">
          ${navigation
            .map((item) => {
              const isActive = item.key === currentView;

              return `
                <a
                  class="sidebar__link ${isActive ? "is-active" : ""}"
                  href="${item.href}"
                  data-view="${item.key}"
                >
                  <span class="sidebar__icon">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `;
            })
            .join("")}
        </nav>

        <div class="sidebar__footer">
          <button
            class="sidebar__logout"
            id="logoutButton"
            type="button"
          >
            <span>⇦</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div class="app-main">
        <header class="navbar">
          <div class="navbar__left">
            <button
              class="button button--icon navbar__menu"
              id="menuButton"
              type="button"
              aria-label="Abrir menú"
            >
              ☰
            </button>

            <span class="navbar__title">${safeTitle}</span>
          </div>

          <div class="navbar__right">
            <input
              class="navbar__search"
              type="search"
              placeholder="Buscar en el sistema..."
              aria-label="Buscar"
            >

            <div class="navbar__user">
              <span class="navbar__avatar">
                ${getInitials(session.name)}
              </span>

              <div>
                <strong>${safeName}</strong>
                <small>${safeEmail}</small>
              </div>
            </div>
          </div>
        </header>

        <main class="app-content">
          ${content}
        </main>
      </div>
    </div>
  `;

  const sidebar = document.querySelector("#sidebar");
  const menuButton = document.querySelector("#menuButton");
  const logoutButton = document.querySelector("#logoutButton");
  const sidebarLinks = document.querySelectorAll(".sidebar__link");

  menuButton?.addEventListener("click", () => {
    sidebar?.classList.toggle("is-open");
  });

  logoutButton?.addEventListener("click", () => {
    logout();
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar?.classList.remove("is-open");
    });
  });
}