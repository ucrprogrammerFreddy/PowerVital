import { ClienteModel } from "../../Model/ClienteModel.js";

// Definimos la base de la URL para las peticiones a la API
const API_BASE = "https://localhost:7086/api";

// Variable global para lista de padecimientos
window.listaPadecimientos = [];

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
    alert("Error al cargar entrenadores.");
  });
}

/**
 * Carga y muestra los padecimientos disponibles en forma de checkboxes + select de severidad.
 * @param {Array} padecimientosSeleccionados - IDs de padecimientos que deben aparecer seleccionados.
 * @param {Object} severidadesSeleccionadas - Diccionario idPadecimiento: severidad (opcional para edición)
 */
export function cargarPadecimientos(
  padecimientosSeleccionados = [],
  severidadesSeleccionadas = {}
) {
  $.get(`${API_BASE}/Padecimiento/listaPadecimientos`, function (data) {
    window.listaPadecimientos = data; // Guarda la lista globalmente para usar en historial

    const $container = $("#padecimientosList");
    $container.empty();

    data.forEach((p) => {
      const checked = padecimientosSeleccionados.includes(p.IdPadecimiento)
        ? "checked"
        : "";
      const severidad = severidadesSeleccionadas[p.IdPadecimiento] || "";

      const checkbox = `
        <div class="d-flex align-items-center mb-2 gap-2">
          <input class="form-check-input padecimiento-item" type="checkbox" value="${
            p.IdPadecimiento
          }" id="pad-${p.IdPadecimiento}" ${checked}>
          <label class="form-check-label me-2" for="pad-${p.IdPadecimiento}">${
        p.Nombre
      }</label>
          <select class="form-select form-select-sm severidad-padecimiento" data-padecimiento="${
            p.IdPadecimiento
          }" style="width: auto; display: ${
        checked ? "inline-block" : "none"
      };">
            <option value="">Severidad</option>
            <option value="Leve" ${
              severidad === "Leve" ? "selected" : ""
            }>Leve</option>
            <option value="Moderado" ${
              severidad === "Moderado" ? "selected" : ""
            }>Moderado</option>
            <option value="Grave" ${
              severidad === "Grave" ? "selected" : ""
            }>Grave</option>
          </select>
        </div>`;

      $container.append(checkbox);
    });

    // Mostrar/ocultar el select de severidad solo si el checkbox está seleccionado
    $container.find('input[type="checkbox"]').on("change", function () {
      const $select = $(this)
        .closest("div")
        .find("select.severidad-padecimiento");
      $select.toggle(this.checked);
      if (!this.checked) $select.val(""); // Limpia si se desmarca
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

      const padecimientos = cliente.PadecimientosCompletos || [];

      // Si hay padecimientos seleccionados, los asigna al cliente
      if (padecimientos.length > 0) {
        asignarPadecimientos(clienteId, padecimientos, cliente.Peso);
      } else {
        // Si no tiene padecimientos, solo avisa y redirige
        alert("✅ Cliente registrado sin padecimientos");
        location.href = "ListaClientes.html";
      }
    },
    error: (xhr) => {
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
    const severidades = {};
    cliente.PadecimientosClientes.forEach((p) => {
      const id =
        p.PadecimientoId || p.IdPadecimiento || p.Padecimiento?.IdPadecimiento;
      severidades[id] = p.Severidad || "";
    });
    cargarPadecimientos(ids, severidades);
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
        complete: () =>
          asignarPadecimientos(
            id,
            cliente.PadecimientosCompletos,
            cliente.Peso
          ),
      });
    },
    error: () => alert("Error al actualizar cliente"),
  });
}

/**
 * Registra un historial de padecimiento.
 * @param {Object} datosHistorial
 *   - IdCliente
 *   - IdPadecimiento
 *   - NombrePadecimiento
 *   - Peso
 *   - Severidad
 */
function registrarPadecimientoHistorial({
  IdCliente,
  IdPadecimiento,
  NombrePadecimiento,
  Peso,
  Severidad,
}) {
  $.ajax({
    url: `${API_BASE}/PadecimientoHistorial`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      IdCliente,
      IdPadecimiento,
      NombrePadecimiento,
      Peso,
      Severidad,
      // Fecha la pone el backend
    }),
    error: () => alert("Error al registrar historial de padecimiento"),
  });
}

/**
 * Asigna los padecimientos seleccionados a un cliente y guarda el historial.
 * @param {number} idCliente
 * @param {Array} padecimientosCompletos - Array de objetos {IdPadecimiento, Severidad}
 * @param {number} peso - Peso actual del cliente
 */
