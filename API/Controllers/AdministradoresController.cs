using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.Models;


namespace PowerVital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradoresController : ControllerBase
    {
        private readonly DbContextGym _context;

        public AdministradoresController(DbContextGym context)
        {
            _context = context;
        }

        // GET: api/Administradores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Administrador>>> GetAdministradores()
        {
            var administradores = await _context.Administradores.ToListAsync();
            return Ok(administradores);
        }

        // GET: api/Administradores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Administrador>> GetAdministrador(int id)
        {
            var administrador = await _context.Administradores.FindAsync(id);

            if (administrador == null)
            {
                return NotFound(new { message = "❌ Administrador no encontrado." });
            }

            return Ok(administrador);
        }

        // POST: api/Administradores
        [HttpPost]
        public async Task<ActionResult> CrearAdministrador([FromBody] Administrador administrador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Administradores.Add(administrador);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Administrador creado exitosamente." });
        }

        // PUT: api/Administradores/5
        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarAdministrador(int id, [FromBody] Administrador administrador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var administradorExistente = await _context.Administradores.FindAsync(id);
            if (administradorExistente == null)
            {
                return NotFound(new { message = "❌ Administrador no encontrado." });
            }

            administradorExistente.nombre = administrador.nombre;
            administradorExistente.correo = administrador.correo;
            administradorExistente.telefono = administrador.telefono;
            administradorExistente.clave = administrador.clave;
            administradorExistente.rol = administrador.rol;
            administradorExistente.titulacion = administrador.titulacion;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Administrador actualizado correctamente." });
        }

        // DELETE: api/Administradores/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarAdministrador(int id)
        {
            var administrador = await _context.Administradores.FindAsync(id);
            if (administrador == null)
            {
                return NotFound(new { message = "❌ Administrador no encontrado." });
            }

            _context.Administradores.Remove(administrador);
            await _context.SaveChangesAsync();

            return Ok(new { message = "🗑️ Administrador eliminado correctamente." });
        }
    }
}