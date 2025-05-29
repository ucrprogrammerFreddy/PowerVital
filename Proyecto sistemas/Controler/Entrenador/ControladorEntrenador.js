
// Definimos la base de la URL para las peticiones a la API
const API_BASE = "https://localhost:7086/api";

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const idEntrenador = sessionStorage.getItem("idEntrenador");
  if (idEntrenador) {
    cargarClientes(idEntrenador);
  } else {
    alert("No se encontró el ID del entrenador en la sesión.");
  }
});

// Función para llenar la tabla con los clientes del entrenador
function cargarClientes(idEntrenador) {
  fetch(`${API_BASE}/api/entrenador/` + idEntrenador + "/clientes")
    .then(res => res.json())
    .then(clientes => {
      const tbody = document.querySelector("#tablaClientes tbody");
      tbody.innerHTML = "";

      clientes.forEach((c, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${index + 1}</td>
          <td>${c.nombre}</td>
          <td>${c.peso} kg</td>
          <td>${c.altura} m</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="verRutina(${c.id})">Ver rutina</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar clientes:", err);
    });
}

// Función global para mostrar rutina actual del cliente
window.verRutina = function(idCliente) {
  fetch("/api/cliente/" + idCliente + "/rutina-actual")
    .then(res => res.json())
    .then(rutina => {
      if (!rutina) return alert("No hay rutina actual.");

      let html = `<p><strong>Inicio:</strong> ${rutina.fechaInicio}</p>
                  <p><strong>Fin:</strong> ${rutina.fechaFin}</p>
                  <ul>`;
      rutina.ejercicios.forEach(e => {
        html += `<li><strong>${e.nombre}</strong>: ${e.descripcion} (${e.comentario})</li>`;
      });
      html += `</ul>`;

      document.getElementById("contenidoRutina").innerHTML = html;
      new bootstrap.Modal(document.getElementById("modalRutina")).show();
    })
    .catch(err => {
      console.error("Error al cargar rutina:", err);
    });
}