function asignarPadecimientos(idCliente, padecimientosCompletos, peso) {
  if (!padecimientosCompletos || padecimientosCompletos.length === 0) return;

  const peticiones = padecimientosCompletos.map((p) => {
    // Busca el nombre del padecimiento en la lista global
    const padecimientoObj = window.listaPadecimientos.find(
      (x) => x.IdPadecimiento === p.IdPadecimiento
    );
    const nombrePadecimiento = padecimientoObj ? padecimientoObj.Nombre : "";

    // 1. Asigna el padecimiento al cliente
    return $.ajax({
      url: `${API_BASE}/AsignarPadecimientos/asignarPadecimiento`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        IdCliente: idCliente,
        IdsPadecimientos: [p.IdPadecimiento],
        Severidad: p.Severidad,
      }),
      // 2. Al éxito, registra el historial
      success: function () {
        registrarPadecimientoHistorial({
          IdCliente: idCliente,
          IdPadecimiento: p.IdPadecimiento,
          NombrePadecimiento: nombrePadecimiento,
          Peso: peso,
          Severidad: p.Severidad,
        });
      },
    });
  });

  // Espera que todas terminen antes de continuar
  $.when(...peticiones)
    .done(() => (location.href = "ListaClientes.html"))
    .fail(() => alert("Error al asignar padecimientos o registrar historial"));
}

/**
 * Extrae los valores del formulario y los estructura como un objeto cliente.
 * @param {string} tipo - "Crear" o "Editar" para diferenciar el prefijo de los campos.
 * @returns {Object} Cliente estructurado para enviar al backend
 */
function obtenerClienteDesdeFormulario(tipo) {
  const padecimientosCompletos = [];

  function getCampo(id, isNumber = false, isFloat = false) {
    const val = $(`#${id}`).val();
    if (isNumber) {
      const num = isFloat ? parseFloat(val) : parseInt(val, 10);
      return isNaN(num) ? null : num;
    }
    return val ? val.trim() : "";
  }

  // Entrenador
  const entrenadorId = getCampo("entrenador", true);

  // Padecimientos y severidad
  $("#padecimientosList input:checked").each(function () {
    const idPadecimiento = parseInt(this.value, 10);
    const severidad = $(this)
      .closest("div")
      .find("select.severidad-padecimiento")
      .val();
    if (!isNaN(idPadecimiento) && severidad) {
      padecimientosCompletos.push({
        IdPadecimiento: idPadecimiento,
        Severidad: severidad,
      });
    }
  });

  // Fecha de nacimiento y validación
  let fechaNacStr = getCampo("fechaNacimiento").trim();
  if (!fechaNacStr) {
    alert("Debes ingresar la fecha de nacimiento.");
    throw new Error("Fecha de nacimiento vacía");
  }
  let fechaNacISO = fechaNacStr;
  const fechaNac = new Date(fechaNacISO);
  const hoy = new Date();
  if (isNaN(fechaNac.getTime()) || fechaNac > hoy) {
    alert("❌ La fecha de nacimiento no puede ser en el futuro o inválida.");
    throw new Error("Fecha de nacimiento inválida");
  }

  // Validación extra para campos requeridos
  const nombre = getCampo("nombre");
  const clave = getCampo("clave");
  const email = getCampo("correo");
  const genero = getCampo("genero");
  if (!nombre || !clave || !email || !genero) {
    alert(
      "Por favor, rellena todos los campos obligatorios (nombre, clave, correo, género)."
    );
    throw new Error("Campos requeridos vacíos");
  }

  const cliente = {
    IdUsuario: tipo === "Crear" ? 0 : getCampo("idUsuario", true) || 0,
    Nombre: nombre,
    Clave: clave,
    Email: email,
    Telefono: getCampo("telefono"),
    FechaNacimiento: fechaNacISO,
    Genero: genero,
    Altura: getCampo("altura", true, true) || 0,
    Peso: getCampo("peso", true, true) || 0,
    EstadoPago: true,
    EntrenadorId: entrenadorId || 0,
    Padecimientos: padecimientosCompletos.map((p) => p.IdPadecimiento),
    PadecimientosCompletos: padecimientosCompletos, // para asignar con severidad
  };

  return cliente;
}
/**
 * Lista todos los clientes en la tabla HTML.
 */
export function listarClientes() {
  $.get(`${API_BASE}/Cliente/listaClientes`, function (data) {
    const tbody = $("#cliente-tbody");
    tbody.empty();

    data.forEach((c) => {
      // Convierte los padecimientos a una cadena separada por comas (con severidad)
      const padecimientos =
        c.PadecimientosClientes?.map((p) => {
          const nombre = p.Padecimiento?.Nombre || "";
          const severidad = p.Severidad ? ` (${p.Severidad})` : "";
          return nombre + severidad;
        }).join(", ") || "-";

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
