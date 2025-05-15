
import { AdministradorModel } from "../../Model/AdministradorModel.js";

const URL_API = "https://localhost:7086/api/Administradores";
const ruta = window.location.pathname;

if (ruta.includes("Empleados.html")) {
  $(document).ready(function () {
    obtenerAdministradores();

    $(".btn-agregar").click(function () {
      localStorage.removeItem("adminEditar");
      window.location.href = "RegistroAdministrador.html";
    });
  });
}

if (ruta.includes("RegistroAdministrador.html")) {
  $(document).ready(function () {
    const adminEditar = JSON.parse(localStorage.getItem("adminEditar"));
    if (adminEditar) {
      $("#idadmin").val(adminEditar.id);
      $("#nombre").val(adminEditar.nombre);
      $("#email").val(adminEditar.email);
      $("#clave").val(adminEditar.clave);
      $("#rol").val(adminEditar.rol);
      $("#formacionAcademica").val(adminEditar.formacionAcademica);
    } else {
      // asigna por defecto rol como 'Administrador'
      $("#rol").val("Administrador");
    }

    $("#formAdministrador").submit(function (e) {
      e.preventDefault();
      const id = $("#idadmin").val();
      id ? actualizarAdministrador() : crearAdministrador();
    });

    $("#btnVolver").click(function () {
      localStorage.removeItem("adminEditar");
      window.location.href = "Empleados.html";
    });
  });
}

function obtenerAdministradores() {
  $.ajax({
    type: "GET",
    url: URL_API,
    dataType: "json",
    success: function (data) {
      cargarTabla(data);
    },
    error: function () {
      alert("❌ Error al obtener administradores");
    }
  });
}

function cargarTabla(lista) {
  const $tabla = $(".table-group-divider");
  $tabla.empty();

  lista.forEach((a) => {
    const fila = `
      <tr class="table-primary">
        <td>${a.nombre || "-"}</td>
        <td>${a.email || "-"}</td>
        <td>${a.clave || "-"}</td>
        <td>${a.rol || "Administrador"}</td>
        <td>${a.formacionAcademica || "-"}</td>
        <td>
          <button class="btn btn-warning btn-sm" title="Modificar"
            onclick='editarAdministrador(${JSON.stringify(a).replace(/"/g, "&quot;")})'>
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-danger btn-sm" title="Eliminar"
            onclick="eliminarAdministrador(${a.id})">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>`;
    $tabla.append(fila);
  });
}

function crearAdministrador() {
  const nuevo = construirDesdeFormulario();
  console.log("📤 Enviando:", nuevo);

  $.ajax({
    type: "POST",
    url: URL_API,
    data: JSON.stringify(nuevo),
    contentType: "application/json",
    success: function () {
      alert("✅ Administrador registrado");
      localStorage.removeItem("adminEditar");
      window.location.href = "Empleados.html";
    },
    error: function (xhr) {
      alert("❌ Error al registrar: " + xhr.responseText);
    }
  });
}

function actualizarAdministrador() {
  const admin = construirDesdeFormulario();
  admin.id = $("#idadmin").val();

  $.ajax({
    type: "PUT",
    url: `${URL_API}/${admin.id}`,
    data: JSON.stringify(admin),
    contentType: "application/json",
    success: function () {
      alert("✅ Administrador actualizado");
      localStorage.removeItem("adminEditar");
      window.location.href = "Empleados.html";
    },
    error: function (xhr) {
      alert("❌ Error al actualizar: " + xhr.responseText);
    }
  });
}

window.eliminarAdministrador = function (id) {
  if (!confirm("¿Deseas eliminar este administrador?")) return;

  $.ajax({
    type: "DELETE",
    url: `${URL_API}/${id}`,
    success: function () {
      alert("🗑️ Administrador eliminado");
      obtenerAdministradores();
    },
    error: function (xhr) {
      alert("❌ Error al eliminar: " + xhr.responseText);
    }
  });
};

window.editarAdministrador = function (admin) {
  localStorage.setItem("adminEditar", JSON.stringify(admin));
  window.location.href = "RegistroAdministrador.html";
};


//REVISAR

// function construirDesdeFormulario() {
//   return new AdministradorModel(
//     null,
//     $("#nombre").val(),
//     $("#email").val(),
//     $("#clave").val(),
//     "Administrador",
//     $("#formacionAcademica").val()
//   );
// }

function construirDesdeFormulario() {
  const id = $("#idadmin").val(); // ✔️ ahora sí tomamos el ID

  return new AdministradorModel(
    id ? parseInt(id) : null, // 👈 solo es null si no existe
    $("#nombre").val(),
    $("#email").val(),
    $("#clave").val(),

    "Administrador",
    $("#formacionAcademica").val()
  );
}





// import { AdministradorModel } from "../../Model/AdministradorModel.js";

// const URL_API = "https://localhost:7086/api/Administradores";

// // Detecta la página actual
// const ruta = window.location.pathname;

