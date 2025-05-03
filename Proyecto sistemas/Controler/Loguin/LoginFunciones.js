import { LoginModel } from '/PowerVital/Proyecto sistemas/Model/LoginModel.js';

const URL_API = 'https://localhost:7086/api/Login/Login'; // Cambia si es producción

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    iniciarSesion();
  });
});

function iniciarSesion() {
  const email = document.querySelector('input[type="email"]').value;
  const clave = document.querySelector('input[type="password"]').value;

  const loginModel = new LoginModel(email, clave);

  fetch(URL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginModel)
  })
    .then(response => {
      if (!response.ok) throw new Error('❌ Credenciales inválidas');
      return response.json();
    })
    .then(data => {
      const rol = data.usuario.rol;
      if (rol === "Administrador") {
        window.location.href = "/PowerVital/Proyecto sistemas/Administrador/Index.html";
      } else {
        alert('⚠️ No tiene permiso para ingresar como Administrador');
      }
    })
    .catch(error => {
      alert(error.message);
    });
}
