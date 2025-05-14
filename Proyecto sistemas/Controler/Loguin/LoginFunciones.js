import { LoginModel } from "../../Model/LoginModel.js";

const URL_API = "https://localhost:7086/api/Login/Login";

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
      const usuario = data.usuario;
      const rol = usuario.rol;
    
      // ✅ Guardar sesión del usuario
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      console.log("Usuario guardado en sesión:", usuario);

      // Redirección según rol
      switch (rol) {
        
    case "Admin":
        window.location.href = "../../View/Administrador/Index.html";
        break;
      case "Cliente":
        window.location.href = "../../View/Cliente/Index.html";
        break;
      case "Entrenador":
        window.location.href = "../../View/Entrenador/Index.html";
        break;
      default:
        alert("⚠️ Rol no reconocido. Contacte al administrador.");


      }
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    });
}