// // ============================
// // Página: Lista de Empleados
// // ============================
// if (ruta.includes("Empleados.html")) {
//   $(document).ready(function () {
//     obtenerAdministradores();

//     $(".btn-agregar").click(function () {
//       localStorage.removeItem("adminEditar");
//       window.location.href = "RegistroAdministrador.html";
//     });
//   });
// }

// // ============================
// // Página: Registro Administrador
// // ============================
// if (ruta.includes("RegistroAdministrador.html")) {
//   $(document).ready(function () {
//     const adminEditar = JSON.parse(localStorage.getItem("adminEditar"));
//     if (adminEditar) {
//       $("#idadmin").val(adminEditar.id);
//       $("#nombre").val(adminEditar.nombre);
//       $("#email").val(adminEditar.correo);
//       $("#clave").val(adminEditar.clave);
//       $("#telefono").val(adminEditar.telefono);
//       $("#titulacion").val(adminEditar.titulacion);
//     }

//     $("form").submit(function (e) {
//       e.preventDefault();
//       const id = $("#idadmin").val();
//       id ? actualizarAdministrador() : crearAdministrador();
//     });

//     $(".btn-secondary").click(function () {
//       localStorage.removeItem("adminEditar");
//       window.location.href = "Empleados.html";
//     });
//   });
// }

// // ============================
// // Obtener administradores
// // ============================
// function obtenerAdministradores() {
//   $.ajax({
//     type: "GET",
//     url: URL_API,
//     dataType: "json",
//     success: function (data) {
//       cargarTabla(data);
//     },
//     error: function () {
//       alert("❌ Error al obtener administradores");
//     }
//   });
// }

// function cargarTabla(lista) {
//   const $tabla = $(".table-group-divider");
//   $tabla.empty();

//   lista.forEach((a) => {
//     const fila = `
//       <tr class="table-primary">
//         <td>${a.nombre}</td>
//         <td>${a.correo}</td>
//         <td>${a.telefono}</td>
//         <td>${a.clave}</td>
//         <td>${a.titulacion}</td>
//         <td>${Array.isArray(a.rol) ? a.rol.join(", ") : (a.rol || "Admin")}</td>

//         <td>
//           <button class="btn btn-warning btn-sm" title="Modificar" onclick='editarAdministrador(${JSON.stringify(
//             a
//           ).replace(/'/g, "&apos;")})'>
//             <i class="bi bi-pencil-fill"></i>
//           </button>
//           <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarAdministrador(${a.id})">
//             <i class="bi bi-trash-fill"></i>
//           </button>
//         </td>
//       </tr>
//     `;
//     $tabla.append(fila);
//   });
// }

// // ============================
// // Crear
// // ============================
// function crearAdministrador() {
//   const nuevo = construirDesdeFormulario();

//   $.ajax({
//     type: "POST",
//     url: URL_API,
//     data: JSON.stringify(nuevo),
//     contentType: "application/json",
//     success: function () {
//       alert("✅ Administrador registrado");
//       localStorage.removeItem("adminEditar");
//       window.location.href = "Empleados.html";
//     },
//     error: function (xhr) {
//       alert("❌ Error al registrar: " + xhr.responseText);
//     }
//   });
// }

// // ============================
// // Editar
// // ============================
// window.editarAdministrador = function (admin) {
//   localStorage.setItem("adminEditar", JSON.stringify(admin));
//   window.location.href = "RegistroAdministrador.html";
// };

// // ============================
// // Actualizar
// // ============================
// function actualizarAdministrador() {
//   const admin = construirDesdeFormulario();
//   admin.id = $("#idadmin").val();

//   $.ajax({
//     type: "PUT",
//     url: `${URL_API}/${admin.id}`,
//     data: JSON.stringify(admin),
//     contentType: "application/json",
//     success: function () {
//       alert("✅ Administrador actualizado");
//       localStorage.removeItem("adminEditar");
//       window.location.href = "Empleados.html";
//     },
//     error: function (xhr) {
//       alert("❌ Error al actualizar: " + xhr.responseText);
//     }
//   });
// }

// // ============================
// // Eliminar
// // ============================
// window.eliminarAdministrador = function (id) {
//   if (!confirm("¿Deseas eliminar este administrador?")) return;

//   $.ajax({
//     type: "DELETE",
//     url: `${URL_API}/${id}`,
//     success: function () {
//       alert("🗑️ Administrador eliminado");
//       obtenerAdministradores();
//     },
//     error: function (xhr) {
//       alert("❌ Error al eliminar: " + xhr.responseText);
//     }
//   });
// }

// // ============================
// // Helpers
// // ============================
// function construirDesdeFormulario() {
//   return new AdministradorModel(
//     null,
//     $("#nombre").val(),
//     $("#email").val(),
//     $("#clave").val(),
//     $("#telefono").val(),
//     $("#titulacion").val()
//   );
// }
