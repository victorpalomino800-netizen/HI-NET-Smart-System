import { requireRole } from "../../auth.js";
import { renderLayout } from "../../components/layout.js";

const session = requireRole("administrator");
const root = document.querySelector("#appLayout");

if (session) {
  renderLayout({
    root,
    session,
    role: "administrator",
    content: `
      <section class="page-heading">
        <div>
          <h1>Hola, ${session.name} 👋</h1>
          <p>Resumen general de las operaciones de HI-NET.</p>
        </div>

        <button class="button button--primary" type="button">+ Nuevo ticket</button>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Total productos</span>
              <div class="kpi-card__value">1,248</div>
            </div>
            <span class="kpi-card__icon">◇</span>
          </div>
          <span class="kpi-card__trend">+12% este mes</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Tickets pendientes</span>
              <div class="kpi-card__value">12</div>
            </div>
            <span class="kpi-card__icon">◉</span>
          </div>
          <span class="kpi-card__trend">4 de alta prioridad</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Técnicos activos</span>
              <div class="kpi-card__value">6</div>
            </div>
            <span class="kpi-card__icon">⚙</span>
          </div>
          <span class="kpi-card__trend">5 en servicio</span>
        </article>

        <article class="kpi-card">
          <div class="kpi-card__top">
            <div>
              <span class="kpi-card__label">Stock crítico</span>
              <div class="kpi-card__value">3</div>
            </div>
            <span class="kpi-card__icon">!</span>
          </div>
          <span class="kpi-card__trend">Requiere atención</span>
        </article>
      </section>

      <section class="dashboard-grid" style="margin-top: 22px;">
        <div class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Tickets recientes</h2>
              <a href="#">Ver todos</a>
            </header>

            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Asunto</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#T-1005</td>
                    <td>Carlos Ramírez</td>
                    <td>Internet intermitente</td>
                    <td><span class="status status--warning">Pendiente</span></td>
                    <td><span class="status status--danger">Alta</span></td>
                  </tr>
                  <tr>
                    <td>#T-1004</td>
                    <td>María López</td>
                    <td>Instalación nueva</td>
                    <td><span class="status status--info">En proceso</span></td>
                    <td><span class="status status--warning">Media</span></td>
                  </tr>
                  <tr>
                    <td>#T-1003</td>
                    <td>Empresa ABC</td>
                    <td>Caída total del servicio</td>
                    <td><span class="status status--info">En proceso</span></td>
                    <td><span class="status status--danger">Alta</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <section class="two-column-grid">
            <article class="card">
              <header class="card__header">
                <h2>Stock bajo</h2>
                <a href="#">Inventario</a>
              </header>

              <div class="list">
                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Splitter PLC 1x8</strong>
                    <small>3 unidades disponibles</small>
                  </div>
                  <span class="status status--danger">Crítico</span>
                </div>

                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Patch Cord SC/APC</strong>
                    <small>4 unidades disponibles</small>
                  </div>
                  <span class="status status--warning">Bajo</span>
                </div>
              </div>
            </article>

            <article class="card">
              <header class="card__header">
                <h2>Próximas tareas</h2>
                <a href="#">Calendario</a>
              </header>

              <div class="list">
                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Instalación FTTH</strong>
                    <small>Cliente: María López · 09:00</small>
                  </div>
                  <span class="status status--info">Hoy</span>
                </div>

                <div class="list-item">
                  <div class="list-item__main">
                    <strong>Mantenimiento</strong>
                    <small>Cliente: Juan Quispe · 11:30</small>
                  </div>
                  <span class="status status--warning">Hoy</span>
                </div>
              </div>
            </article>
          </section>
        </div>

        <aside class="dashboard-stack">
          <article class="card">
            <header class="card__header">
              <h2>Actividad reciente</h2>
            </header>

            <div class="list">
              <div class="list-item">
                <div class="list-item__main">
                  <strong>Nuevo ticket #T-1005</strong>
                  <small>Hace 5 minutos</small>
                </div>
              </div>

              <div class="list-item">
                <div class="list-item__main">
                  <strong>Entrada de 10 ONU GPON</strong>
                  <small>Hace 1 hora</small>
                </div>
              </div>

              <div class="list-item">
                <div class="list-item__main">
                  <strong>Instalación completada</strong>
                  <small>Hace 2 horas</small>
                </div>
              </div>
            </div>
          </article>

          <article class="card">
            <header class="card__header">
              <h2>Estado del sistema</h2>
            </header>

            <div class="list">
              <div class="list-item">
                <strong>Base de datos</strong>
                <span class="status status--success">Demo local</span>
              </div>
              <div class="list-item">
                <strong>Autenticación</strong>
                <span class="status status--warning">Pendiente Supabase</span>
              </div>
              <div class="list-item">
                <strong>Frontend</strong>
                <span class="status status--success">Operativo</span>
              </div>
            </div>
          </article>
        </aside>
      </section>
    `
  });
}
