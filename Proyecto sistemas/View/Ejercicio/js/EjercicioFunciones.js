import { EjercicioModel } from "../Modelo/EjercicioModel.js"; // Asegúrate que el archivo y nombre coincidan exactamente

const URL_API = "https://localhost:7086/api/Ejercicio";

document.addEventListener("DOMContentLoaded", function () {
  // --- TABLA DE EJERCICIOS ---
  if (document.getElementById("tablaEjercicios")) {
    cargarEjercicios();

    document
      .getElementById("tablaEjercicios")
      .addEventListener("click", async function (e) {
        // Botón EDITAR: Abre el modal y precarga datos
        if (e.target.classList.contains("btn-editar")) {
          const id = e.target.dataset.id;
          await mostrarModalEditar(id);
        }
        // Botón BORRAR
        if (e.target.classList.contains("btn-borrar")) {
          const id = e.target.dataset.id;
          if (confirm("¿Seguro que deseas borrar este ejercicio?")) {
            await borrarEjercicio(id);
            await cargarEjercicios();
          }
        }
      });
  }

  // --- SUBMIT MODAL EDITAR ---
  const formModal = document.getElementById("formEditarEjercicio");
  if (formModal) {
    formModal.addEventListener("submit", async function (e) {
      e.preventDefault();

      const idEditar = document.getElementById("edit-idEjercicio").value;
      const nombre = document.getElementById("edit-nombre").value.trim();
      const descripcion = document
        .getElementById("edit-descripcion")
        .value.trim();
      const areaMuscular = document.getElementById("edit-areaMuscular").value;
      const repeticiones = parseInt(
        document.getElementById("edit-repeticiones").value,
        10
      );
      const guiaEjercicio = document
        .getElementById("edit-guiaEjercicio")
        .value.trim();
      const dificultad = document.getElementById("edit-dificultad").value;

      // Validación básica
      if (
        !nombre ||
        !descripcion ||
        !areaMuscular ||
        !repeticiones ||
        !guiaEjercicio ||
        !dificultad
      ) {
        mostrarMensaje(
          "Por favor complete todos los campos obligatorios.",
          "danger"
        );
        return;
      }

      const ejercicioDTO = {
        nombre,
        descripcion,
        areaMuscular,
        repeticiones,
        guiaEjercicio,
        dificultad,
      };

      try {
        const response = await fetch(`${URL_API}/editarEjercicio/${idEditar}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ejercicioDTO),
        });
        if (response.ok) {
          mostrarMensaje("¡Ejercicio editado exitosamente!", "success");
          // Cerrar el modal
          const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalEditarEjercicio")
          );
          modal.hide();
          await cargarEjercicios();
        } else {
          let errorMsg = "Error al editar el ejercicio.";
          try {
            const error = await response.json();
            if (error && error.mensaje) errorMsg += "<br>" + error.mensaje;
          } catch (jsonErr) {}
          mostrarMensaje(errorMsg, "danger");
        }
      } catch (err) {
        mostrarMensaje(
          "Error al conectar con la API: " + err.message,
          "danger"
        );
      }
    });
  }

  // --- AGREGAR/EDITAR DESDE FORMULARIO SEPARADO ---
  const form = document.querySelector("form:not(#formEditarEjercicio)");
  if (form) {
    // Si hay parámetro id, precarga para editar
    const params = new URLSearchParams(window.location.search);
    const idEditar = params.get("id");
    if (idEditar) {
      fetch(`${URL_API}/obtenerEjercicioPorId/${idEditar}`)
        .then((resp) => {
          if (!resp.ok) throw new Error("No se pudo obtener el ejercicio");
          return resp.json();
        })
        .then((data) => precargarFormulario(data))
        .catch(() =>
          mostrarMensaje("Error al cargar ejercicio para editar", "danger")
        );
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Recolectar datos del formulario
      const nombre = document.getElementById("nombre").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();
      const areaMuscular = document.getElementById("areaMuscular").value;
      const repeticiones = parseInt(
        document.getElementById("repeticiones").value,
        10
      );
      const guiaEjercicio = document
        .getElementById("guiaEjercicio")
        .value.trim();
      const dificultad = document.getElementById("dificultad").value;

      // Validación básica
      if (
        !nombre ||
        !descripcion ||
        !areaMuscular ||
        !repeticiones ||
        !guiaEjercicio ||
        !dificultad
      ) {
        mostrarMensaje(
          "Por favor complete todos los campos obligatorios.",
          "danger"
        );
        return;
      }

      // Usar el modelo EjercicioModel para construir el objeto
      const ejercicio = new EjercicioModel(
        idEditar ? parseInt(idEditar) : null,
        nombre,
        descripcion,
        areaMuscular,
        repeticiones,
        guiaEjercicio,
        dificultad
      );

      // El DTO enviado a la API
      const ejercicioDTO = {
        nombre: ejercicio.nombre,
        descripcion: ejercicio.descripcion,
        areaMuscular: ejercicio.areaMuscular,
        repeticiones: ejercicio.repeticiones,
        guiaEjercicio: ejercicio.guiaEjercicio,
        dificultad: ejercicio.dificultad,
      };

      try {
        let response;
        if (idEditar) {
          // Editar
          response = await fetch(`${URL_API}/editarEjercicio/${idEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ejercicioDTO),
          });
        } else {
          // Crear
          response = await fetch(`${URL_API}/crearEjercicio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ejercicioDTO),
          });
        }

        if (response.ok) {
          mostrarMensaje(
            idEditar
              ? "¡Ejercicio editado exitosamente!"
              : "¡Ejercicio guardado exitosamente!",
            "success"
          );
          form.reset();
          if (idEditar)
            setTimeout(
              () => (window.location.href = "indexEjercicio.html"),
              1000
            );
        } else {
          let errorMsg = "Error al guardar el ejercicio.";
          try {
            const error = await response.json();
            if (error && error.mensaje) errorMsg += "<br>" + error.mensaje;
          } catch (jsonErr) {}
          mostrarMensaje(errorMsg, "danger");
        }
      } catch (err) {
        mostrarMensaje(
          "Error al conectar con la API: " + err.message,
          "danger"
        );
      }
    });

    // Botón Salir
    const btnSalir = document.querySelector(".btn-custom[type='button']");
    if (btnSalir) {
      btnSalir.addEventListener("click", () => {
        window.history.back();
      });
    }
  }

  // --- FUNCIONES AUXILIARES ---

  async function cargarEjercicios() {
    const table = document.getElementById("tablaEjercicios");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "<tr><td colspan='7'>Cargando...</td></tr>";
    try {
      const resp = await fetch(`${URL_API}/listaEjercicios`);
      if (!resp.ok) throw new Error("No se pudo obtener la lista");
      const ejercicios = await resp.json();
      // Soporte para colecciones en $values (caso .NET)
      let lista = [];
      if (Array.isArray(ejercicios)) {
        lista = ejercicios;
      } else if (Array.isArray(ejercicios.$values)) {
        lista = ejercicios.$values;
      } else if (Array.isArray(ejercicios.data)) {
        lista = ejercicios.data;
      } else if (Array.isArray(ejercicios.lista)) {
        lista = ejercicios.lista;
      } else {
        console.warn("Formato inesperado de la respuesta:", ejercicios);
      }

      if (!Array.isArray(lista) || lista.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='7'>No hay ejercicios registrados.</td></tr>";
        return;
      }
      tbody.innerHTML = "";
      lista.forEach((ej) => {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
          <tr>
            <td>${ej.Nombre}</td>
            <td>${ej.Descripcion}</td>
            <td>${ej.Repeticiones}</td>
            <td><a href="${ej.GuiaEjercicio}" target="_blank">Ver video</a></td>
            <td>${ej.AreaMuscular}</td>
            <td>${ej.Dificultad}</td>
            <td>
              <button class="btn btn-sm btn-primary btn-editar" data-id="${ej.IdEjercicio}"><i class="fas fa-edit"></i> Editar</button>
              <button class="btn btn-sm btn-danger btn-borrar" data-id="${ej.IdEjercicio}"><i class="fas fa-trash-alt"></i> Borrar</button>
            </td>
          </tr>
        `
        );
      });
    } catch (err) {
      mostrarMensaje("Error al cargar ejercicios: " + err.message, "danger");
      if (tbody)
        tbody.innerHTML =
          "<tr><td colspan='7'>Error al cargar datos.</td></tr>";
    }
  }

  async function mostrarModalEditar(id) {
    try {
      const resp = await fetch(`${URL_API}/obtenerEjercicioPorId/${id}`);
      if (!resp.ok) throw new Error("No se pudo obtener el ejercicio");
      const ejercicio = await resp.json();
      // Precarga datos en el modal
      document.getElementById("edit-idEjercicio").value =
        ejercicio.IdEjercicio ?? "";
      document.getElementById("edit-nombre").value = ejercicio.Nombre ?? "";
      document.getElementById("edit-descripcion").value =
        ejercicio.Descripcion ?? "";
      document.getElementById("edit-areaMuscular").value =
        ejercicio.AreaMuscular ?? "";
      document.getElementById("edit-repeticiones").value =
        ejercicio.Repeticiones ?? "";
      document.getElementById("edit-guiaEjercicio").value =
        ejercicio.GuiaEjercicio ?? "";
      document.getElementById("edit-dificultad").value =
        ejercicio.Dificultad ?? "";
      // Abre el modal
      const modal = new bootstrap.Modal(
        document.getElementById("modalEditarEjercicio")
      );
      modal.show();
    } catch (err) {
      mostrarMensaje(
        "Error al cargar ejercicio para editar: " + err.message,
        "danger"
      );
    }
  }

  async function borrarEjercicio(id) {
    try {
      const resp = await fetch(`${URL_API}/eliminarEjercicio/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("No se pudo borrar el ejercicio");
      mostrarMensaje("Ejercicio eliminado correctamente.", "success");
    } catch (err) {
      mostrarMensaje("Error al borrar ejercicio: " + err.message, "danger");
    }
  }

  function mostrarMensaje(msg, tipo = "info") {
    let alertPlaceholder = document.getElementById("alertPlaceholder");
    if (!alertPlaceholder) {
      alertPlaceholder = document.createElement("div");
      alertPlaceholder.id = "alertPlaceholder";
      const main = document.querySelector("main");
      if (main) main.insertBefore(alertPlaceholder, main.firstChild);
      else document.body.prepend(alertPlaceholder);
    }
    alertPlaceholder.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show mt-3 mb-0" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `;
  }

  function precargarFormulario(ejercicio) {
    document.getElementById("nombre").value = ejercicio.Nombre ?? "";
    document.getElementById("descripcion").value = ejercicio.Descripcion ?? "";
    document.getElementById("areaMuscular").value =
      ejercicio.AreaMuscular ?? "";
    document.getElementById("repeticiones").value =
      ejercicio.Repeticiones ?? "";
    document.getElementById("guiaEjercicio").value =
      ejercicio.GuiaEjercicio ?? "";
    document.getElementById("dificultad").value = ejercicio.Dificultad ?? "";
  }
});
