using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.Models;
using PowerVital.DTO;

using PowerVital.Models;
using System.Threading.Tasks;

namespace PowerVital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DbContextGym _context;

        public LoginController(DbContextGym context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            Console.WriteLine($"📤 Solicitud de login recibida con Email: {loginRequest.Email}");

            if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Clave))
            {
                Console.WriteLine("⚠️ Faltan datos.");
                return BadRequest(new { message = "⚠️ Email y clave son obligatorios." });
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.correo == loginRequest.Email);

            if (usuario == null)
            {
                Console.WriteLine("❌ Usuario no encontrado.");
                return Unauthorized(new { message = "❌ Usuario o clave incorrectos." });
            }

            if (usuario.clave != loginRequest.Clave)
            {
                Console.WriteLine("❌ Clave incorrecta.");
                return Unauthorized(new { message = "❌ Usuario o clave incorrectos." });
            }

            Console.WriteLine($"✅ Usuario autenticado: {usuario.correo} con Rol: {usuario.rol}");

            return new JsonResult(new
            {
                message = "✅ Login exitoso.",
                redirectUrl = usuario.rol switch
                {
                    "Administrador" => "/Administrador/Index",
                    "Cliente" => "/Clientes/index",
                    "Entrenador" => "/Entrenadores/index",
                    _ => "/Usuario/Login"
                },
                usuario = new
                {
                    usuario.id,
                    usuario.nombre,
                    usuario.correo,
                    usuario.rol,
                    usuario.telefono
                }
            })
            {
                StatusCode = 200,
                ContentType = "application/json"
            };
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            // Aquí puedes limpiar la sesión si es necesario
            return Ok(new { message = "✅ Logout exitoso." });
        }
    }

   
}

