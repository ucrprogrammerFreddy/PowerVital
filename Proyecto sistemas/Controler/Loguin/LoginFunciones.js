import { LoginModel } from "./Model/LoginModel.js"; // Ruta corregida

const URL_API = "https://localhost:7086/api/login"; // Asegúrate de que esta URL es correcta

// Cambia si es producción
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSesion();
  });
});

function iniciarSesion() {
  const email = document.querySelector("#inputCorreo").value;
  const clave = document.querySelector("#inputClave").value;

  const loginModel = new LoginModel(email, clave);

  // Llamada a la API para autenticar al usuario
  fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginModel),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("❌ Credenciales inválidas");
      }
      return response.json();
    })
    .then((data) => {
      // Imprime el resultado del login en consola
      console.log("Respuesta de la API:", data); // Imprime la respuesta completa

      // Verifica si el usuario tiene rol de Administrador
      const rol = data.usuario.rol;
      console.log("Rol del usuario:", rol); // Imprime el rol del usuario

      if (rol === "Administrador") {
        console.log("Redirigiendo a la página de Administrador..."); // Depuración: Verifica la redirección
        // Puedes comentar la siguiente línea mientras estás depurando
        window.location.href =
          "/Proyecto_Sistemas/View/Administrador/index.html"; // Redirige a la página del Administrador
      } else {
        console.log("El usuario no tiene permisos de administrador.");
        alert("⚠️ No tiene permiso para ingresar como Administrador");
      }
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error); // Imprime el error completo
      alert("Error al iniciar sesión: " + error.message); // Mensaje más claro de error
    });
}
