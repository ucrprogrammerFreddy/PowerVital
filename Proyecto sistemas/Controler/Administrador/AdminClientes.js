import { ClienteModel } from "../../Model/ClienteModel.js";

// Definimos la base de la URL para las peticiones a la API
const API_BASE = "https://localhost:7086/api";

/**
 * Carga la lista de entrenadores desde la API y los agrega al combobox.
 * @param {Function|null} callback - Función opcional a ejecutar después de cargar los entrenadores.
 */
export function cargarEntrenadores(callback = null) {
  const $select = $("#entrenador");

  $.get(`${API_BASE}/Entrenador/listaEntrenador`, function (data) {
    $select
      .empty()
      .append(`<option value="">Seleccione un entrenador</option>`);
    const idsAgregados = new Set();

    data.forEach((ent) => {
      if (!idsAgregados.has(ent.idIdUsuario)) {
        $select.append(
          `<option value="${ent.idIdUsuario}">${ent.Nombre}</option>`
        );
        idsAgregados.add(ent.idIdUsuario);
      }
    });

    if (callback) callback();
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
    alert("Error al cargar entrenadores.");
  });
}

/**
 * Carga y muestra los padecimientos disponibles en forma de checkboxes.
 * @param {Array} padecimientosSeleccionados - IDs de padecimientos que deben aparecer seleccionados.
 */
export function cargarPadecimientos(padecimientosSeleccionados = []) {
  $.get(`${API_BASE}/Padecimiento/listaPadecimientos`, function (data) {
    const $container = $("#padecimientosList");
    $container.empty();

    data.forEach((p) => {
      const checked = padecimientosSeleccionados.includes(p.IdPadecimiento)
        ? "checked"
        : "";

      const checkbox = `
        <div class="form-check">
            <input class="form-check-input padecimiento-item" type="checkbox" value="${p.IdPadecimiento}" id="pad-${p.IdPadecimiento}" ${checked}>
            <label class="form-check-label" for="pad-${p.IdPadecimiento}">${p.Nombre}</label>
        </div>`;

      $container.append(checkbox);
    });
  }).fail(function () {
    alert("Error al cargar padecimientos.");
  });
}

/**
 * Registra un nuevo cliente. Si tiene padecimientos los asigna.
 */
export function registrarCliente() {
  let cliente;
  try {
    cliente = obtenerClienteDesdeFormulario("Crear");
  } catch (err) {
    console.error(err);
    return; // Ya se alertó el error
  }

  // Envia el cliente a la API para crearlo
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

      // Si hay padecimientos seleccionados, los asigna al cliente
      if (ids.length > 0) {
        const payload = {
          IdCliente: clienteId,
          IdsPadecimientos: ids,
        };

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
            console.error(
              "❌ Error al asignar padecimientos:",
              xhr.responseText
            );
            alert("❌ Error al asignar padecimientos:\n" + xhr.responseText);
          },
        });
      } else {
        // Si no tiene padecimientos, solo avisa y redirige
        alert("✅ Cliente registrado sin padecimientos");
        location.href = "ListaClientes.html";
      }
    },
    error: (xhr) => {
      console.error("❌ Error al registrar cliente:", xhr.responseText);
      alert("❌ Error al registrar cliente: " + xhr.responseText);
    },
  });
}

/**
 * Carga la información de un cliente desde localStorage y la muestra en el formulario de edición.
 */
export function cargarClienteEditar() {
  // Recupera el cliente guardado en localStorage
  const cliente = JSON.parse(localStorage.getItem("clienteEditar"));
  if (!cliente) return;

  // Carga entrenadores y selecciona el correspondiente
  cargarEntrenadores(() => {
    $("#entrenador").val(
      cliente.Entrenador?.idIdUsuario ||
        cliente.EntrenadorId ||
        cliente.idIdUsuario
    );
  });

  // Llena los campos del formulario con los datos del cliente
  $("#nombre").val(cliente.Nombre);
  $("#clave").val(cliente.Clave);
  $("#correo").val(cliente.Email);
  $("#telefono").val(cliente.Telefono);
  $("#fechaNacimiento").val(cliente.FechaNacimiento.split("T")[0]);
  $("#genero").val(cliente.Genero);
  $("#altura").val(cliente.Altura);
  $("#peso").val(cliente.Peso);

  // Si el cliente tiene padecimientos, los muestra y selecciona
  if (cliente.PadecimientosClientes?.length > 0) {
    $("#padecimiento").prop("checked", true);
    $("#contenedorPadecimientos").show();
    const ids = cliente.PadecimientosClientes.map(
      (p) =>
        p.PadecimientoId || p.IdPadecimiento || p.Padecimiento?.IdPadecimiento
    );

    cargarPadecimientos(ids);
  }

  // Evento de guardado del formulario de edición
  $("#formularioEditar")
    .off("submit")
    .submit(function (e) {
      e.preventDefault();
      actualizarCliente(cliente.IdUsuario);
    });
}

/**
 * Actualiza la información de un cliente existente y sus padecimientos.
 * @param {number} id - ID del cliente a actualizar.
 */
