const URL_API = "https://localhost:7086/api/Entrenador/";

// Función principal que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Cargar lista si existe tabla
    const tablaEntrenadores = document.getElementById("entrenador-tbody");
    if (tablaEntrenadores) {
        obtenerTodosLosEntrenadores()
            .then(response => {
                if (Array.isArray(response.$values)) {
                    renderizarEntrenadores(response.$values);
                } else {
                    console.warn("Respuesta inesperada:", response);
                }
            })
            .catch(error => {
                console.error("Error cargando entrenadores:", error);
            });
    }

    // Crear entrenador
    const formularioCrear = document.getElementById("formularioCrear");
    if (formularioCrear) {
        formularioCrear.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                await agregarEntrenador();
                alert("✅ Entrenador agregado correctamente");
                formularioCrear.reset();
            } catch (error) {
                alert("❌ Error al registrar entrenador:\n" + error.message);
            }
        });
    }

    // Editar entrenador
    const formularioEditar = document.getElementById("formularioEditar");
    if (formularioEditar) {
        formularioEditar.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id = document.getElementById("idEditar").value;
            try {
                await editarEntrenador(id);
                alert("✅ Entrenador editado correctamente");
                bootstrap.Modal.getInstance(document.getElementById("modalEditarEntrenador")).hide();
                obtenerTodosLosEntrenadores().then(data => renderizarEntrenadores(data.$values));
            } catch (error) {
                alert("❌ Error al editar:\n" + error.message);
            }
        });

        const inputFiltro = document.getElementById("filtroEntrenador");
        if (inputFiltro) {
            inputFiltro.addEventListener("input", filtrarEntrenadores);
        }
    }

    // Eliminar entrenador
    const formularioEliminar = document.getElementById("formularioEliminar");
    if (formularioEliminar) {
        formularioEliminar.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id = document.getElementById("idEliminar").value;
            try {
                await eliminarEntrenador(id);
                alert("🗑️ Entrenador eliminado");
                bootstrap.Modal.getInstance(document.getElementById("modalEliminarEntrenador")).hide();
                obtenerTodosLosEntrenadores().then(data => renderizarEntrenadores(data.$values));
            } catch (error) {
                alert("❌ Error al eliminar:\n" + error.message);
            }
        });
    }
});


//  Renderiza la tabla de entrenadores
export function renderizarEntrenadores(lista) {
    const tbody = document.getElementById("entrenador-tbody");
    tbody.innerHTML = "";

    lista.forEach(entrenador => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
      <td>${entrenador.nombre}</td>
      <td>${entrenador.email}</td>
      <td>${entrenador.telefono}</td>
      <td>${entrenador.clave}</td>
      <td>${entrenador.formacionAcademica}</td>
      <td>${entrenador.rol}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="mostrarModalEditar(${entrenador.idIdUsuario}, 
        '${entrenador.nombre}', '${entrenador.email}', '${entrenador.telefono}', '${entrenador.clave}',
        '${entrenador.formacionAcademica}')"><i class="fas fa-pen-to-square"></i></button>
        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${entrenador.idIdUsuario})"><i class="fas fa-trash"></i></button>
      </td>
    `;
        tbody.appendChild(fila);
    });
}

//  Mostrar modal de edición con datos precargados
window.mostrarModalEditar = function (id, nombre, correo, telefono, clave, formacion) {
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("correoEditar").value = correo;
    document.getElementById("telefonoEditar").value = telefono;
    document.getElementById("claveEditar").value = clave;
    document.getElementById("formacionEditar").value = formacion;

    new bootstrap.Modal(document.getElementById("modalEditarEntrenador")).show();
}

//  Mostrar modal de confirmación para eliminar
window.mostrarModalEliminar = function (id) {
    document.getElementById("idEliminar").value = id;
    new bootstrap.Modal(document.getElementById("modalEliminarEntrenador")).show();
}

//  Formato para obtener datos desde formulario de creación
function getEntrenadorDesdeFormulario() {
    return {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("correo").value,
        clave: document.getElementById("clave").value,
        telefono: parseInt(document.getElementById("telefono").value),
        formacionAcademica: document.getElementById("formacion").value,
        rol: "Entrenador"
    };
}

// Crear nuevo entrenador
export async function agregarEntrenador() {
    const nuevo = getEntrenadorDesdeFormulario();

    const response = await fetch(`${URL_API}agregarEntrenador`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
    });

    if (!response.ok) throw new Error("Error al crear el entrenador");
    return response.json();
}

// Obtener todos los entrenadores
export async function obtenerTodosLosEntrenadores() {
    const response = await fetch(`${URL_API}listaEntrenador`);
    if (!response.ok) throw new Error("Error al obtener entrenadores");
    return response.json();
}

// Obtener entrenador por ID (opcional)
export async function obtenerEntrenadorPorId(id) {
    const response = await fetch(`${URL_API}obtenerEntrenadorPorId/${id}`);
    if (!response.ok) throw new Error("Entrenador no encontrado");
    return response.json();
}

// Editar entrenador (usa los campos del modal)
export async function editarEntrenador(id) {
    const entrenadorEditado = {
        idIdUsuario: id,
        nombre: document.getElementById("nombreEditar").value,
        email: document.getElementById("correoEditar").value,
        clave: document.getElementById("claveEditar").value,
        telefono: parseInt(document.getElementById("telefonoEditar").value),
        formacionAcademica: document.getElementById("formacionEditar").value,
        rol: "Entrenador"
    };

    const response = await fetch(`${URL_API}editarEntrenador/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrenadorEditado)
    });

    if (!response.ok) throw new Error("Error al editar el entrenador");
    return response;
}

// Eliminar entrenador
export async function eliminarEntrenador(id) {
    const response = await fetch(`${URL_API}eliminarEntrenador/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) throw new Error("Error al eliminar el entrenador");
    return response;
}

//Para buscar
function filtrarEntrenadores() {
    const filtro = document.getElementById("filtroEntrenador").value.toLowerCase();
    const filas = document.querySelectorAll("#entrenador-tbody tr");

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
}