using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.Models;
using PowerVital.DTO;
using System;
using System.Threading.Tasks;

namespace PowerVital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                Console.WriteLine($"📤 LoginRequest recibido: {loginRequest.Email}");

                if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Clave))
                {
                    return BadRequest(new { message = "⚠️ Email y clave son obligatorios." });
                }

                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequest.Email.ToLower());

                if (usuario == null)
                {
                    Console.WriteLine("❌ Usuario no encontrado en la base de datos.");
                    return Unauthorized(new { message = "❌ Usuario o clave incorrectos." });
                }

                Console.WriteLine($"🔍 Usuario encontrado: {usuario.Email}, clave en BD: {usuario.Clave}");

                if (usuario.Clave != loginRequest.Clave)
                {
                    Console.WriteLine($"❌ Clave incorrecta. Esperada: {usuario.Clave}, Recibida: {loginRequest.Clave}");
                    return Unauthorized(new { message = "❌ Usuario o clave incorrectos." });
                }

                Console.WriteLine($"✅ Usuario autenticado: {usuario.Email} con Rol: {usuario.Rol}");

                return Ok(new
                {
                    message = "✅ Login exitoso.",
                    redirectUrl = usuario.Rol switch
                    {
                        "Admin" => "/Administrador/Index",
                        "Cliente" => "/Clientes/index",
                        "Entrenador" => "/Entrenadores/index",
                        _ => "/Usuario/Login"
                    },
                    usuario = new
                    {
                        usuario.IdUsuario,
                        usuario.Nombre,
                        usuario.Email,
                        usuario.Rol
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ EXCEPCIÓN DETECTADA: {ex.Message}");
                return StatusCode(500, new { message = "❌ Error interno del servidor", error = ex.Message });
            }
        }


        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "✅ Logout exitoso." });
        }
    }
}
