import { logout } from "../auth.js";
import { getInitials } from "../ui.js";

const navigationByRole = {
  administrator: [
    { label: "Dashboard", icon: "⌂", active: true },
    { label: "Tickets", icon: "◉" },
    { label: "Clientes", icon: "♙" },
    { label: "Inventario", icon: "◇" },
    { label: "Técnicos", icon: "⚙" },
    { label: "Instalaciones", icon: "▣" },
    { label: "Reportes", icon: "▤" },
    { label: "Calendario", icon: "□" },
    { label: "Configuración", icon: "⚙" }
  ],
  technician: [
    { label: "Dashboard", icon: "⌂", active: true },
    { label: "Tickets asignados", icon: "◉" },
    { label: "Instalaciones", icon: "▣" },
    { label: "Materiales", icon: "◇" },
    { label: "Agenda", icon: "□" },
    { label: "Historial", icon: "▤" },
    { label: "Perfil", icon: "♙" }
  ],
  client: [
    { label: "Inicio", icon: "⌂", active: true },
    { label: "Mis solicitudes", icon: "▣" },
    { label: "Mi plan", icon: "◇" },
    { label: "Soporte", icon: "◉" },
    { label: "Facturación", icon: "▤" },
    { label: "Documentos", icon: "□" },
    { label: "Mis datos", icon: "♙" },
    { label: "Configuración", icon: "⚙" }
  ]
};

const titlesByRole = {
  administrator: "Dashboard administrativo",
  technician: "Panel técnico",
  client: "Portal del cliente"
};

export function renderLayout({
  root,
  session,
  role,
  content
}) {
  const navigation = navigationByRole[role] ?? [];

  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar__brand">
          <a class="brand" href="#">
            <span class="brand__symbol">HN</span>
            <span>
              <strong>HI-NET</strong>
              <small>INTERNATIONAL</small>
            </span>
          </a>
        </div>

        <div class="sidebar__profile">
          <strong>${session.name}</strong>
          <span>${titlesByRole[role]}</span>
        </div>

        <nav class="sidebar__nav" aria-label="Navegación del sistema">
          ${navigation
            .map(
              (item) => `
                <a class="sidebar__link ${item.active ? "is-active" : ""}" href="#">
                  <span class="sidebar__icon">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `
            )
            .join("")}
        </nav>

        <div class="sidebar__footer">
          <button class="sidebar__logout" id="logoutButton" type="button">
            <span>⇦</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div class="app-main">
        <header class="navbar">
          <div class="navbar__left">
            <button class="button button--icon navbar__menu" id="menuButton" type="button">
              ☰
            </button>
            <span class="navbar__title">${titlesByRole[role]}</span>
          </div>

          <div class="navbar__right">
            <input
              class="navbar__search"
              type="search"
              placeholder="Buscar en el sistema..."
              aria-label="Buscar"
            >

            <div class="navbar__user">
              <span class="navbar__avatar">${getInitials(session.name)}</span>
              <div>
                <strong>${session.name}</strong>
                <small>${session.email}</small>
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

  menuButton?.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
  });

  logoutButton?.addEventListener("click", () => {
    logout();
  });

  document.querySelectorAll(".sidebar__link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelectorAll(".sidebar__link").forEach((item) => {
        item.classList.remove("is-active");
      });
      link.classList.add("is-active");
    });
  });
}
