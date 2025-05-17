const API_URL = "https://localhost:7086/api/padecimiento";

document.addEventListener("DOMContentLoaded", () => {
  const accion = document.body.dataset.accion;
  const params = new URLSearchParams(window.location.search);
  const modo = params.get("modo");
  const id = params.get("id");
  let filaEnEdicion = null;


  // 🧠 Si viene por URL con ?modo=editar&id=3
  if (modo === "editar" && id) {
    configurarFormularioEditar(id);
    return;
  }

  // 👇 Mantenés tu lógica actual por dataset
  switch (accion) {
    case "listar":
      listarPadecimientos();
      buscarPorId();
      break;
    case "agregar":
      configurarFormularioAgregar();
      break;
    case "editar":
      // Si no hay id por URL, usar el que está en el HTML
      const form = document.querySelector(".formulario");
      const formId = form ? form.dataset.id : null;
      if (formId) {
        configurarFormularioEditar(formId);
      } else {
        console.warn("⚠️ No se proporcionó ID para editar.");
      }
      break;
    default:
      console.warn("⚠️ Acción no reconocida:", accion);
  }
});

function listarPadecimientos() {
  fetch(`${API_URL}/listaPadecimientos`)
    .then(res => res.json())
    .then(lista => {
      console.log("📦 Lista recibida:", lista);

      if (!Array.isArray(lista)) throw new Error("La respuesta no es un array válido");

      const tbody = document.querySelector("tbody.table-group-divider");
      tbody.innerHTML = "";

      lista.forEach(p => {
        const fila = document.createElement("tr");
        fila.classList.add("table-primary");
        fila.innerHTML = `
          <td>${p.IdPadecimiento}</td>
          <td>${p.Nombre}</td>
          <td>${p.Descripcion}</td>
          <td>${p.AreaMuscularAfectada}</td>
          <td>${p.Severidad}</td>
          <td>
            <button class="btn btn-warning btn-sm btn-editar" data-id="${p.IdPadecimiento}">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPadecimiento(${p.IdPadecimiento})">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("❌ Error al listar:", err.message);
    });
}


// 🟢 LISTAR


document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-editar")) {
    const btn = e.target.closest(".btn-editar");
    const id = btn.dataset.id;
    activarEdicionEnFila(id);
  }
});



function activarEdicionEnFila(id) {
  fetch(`${API_URL}/obtenerPadecimientoPorId/${id}`)
    .then(res => res.json())
    .then(p => {
      const fila = document.querySelector(`button[data-id="${id}"]`).closest("tr");
      const realId = p.IdPadecimiento; // ✅ obtener el ID correcto del objeto recibido

      fila.innerHTML = `
        <td>${realId}</td>
        <td><input class="form-control form-control-sm" type="text" value="${p.Nombre}" id="edit-nombre-${realId}"></td>
        <td><input class="form-control form-control-sm" type="text" value="${p.Descripcion}" id="edit-descripcion-${realId}"></td>
        <td><input class="form-control form-control-sm" type="text" value="${p.AreaMuscularAfectada}" id="edit-area-${realId}"></td>
        <td>
          <select class="form-select form-select-sm" id="edit-severidad-${realId}">
            <option value="leve" ${p.Severidad === "leve" ? "selected" : ""}>Leve</option>
            <option value="moderada" ${p.Severidad === "moderada" ? "selected" : ""}>Moderada</option>
            <option value="alta" ${p.Severidad === "alta" ? "selected" : ""}>Alta</option>
          </select>
        </td>
        <td>
          <button class="btn btn-success btn-sm" onclick="guardarEdicion(${realId})">
            <i class="bi bi-check-circle-fill"></i>
          </button>
          <button class="btn btn-secondary btn-sm" onclick="listarPadecimientos()">
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </td>
      `;
    });
}



// function activarEdicionEnFila(id) {
//   fetch(`${API_URL}/obtenerPadecimientoPorId/${id}`)
//     .then(res => res.json())
//     .then(p => {
//       const fila = document.querySelector(`button[data-id="${id}"]`).closest("tr");
//       fila.innerHTML = `
//         <td>${p.IdPadecimiento}</td>
//         <td><input class="form-control form-control-sm" type="text" value="${p.Nombre}" id="edit-nombre-${id}"></td>
//         <td><input class="form-control form-control-sm" type="text" value="${p.Descripcion}" id="edit-descripcion-${id}"></td>
//         <td><input class="form-control form-control-sm" type="text" value="${p.AreaMuscularAfectada}" id="edit-area-${id}"></td>
//         <td>
//           <select class="form-select form-select-sm" id="edit-severidad-${id}">
//             <option value="leve" ${p.Severidad === "leve" ? "selected" : ""}>Leve</option>
//             <option value="moderada" ${p.Severidad === "moderada" ? "selected" : ""}>Moderada</option>
//             <option value="alta" ${p.Severidad === "alta" ? "selected" : ""}>Alta</option>
//           </select>
//         </td>
//         <td>
//        <button class="btn btn-success btn-sm" onclick="guardarEdicion(${p.IdPadecimiento})">
//                 <i class="bi bi-check-circle-fill"></i>
//             </button>

//           <button class="btn btn-secondary btn-sm" onclick="listarPadecimientos()">
//             <i class="bi bi-x-circle-fill"></i>
//           </button>
//         </td>
//       `;
//     });
// }


function guardarEdicion(id) {
  console.log("Editando ID:", id);

  const nombre = document.getElementById(`edit-nombre-${id}`).value.trim();
  const descripcion = document.getElementById(`edit-descripcion-${id}`).value.trim();
  const areaMuscularAfectada = document.getElementById(`edit-area-${id}`).value.trim();
  const severidad = document.getElementById(`edit-severidad-${id}`).value;

  if (!nombre || !descripcion || !areaMuscularAfectada || !severidad) {
    mostrarToast("⚠️ Todos los campos son obligatorios", "warning");
    return;
  }

  const dto = {
    idPadecimiento: parseInt(id),
    nombre,
    descripcion,
    areaMuscularAfectada,
    severidad
  };

  fetch(`${API_URL}/editarPadecimiento/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo guardar la edición.");
      mostrarToast("✅ Padecimiento actualizado correctamente.", "success");
      actualizarFilaVisual(id); // 👈 Solo actualiza esta fila
    })
    .catch(err => {
      console.error("Error:", err);
      mostrarToast("❌ Error al actualizar: " + err.message, "danger");
    });
}
function actualizarFilaVisual(id) {
  fetch(`${API_URL}/obtenerPadecimientoPorId/${id}`)
    .then(res => res.json())
    .then(p => {
      const fila = document.querySelector(`tr td:first-child:contains("${id}")`) ||
                   document.querySelector(`button[data-id="${id}"]`)?.closest("tr");

      if (!fila) return;

      fila.innerHTML = `
        <td>${p.IdPadecimiento}</td>
        <td>${p.Nombre}</td>
        <td>${p.Descripcion}</td>
        <td>${p.AreaMuscularAfectada}</td>
        <td>${p.Severidad}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar" data-id="${p.IdPadecimiento}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPadecimiento(${p.IdPadecimiento})">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `;
    });
}





// 🔴 ELIMINAR
function eliminarPadecimiento(id) {
  if (!confirm("¿Seguro que deseas eliminar este padecimiento?")) return;

  fetch(`${API_URL}/eliminarPadecimiento/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar.");
      alert("✅ Padecimiento eliminado correctamente.");
      listarPadecimientos();
    })
    .catch(err => {
      alert("❌ Error al eliminar: " + err.message);
    });
}

// 🟡 CONFIGURAR AGREGAR
function configurarFormularioAgregar() {
  const form = document.querySelector(".formulario");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dto = obtenerDatosFormulario();

    // ✅ Validación de campos
    if (
      !dto.nombre ||
      !dto.descripcion ||
      !dto.areaMuscularAfectada ||
      !dto.severidad
    ) {
      alert("⚠️ Por favor completa todos los campos antes de registrar.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/crearPadecimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });

      if (!res.ok) throw new Error("No se pudo registrar.");

      alert("✅ Padecimiento agregado.");
      form.reset();
    } catch (err) {
      alert("❌ Error al registrar: " + err.message);
    }
  });
}


// 🟡 CONFIGURAR EDITAR
function configurarFormularioEditar() {
  const form = document.querySelector(".formulario");
  const id = form.dataset.id;

  fetch(`${API_URL}/obtenerPadecimientoPorId/${id}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("nombre").value = p.nombre;
      document.getElementById("Descripcion").value = p.descripcion;

      const areas = p.areaMuscularAfectada.split(",");
      areas.forEach(area => {
        const checkbox = document.querySelector(`input[name="AreaMuscularAfectada"][value="${area}"]`);
        if (checkbox) checkbox.checked = true;
      });

      const radio = document.querySelector(`input[name="Severidad"][value="${p.severidad}"]`);
      if (radio) radio.checked = true;
    });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const dto = obtenerDatosFormulario();
    dto.idPadecimiento = parseInt(id);

    try {
      const res = await fetch(`${API_URL}/editarPadecimiento/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });

      if (!res.ok) throw new Error("No se pudo editar.");

      alert("✅ Padecimiento actualizado.");
    } catch (err) {
      alert("❌ Error al editar: " + err.message);
    }
  });
}

// 📋 Utilidad para obtener datos del formulario
function obtenerDatosFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("Descripcion").value.trim();

  const areas = Array.from(document.querySelectorAll('input[name="AreaMuscularAfectada"]:checked'))
    .map(cb => cb.value).join(",");

  const severidadInput = document.querySelector('input[name="Severidad"]:checked');
  const severidad = severidadInput ? severidadInput.value : "";

  return { nombre, descripcion, areaMuscularAfectada: areas, severidad };
}
function buscarPorId() {
  const input = document.getElementById("inputBuscarId");

  if (!input) return;

  input.addEventListener("input", function () {
    const id = input.value.trim();

    // Si está vacío → volver a listar todo
    if (id === "") {
      listarPadecimientos();
      return;
    }

    // Si no es número → no hacer nada
    if (isNaN(id)) return;

    fetch(`${API_URL}/obtenerPadecimientoPorId/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(p => {
        const tbody = document.querySelector("tbody.table-group-divider");
        tbody.innerHTML = "";

        const fila = document.createElement("tr");
        fila.classList.add("table-primary");

        fila.innerHTML = `
          <td>${p.IdPadecimiento}</td>
          <td>${p.Nombre}</td>
          <td>${p.Descripcion}</td>
          <td>${p.AreaMuscularAfectada}</td>
          <td>${p.Severidad}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarPadecimiento(${p.idPadecimiento})">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPadecimiento(${p.idPadecimiento})">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        `;

        tbody.appendChild(fila);
      })
      .catch(() => {
        document.querySelector("tbody.table-group-divider").innerHTML =
          `<tr><td colspan="6" class="text-danger">No se encontró ningún padecimiento con ese ID.</td></tr>`;
      });
  });
}
