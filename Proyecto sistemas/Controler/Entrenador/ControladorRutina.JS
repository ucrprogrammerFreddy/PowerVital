const API_CLIENTE = "https://localhost:7086/api/Cliente";
const API_PADECIMIENTO_CLIENTE = "https://localhost:7086/api/AsignarPadecimientos";
const API_PADECIMIENTO_GENERAL = "https://localhost:7086/api/Padecimiento";
const API_EJERCICIOS = "https://localhost:7086/api/Ejercicio";
const API_RUTINA = "https://localhost:7086/api/Rutina";

let clienteSeleccionado = null;
let rutinaSugerida = [];

window.listaPadecimientos = [];

$.get(`${API_PADECIMIENTO_GENERAL}/listaPadecimientos`, (data) => {
  window.listaPadecimientos = data;
});

// 🔍 Buscar clientes
$("#clienteBuscador").on("input", function () {
  const texto = $(this).val().toLowerCase();
  if (texto.length < 2) return;

  $.get(`${API_CLIENTE}/listaClientes`, (clientes) => {
    const filtrados = clientes.filter((c) =>
      c.Nombre.toLowerCase().includes(texto) || c.Email.toLowerCase().includes(texto)
    );

    const $lista = $("#listaResultados");
    $lista.empty();
    filtrados.forEach((c) => {
      $lista.append(`<li data-id="${c.IdUsuario}">${c.Nombre} - ${c.Email}</li>`);
    });

    $lista.find("li").on("click", function () {
      const id = $(this).data("id");
      const nombre = $(this).text();
      clienteSeleccionado = id;
      $("#nombreCliente").text(nombre);
      $("#rutinaGenerada").show();
      $("#infoCliente").show();
      cargarInfoCliente(id);
      generarRutina(id);
      $lista.empty();
      $("#clienteBuscador").val("");
    });
  });
});

function cargarInfoCliente(clienteId) {
  $.get(`${API_CLIENTE}/obtenerClientePorId/${clienteId}`, (cliente) => {
    $("#clienteNombre").text(cliente.Nombre);
    $("#clientePeso").text(cliente.Peso + " kg");
    $("#clienteAltura").text(cliente.Altura + " cm");
    $("#clienteEntrenador").text(cliente.Entrenador?.Nombre || "-");

    $.get(`${API_PADECIMIENTO_CLIENTE}/obtenerPadecimientos/${clienteId}`, (padecimientos) => {
      const lista = padecimientos.map(p => {
        const nombre = (
          window.listaPadecimientos.find(
            x => Number(x.IdPadecimiento) === Number(p.IdPadecimiento)
          ) || {}
        ).Nombre || `ID ${p.IdPadecimiento}`;
        return `${nombre} (${p.Severidad})`;
      }).join(", ");

      $("#clientePadecimientos").text(lista || "-");
    });
  });
}

function generarRutina(clienteId) {
  Promise.all([
    $.get(`${API_PADECIMIENTO_CLIENTE}/obtenerPadecimientos/${clienteId}`),
    $.get(`${API_EJERCICIOS}/listaEjercicios`)
  ]).then(([padecimientos, ejercicios]) => {
    const zonasAfectadas = padecimientos.map(p => ({
      zona: (p.areaMuscularAfectada || "").toLowerCase(),
      severidad: (p.severidad || "").toLowerCase()
    }));

    rutinaSugerida = ejercicios.filter(e => {
      const area = (e.areaMuscular || "").toLowerCase();
      return zonasAfectadas.some(z =>
        area.includes(z.zona) && z.severidad !== "grave"
      );
    });

    mostrarTablaRutina();
  });
}

function mostrarTablaRutina() {
  const $tbody = $("#tablaRutina tbody");
  $tbody.empty();

  rutinaSugerida.forEach((ej, index) => {
    $tbody.append(`
      <tr>
        <td>${ej.Nombre}</td>
        <td>${ej.AreaMuscular}</td>
        <td><input type="number" value="3" min="1" class="series-input" data-index="${index}"></td>
        <td><input type="number" value="12" min="1" class="reps-input" data-index="${index}"></td>
        <td><button onclick="eliminarEjercicio(${index})">Eliminar</button></td>
      </tr>
    `);
  });
}


function eliminarEjercicio(index) {
  rutinaSugerida.splice(index, 1);
  mostrarTablaRutina();
}

$("#guardarRutina").on("click", function () {
  if (!clienteSeleccionado || rutinaSugerida.length === 0) {
    alert("Selecciona un cliente y asegúrate de que la rutina tenga ejercicios.");
    return;
  }

  const ejercicios = rutinaSugerida.map((ej, i) => {
    const $row = $("#tablaRutina tbody tr").eq(i);
    const series = parseInt($row.find(".series-input").val()) || 0;
    const repeticiones = parseInt($row.find(".reps-input").val()) || 0;

    return {
      idEjercicio: ej.idEjercicio,
      series: series,
      repeticiones: repeticiones
    };
  });

  const dto = {
    fechaInicio: new Date(),
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    idCliente: clienteSeleccionado,
    ejercicios: ejercicios
  };

  $.ajax({
    url: `${API_RUTINA}/crearRutinaCompleta`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(dto),
    success: () => alert("✅ Rutina guardada correctamente"),
    error: () => alert("❌ Error al guardar rutina")
  });
});