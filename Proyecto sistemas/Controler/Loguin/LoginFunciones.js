import { LoginModel } from "../../Model/LoginModel.js";

const URL_API = "https://localhost:7086/api/Login/Login";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSesion();
  });
});

function iniciarSesion() {
  const email = document.querySelector("#inputCorreo").value.trim();
  const clave = document.querySelector("#inputClave").value.trim();

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
         console.log("ROL:", usuario.rol, "| Tipo:", typeof usuario.rol);

        throw new Error("❌ Credenciales inválidas");
      }
      return response.json();
    })
   .then((data) => {
  const usuario = data.usuario;

  // Guardar datos base
  sessionStorage.setItem("usuario", JSON.stringify(usuario));
  sessionStorage.setItem("nombreEntrenador", usuario.Nombre);

  // ✅ Guardar ID del entrenador si aplica
  const rol = usuario.Rol ? usuario.Rol.trim().toLowerCase() : "";
  sessionStorage.setItem("rol", rol);

  if (rol === "entrenador") {
    sessionStorage.setItem("idEntrenador", usuario.IdRol);
  }

  console.log("🟢 Usuario guardado en sesión:", usuario);

  // Redirigir según rol
  switch (rol) {
    case "admin":
      window.location.href = "../../View/Administrador/Index.html";
      break;
    case "cliente":
      window.location.href = "../../View/Cliente/Index.html";
      break;
    case "entrenador":
      window.location.href = "../../View/Entrenador/Index.html";
      break;
    default:
      alert("⚠️ Rol no reconocido. Contacte al administrador.");
  }
})
}