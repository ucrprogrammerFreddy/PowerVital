// AdminClientes.js
import { ClienteModel } from "../../Model/ClienteModel.js";

const API_BASE = "https://localhost:7086/api";




export function cargarEntrenadores(callback = null) {
  const $select = $("#entrenador");

  $.get("https://localhost:7086/api/Entrenador/listaEntrenador", function (data) {
    $select.empty().append(`<option value="">Seleccione un entrenador</option>`);

    const idsAgregados = new Set(); // 🧼 Evita duplicados

    data.forEach(ent => {
      if (!idsAgregados.has(ent.IdUsuario)) {
     $select.append(`<option value="${ent.idIdUsuario}">${ent.Nombre}</option>`);

        idsAgregados.add(ent.IdUsuario);
      }
    });

    if (callback) callback();
  });
}


export function cargarPadecimientos(padecimientosSeleccionados = []) {
  $.get(`${API_BASE}/Padecimiento/listaPadecimientos`, function (data) {
    console.log("✔️ Padecimientos disponibles:", data);

    const $container = $("#padecimientosList");
    $container.empty();

    data.forEach(p => {
      const checked = padecimientosSeleccionados.includes(p.IdPadecimiento) ? "checked" : "";
     
const checkbox = `
  <div class="form-check">
    <input class="form-check-input padecimiento-item" type="checkbox" value="${p.IdPadecimiento}" id="pad-${p.IdPadecimiento}">
    <label class="form-check-label" for="pad-${p.IdPadecimiento}">${p.Nombre}</label>
  </div>`;

      $container.append(checkbox);
    });
  });
}


export function registrarCliente() {
  const cliente = obtenerClienteDesdeFormulario("Crear");
  console.log("🧾 Cliente que se enviará:", cliente);

  $.ajax({
    url: `${API_BASE}/Cliente/CrearCliente`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: (res) => {
      const clienteId = res.IdUsuario;

      if (!clienteId || clienteId === 0) {
        alert("❌ No se obtuvo un ID válido del cliente.");
        return;
      }

      const ids = cliente.Padecimientos || [];

      if (ids.length > 0) {
        const payload = {
          IdCliente: clienteId,
          IdsPadecimientos: ids
        };

        console.log("📦 Payload asignación:", payload);

        $.ajax({
          url: `${API_BASE}/AsignarPadecimientos/asignarPadecimiento`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
          success: () => {
            alert("✅ Cliente y padecimientos registrados correctamente");
            location.href = "ListaClientes.html";
          },
          error: (xhr) => {
            console.error("❌ Error al asignar padecimientos:", xhr.responseText);
            alert("❌ Error al asignar padecimientos:\n" + xhr.responseText);
          }
        });
      } else {
        alert("✅ Cliente registrado sin padecimientos");
        location.href = "ListaClientes.html";
      }
    },
    error: (xhr) => {
      console.error("❌ Error al registrar cliente:", xhr.responseText);
      alert("❌ Error al registrar cliente: " + xhr.responseText);
    }
  });
}












export function cargarClienteEditar() {
  const cliente = JSON.parse(localStorage.getItem("clienteEditar"));
  if (!cliente) return;

  cargarEntrenadores(() => {
    $("#entrenador").val(cliente.Entrenador?.IdUsuario || cliente.EntrenadorId);
  });

  $("#nombre").val(cliente.Nombre);
  $("#clave").val(cliente.Clave);
  $("#correo").val(cliente.Email);
  $("#telefono").val(cliente.Telefono);
  $("#fechaNacimiento").val(cliente.FechaNacimiento.split("T")[0]);
  $("#genero").val(cliente.Genero);
  $("#altura").val(cliente.Altura);
  $("#peso").val(cliente.Peso);

  if (cliente.PadecimientosClientes?.length > 0) {
    $("#padecimiento").prop("checked", true);
    $("#contenedorPadecimientos").show();
  const ids = cliente.padecimientosClientes.map(p =>
  p.padecimientoId || p.idPadecimiento || p.padecimiento?.idPadecimiento
);

    cargarPadecimientos(ids);
  }

  $("#formularioEditar").off("submit").submit(function (e) {
    e.preventDefault();
    actualizarCliente(cliente.idUsuario);
  });
}

export function actualizarCliente(id) {
  const cliente = obtenerClienteDesdeFormulario("Editar");
  cliente.IdUsuario = id;

  $.ajax({
    url: `${API_BASE}/Cliente/editarCliente`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: () => {
      $.ajax({
        url: `${API_BASE}/AsignarPadecimientos/eliminarPadecimiento/${id}`,
        type: "DELETE",
        complete: () => asignarPadecimientos(id, cliente.Padecimientos)
      });
    },
    error: () => alert("Error al actualizar cliente")
  });
}

function asignarPadecimientos(idCliente, ids) {
  if (!ids || ids.length === 0) return;
  const payload = ids.map(id => ({ IdCliente: idCliente, IdPadecimiento: id }));
  $.ajax({
    url: `${API_BASE}/AsignarPadecimientos/asignarPadecimiento`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: () => location.href = "ListaClientes.html",
    error: () => alert("Error al asignar padecimientos")
  });
}

