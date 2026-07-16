import { requireRole } from "../../auth.js";
import { renderLayout } from "../../components/layout.js";

const session = requireRole("client");
const root = document.querySelector("#appLayout");

if (session && root) {
  renderLayout({
    root,
    session,
    role: "client",

    content: `
      <section class="page-heading">
        <div>
          <h1>¡Bienvenido, ${session.name}!</h1>

          <p>
            Este es el resumen de tu servicio y tus solicitudes.
          </p>
        </div>

        <a
          class="button button--primary"
          href="section.html?view=tickets&quick=1"
        >
          Abrir ticket
        </a>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Estado del servicio
              </span>

              <div class="kpi-card__value">
                Activo
              </div>
            </div>

            <span class="kpi-card__icon">
              ✓
            </span>
          </div>

          <span class="kpi-card__trend">
            Todo funciona correctamente
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Velocidad contratada
              </span>

              <div class="kpi-card__value">
                600 Mbps
              </div>
            </div>

            <span class="kpi-card__icon">
              ⌁
            </span>
          </div>

          <span class="kpi-card__trend">
            Plan Gamer
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Próximo pago
              </span>

              <div class="kpi-card__value">
                15/08
              </div>
            </div>

            <span class="kpi-card__icon">
              S/
            </span>
          </div>

          <span class="kpi-card__trend">
            S/ 129.00
          </span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">
                Tickets abiertos
              </span>

              <div class="kpi-card__value">
                1
              </div>
            </div>

            <span class="kpi-card__icon">
              ◉
            </span>
          </div>

          <span class="kpi-card__trend">
            En revisión
          </span>
        </article>
      </section>

      <section
        class="dashboard-grid"
        style="margin-top: 22px;"
      >
        <div class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Estado de tu solicitud</h2>

              <a href="section.html?view=requests">
                Ver seguimiento
              </a>
            </header>

            <div class="list">
              <div class="list-item">
                <div class="list-item__main">
                  <strong>
                    Solicitud recibida
                  </strong>

                  <small>
                    Registrada correctamente
                  </small>
                </div>

                <span class="status status--success">
                  Completado
                </span>
              </div>

              <div class="list-item">
                <div class="list-item__main">
                  <strong>
                    Revisión de cobertura
                  </strong>

                  <small>
                    Validando disponibilidad en tu zona
                  </small>
                </div>

                <span class="status status--info">
                  En proceso
                </span>
              </div>

              <div class="list-item">
                <div class="list-item__main">
                  <strong>
                    Visita programada
                  </strong>

                  <small>
                    Pendiente de confirmación
                  </small>
                </div>

                <span class="status status--warning">
                  Pendiente
                </span>
              </div>
            </div>
          </article>

          <article class="card">
            <header class="card__header">
              <h2>Actividad reciente</h2>

              <a href="section.html?view=requests">
                Ver todo
              </a>
            </header>

            <div class="list">
              <div class="list-item">
                <div class="list-item__main">
                  <strong>
                    Ticket actualizado
                  </strong>

                  <small>
                    Intermitencia de conexión en las noches
                  </small>
                </div>

                <span class="status status--warning">
                  Revisión
                </span>
              </div>

              <div class="list-item">
                <div class="list-item__main">
                  <strong>
                    Pago registrado
                  </strong>

                  <small>
                    Factura por S/ 129.00
                  </small>
                </div>

                <span class="status status--success">
                  Pagado
                </span>
              </div>
            </div>
          </article>
        </div>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Tu plan actual</h2>
            </header>

            <div class="list">
              <div class="list-item">
                <strong>HI-NET GAMER</strong>

                <span class="status status--success">
                  Activo
                </span>
              </div>

              <div class="list-item">
                <span>Velocidad</span>
                <strong>600 Mbps</strong>
              </div>

              <div class="list-item">
                <span>Precio mensual</span>
                <strong>S/ 129.00</strong>
              </div>
            </div>

            <a
              class="button button--primary button--block"
              href="section.html?view=plan"
            >
              Cambiar o mejorar plan
            </a>
          </article>

          <article class="card">
            <header class="card__header">
              <h2>Acciones rápidas</h2>
            </header>

            <div class="list">
              <a
                class="list-item"
                href="section.html?view=requests"
              >
                <strong>Ver mis solicitudes</strong>
                <span>→</span>
              </a>

              <a
                class="list-item"
                href="section.html?view=tickets&quick=1"
              >
                <strong>Abrir ticket de soporte</strong>
                <span>→</span>
              </a>

              <a
                class="list-item"
                href="section.html?view=documents"
              >
                <strong>Descargar documentos</strong>
                <span>→</span>
              </a>
            </div>
          </article>
        </aside>
      </section>
    `
  });
}