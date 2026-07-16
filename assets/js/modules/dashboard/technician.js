import { requireRole } from "../../auth.js";
import { renderLayout } from "../../components/layout.js";

const session = requireRole("technician");
const root = document.querySelector("#appLayout");

if (session) {
  renderLayout({
    root,
    session,
    role: "technician",
    content: `
      <section class="page-heading">
        <div>
          <h1>Hola, ${session.name} 👷</h1>
          <p>Resumen de tus actividades y servicios asignados.</p>
        </div>

        <button class="button button--primary" type="button">Ver agenda</button>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Tickets asignados</span>
              <div class="kpi-card__value">8</div>
            </div>
            <span class="kpi-card__icon">◉</span>
          </div>
          <span class="kpi-card__trend">3 de alta prioridad</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">En proceso</span>
              <div class="kpi-card__value">3</div>
            </div>
            <span class="kpi-card__icon">⚙</span>
          </div>
          <span class="kpi-card__trend">Trabajos activos</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Completados hoy</span>
              <div class="kpi-card__value">5</div>
            </div>
            <span class="kpi-card__icon">✓</span>
          </div>
          <span class="kpi-card__trend">Buen rendimiento</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Visitas programadas</span>
              <div class="kpi-card__value">7</div>
            </div>
            <span class="kpi-card__icon">□</span>
          </div>
          <span class="kpi-card__trend">Para hoy</span>
        </article>
      </section>

      <section class="dashboard-grid" style="margin-top: 22px;">
        <div class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Trabajos asignados</h2>
              <a href="#">Ver todos</a>
            </header>

            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Dirección</th>
                    <th>Hora</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Carlos Ramírez</td>
                    <td>Internet intermitente</td>
                    <td>San Vicente</td>
                    <td>10:30</td>
                    <td><span class="status status--danger">Alta</span></td>
                  </tr>
                  <tr>
                    <td>María López</td>
                    <td>Instalación nueva</td>
                    <td>Imperial</td>
                    <td>11:15</td>
                    <td><span class="status status--warning">Media</span></td>
                  </tr>
                  <tr>
                    <td>Empresa ABC</td>
                    <td>Falla de conexión</td>
                    <td>San Vicente</td>
                    <td>13:30</td>
                    <td><span class="status status--danger">Alta</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <section class="two-column-grid">
            <article class="card">
              <header class="card__header">
                <h2>Materiales disponibles</h2>
                <a href="#">Ver inventario</a>
              </header>

              <div class="list">
                <div class="list-item">
                  <span>Cable UTP Cat6</span>
                  <strong>45 m</strong>
                </div>
                <div class="list-item">
                  <span>Splitter 1x8</span>
                  <strong>12 und.</strong>
                </div>
                <div class="list-item">
                  <span>Conector SC/APC</span>
                  <strong>28 und.</strong>
                </div>
              </div>
            </article>

            <article class="card">
              <header class="card__header">
                <h2>Actividad reciente</h2>
              </header>

              <div class="list">
                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Instalación completada</strong>
                    <small>09:45 · Imperial</small>
                  </div>
                </div>
                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Ticket actualizado</strong>
                    <small>11:20 · San Vicente</small>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Próxima visita</h2>
            </header>

            <div class="list">
              <div class="list-item">
                <div class="list-item__main">
                  <strong>Internet intermitente</strong>
                  <small>Carlos Ramírez</small>
                </div>
                <span class="status status--danger">Alta</span>
              </div>
              <div class="list-item">
                <span>Dirección</span>
                <strong>San Vicente</strong>
              </div>
              <div class="list-item">
                <span>Horario</span>
                <strong>10:30 - 12:00</strong>
              </div>
            </div>

            <button class="button button--primary button--block" type="button">
              Iniciar ruta
            </button>
          </article>

          <article class="card">
            <header class="card__header">
              <h2>Rendimiento mensual</h2>
            </header>

            <div class="empty-state">
              <strong style="font-size: 46px; color: var(--color-success);">78%</strong>
              <p style="margin-top: 8px;">Eficiencia del mes</p>
            </div>
          </article>
        </aside>
      </section>
    `
  });
}