// function obtenerClienteDesdeFormulario(tipo) {
//   const pref = tipo === "Crear" ? "" : "Editar";
//   const padecimientos = [];
//   $("#padecimientosList input:checked").each(function () {
//     padecimientos.push(parseInt($(this).val()));
//   });

//   return new ClienteModel(
//     null,
//     $(`#nombre${pref}`).val(),
//     $(`#clave${pref}`).val(),
//     $(`#correo${pref}`).val(),
//     $(`#telefono${pref}`).val(),
//     $(`#fechaNacimiento${pref}`).val(),
//     $(`#genero${pref}`).val(),
//     parseFloat($(`#altura${pref}`).val()),
//     parseFloat($(`#peso${pref}`).val()),
//     "Pendiente",
//     parseInt($(`#entrenador${pref}`).val()),
//     padecimientos
//   );
// }


function obtenerClienteDesdeFormulario(tipo) {
  const pref = tipo === "Crear" ? "" : "Editar";
  const padecimientos = [];


const entrenadorSelect = $("#entrenador");

if (!entrenadorSelect.length) {
  alert("❌ El campo de entrenador no existe en el DOM.");
  throw new Error("Elemento #entrenador no encontrado.");
}

const entrenadorValorCrudo = entrenadorSelect.val();
console.log("Valor crudo de entrenador:", entrenadorValorCrudo);

const entrenadorId = parseInt(entrenadorValorCrudo);
console.log("Convertido a entero:", entrenadorId);

if (isNaN(entrenadorId) || entrenadorId <= 0) {
  alert("❌ Debes seleccionar un entrenador válido.");
  throw new Error("EntrenadorId inválido");
}


if (isNaN(entrenadorId)) {
  alert("❌ Debes seleccionar un entrenador válido.");
  throw new Error("EntrenadorId inválido");
}


if (isNaN(entrenadorId)) {
  alert("❌ Debes seleccionar un entrenador válido.");
  throw new Error("EntrenadorId inválido");
}

  $("#padecimientosList input:checked").each(function () {
    padecimientos.push(parseInt($(this).val()));
  });


const fechaNac = new Date($(`#fechaNacimiento${pref}`).val());
const hoy = new Date();
if (fechaNac > hoy) {
  alert("❌ La fecha de nacimiento no puede ser en el futuro.");
  throw new Error("Fecha de nacimiento inválida");
}



  return {
    IdUsuario: 0, // lo ignora el backend al crear
    Nombre: $(`#nombre${pref}`).val(),
    Clave: $(`#clave${pref}`).val(),
    Email: $(`#correo${pref}`).val(),
    Telefono: parseInt($(`#telefono${pref}`).val()),
    FechaNacimiento: $(`#fechaNacimiento${pref}`).val(),
    Genero: $(`#genero${pref}`).val(),
    Altura: parseFloat($(`#altura${pref}`).val()),
    Peso: parseFloat($(`#peso${pref}`).val()),
    EstadoPago: true,
    EntrenadorId: entrenadorId,
    Padecimientos: padecimientos // este campo no lo usa el backend al crear, pero útil luego
  };
}




export function listarClientes() {
  $.get(`${API_BASE}/Cliente/listaClientes`, function (data) {
    const tbody = $("#cliente-tbody");
    tbody.empty();

    console.log("✅ Datos recibidos del API:", data);

    data.forEach(c => {
      console.log("👀 Cliente:", c);
      console.log("🧾 Padecimientos:", c.PadecimientosClientes);

      const padecimientos = c.PadecimientosClientes?.map(p => p.Padecimiento?.Nombre).join(", ") || "-";

      const fila = `
        <tr>
          <td>${c.Nombre}</td>
          <td>${c.Email}</td>
          <td>${c.Telefono}</td>
          <td>${c.Altura}</td>
          <td>${c.Peso}</td>
          <td>${c.Entrenador?.Nombre || '-'}</td>
          <td>${c.EstadoPago}</td>
          <td>${padecimientos}</td>
          <td>
            <button class='btn btn-sm btn-primary' onclick='editarCliente(${JSON.stringify(c).replace(/"/g, "&quot;")})'>Editar</button>
            <button class='btn btn-sm btn-danger' onclick='eliminarCliente(${c.IdUsuario})'>Eliminar</button>
          </td>
        </tr>`;
      tbody.append(fila);
    });
  });
}








window.editarCliente = function (cliente) {
  localStorage.setItem("clienteEditar", JSON.stringify(cliente));
  window.location.href = "EditarCliente.html";
};

window.eliminarCliente = function (id) {
  if (!confirm("¿Deseas eliminar este cliente?")) return;
  $.ajax({
    url: `${API_BASE}/Cliente/eliminarCliente/${id}`,
    method: "DELETE",
    success: () => {
      alert("Cliente eliminado correctamente");
      listarClientes();
    },
    error: () => alert("Error al eliminar cliente")
  });
};
