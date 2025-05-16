export function MenuEntrenador() {
  return `
    <aside id="sidebar" class="text-white p-3">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0 fw-bold">MENU</h5>
        <i class="fas fa-xmark fa-lg text-white" id="closeSidebar" style="cursor: pointer;"></i>
      </div>

      <ul class="list-unstyled">
        <li class="mb-2">
          <a href="#" class="text-white text-decoration-none d-flex align-items-center px-3 py-2 w-100">
            <div class="inner">
                 <i class="fas fa-home me-2"></i>Inicio
            </div>
          </a>
        </li>
        <li class="mb-2">
          <a href="#" class="text-white text-decoration-none d-flex align-items-center px-3 py-2 w-100">
            <i class="fas fa-dollar-sign me-2"></i>Pagos
          </a>
        </li>
        <li class="mb-2">
          <button class="btn w-100 text-start text-white d-flex justify-content-between align-items-center bg-transparent border-0 px-3 py-2" id="toggleUsuarios">
            <span><i class="fas fa-users me-2"></i>Usuarios</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <ul id="submenuUsuarios" class="list-unstyled ms-4 mt-2" style="display: none;">
            <li><a href="#" class="text-white text-decoration-none d-block py-1">Administradores</a></li>
            <li><a href="#" class="text-white text-decoration-none d-block py-1">Entrenadores</a></li>
            <li><a href="#" class="text-white text-decoration-none d-block py-1">Clientes</a></li>
          </ul>
        </li>
        <li class="mb-2">
          <a href="#" class="text-white text-decoration-none d-flex align-items-center px-3 py-2 w-100">
            <i class="fas fa-dumbbell me-2"></i>Ejercicios
          </a>
        </li>
        <li class="mb-2">
          <a href="#" class="text-white text-decoration-none d-flex align-items-center px-3 py-2 w-100">
            <i class="fas fa-heartbeat me-2"></i>Padecimientos
          </a>
        </li>
        <li class="mb-2">
          <a href="#" class="text-white text-decoration-none d-flex align-items-center px-3 py-2 w-100">
            <i class="fas fa-sign-out-alt me-2"></i>Salir
          </a>
        </li>
      </ul>
    </aside>
  `;
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', MenuEntrenador());

  const openSidebar = document.getElementById('openSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const toggleUsuarios = document.getElementById("toggleUsuarios");
  const submenuUsuarios = document.getElementById("submenuUsuarios");

  if (openSidebar && sidebar) {
    openSidebar.addEventListener('click', () => {
      sidebar.classList.add('active');
      document.body.classList.add('sidebar-active');
    });
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-active');
    });
  }

  if (toggleUsuarios && submenuUsuarios) {
    toggleUsuarios.addEventListener("click", () => {
      const isVisible = submenuUsuarios.style.display === "block";
      submenuUsuarios.style.display = isVisible ? "none" : "block";
      toggleUsuarios.classList.toggle("active", !isVisible);
    });
  }
});