export function actualizarCliente(id) {
  const cliente = obtenerClienteDesdeFormulario("Editar");
  cliente.IdUsuario = id;

  // Actualiza el cliente en la API
  $.ajax({
    url: `${API_BASE}/Cliente/editarCliente`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: () => {
      // Elimina los padecimientos previos y asigna los nuevos
      $.ajax({
        url: `${API_BASE}/AsignarPadecimientos/eliminarPadecimiento/${id}`,
        type: "DELETE",
        complete: () => asignarPadecimientos(id, cliente.Padecimientos),
      });
    },
    error: () => alert("Error al actualizar cliente"),
  });
}

/**
 * Asigna los padecimientos seleccionados a un cliente.
 * @param {number} idCliente
 * @param {Array} ids - IDs de los padecimientos a asignar.
 */
function asignarPadecimientos(idCliente, ids) {
  if (!ids || ids.length === 0) return;
  const payload = ids.map((id) => ({
    IdCliente: idCliente,
    IdPadecimiento: id,
  }));
  $.ajax({
    url: `${API_BASE}/AsignarPadecimientos/asignarPadecimiento`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: () => (location.href = "ListaClientes.html"),
    error: () => alert("Error al asignar padecimientos"),
  });
}

/**
 * Extrae los valores del formulario y los estructura como un objeto cliente.
 * @param {string} tipo - "Crear" o "Editar" para diferenciar el prefijo de los campos.
 * @returns {Object} Cliente estructurado para enviar al backend
 */
function obtenerClienteDesdeFormulario(tipo) {
  const pref = tipo === "Crear" ? "" : "Editar";
  const padecimientos = [];

  const entrenadorSelect = $("#entrenador");

  // Verifica que exista el campo de entrenador
  if (!entrenadorSelect.length) {
    alert("❌ El campo de entrenador no existe en el DOM.");
    throw new Error("Elemento #entrenador no encontrado.");
  }

  // Obtiene y valida el valor del entrenador seleccionado
  const entrenadorValorCrudo = entrenadorSelect.val();
  const entrenadorId = parseInt(entrenadorValorCrudo);

  if (isNaN(entrenadorId) || entrenadorId <= 0) {
    alert("❌ Debes seleccionar un entrenador válido.");
    throw new Error("EntrenadorId inválido");
  }

  // Obtiene los padecimientos seleccionados
  $("#padecimientosList input:checked").each(function () {
    padecimientos.push(parseInt($(this).val()));
  });

  // Valida que la fecha de nacimiento no sea en el futuro
  const fechaNac = new Date($(`#fechaNacimiento${pref}`).val());
  const hoy = new Date();
  if (fechaNac > hoy) {
    alert("❌ La fecha de nacimiento no puede ser en el futuro.");
    throw new Error("Fecha de nacimiento inválida");
  }

  // Retorna el objeto cliente listo para enviar al backend
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
    Padecimientos: padecimientos, // este campo no lo usa el backend al crear, pero útil luego
  };
}

/**
 * Lista todos los clientes en la tabla HTML.
 */
export function listarClientes() {
  $.get(`${API_BASE}/Cliente/listaClientes`, function (data) {
    const tbody = $("#cliente-tbody");
    tbody.empty();

    data.forEach((c) => {
      // Convierte los padecimientos a una cadena separada por comas
      const padecimientos =
        c.PadecimientosClientes?.map((p) => p.Padecimiento?.Nombre).join(
          ", "
        ) || "-";

      // Construye la fila para la tabla
      const fila = `
        <tr>
            <td>${c.Nombre}</td>
            <td>${c.Email}</td>
            <td>${c.Telefono}</td>
            <td>${c.Altura}</td>
            <td>${c.Peso}</td>
            <td>${c.Entrenador?.Nombre || "-"}</td>
            <td>${c.EstadoPago}</td>
            <td>${padecimientos}</td>
            <td>
                <button class='btn btn-sm btn-primary' onclick='editarCliente(${JSON.stringify(
                  c
                ).replace(/"/g, "&quot;")})'>Editar</button>
                <button class='btn btn-sm btn-danger' onclick='eliminarCliente(${
                  c.IdUsuario
                })'>Eliminar</button>
            </td>
        </tr>`;
      tbody.append(fila);
    });
  });
}

/**
 * Función global para editar un cliente.
 * Almacena el cliente en localStorage y redirige a la página de edición.
 */
window.editarCliente = function (cliente) {
  localStorage.setItem("clienteEditar", JSON.stringify(cliente));
  window.location.href = "EditarCliente.html";
};

/**
 * Función global para eliminar un cliente.
 * Pide confirmación antes de eliminar y actualiza la lista.
 */
window.eliminarCliente = function (id) {
  if (!confirm("¿Deseas eliminar este cliente?")) return;
  $.ajax({
    url: `${API_BASE}/Cliente/eliminarCliente/${id}`,
    method: "DELETE",
    success: () => {
      alert("Cliente eliminado correctamente");
      listarClientes();
    },
    error: () => alert("Error al eliminar cliente"),
  });
};
