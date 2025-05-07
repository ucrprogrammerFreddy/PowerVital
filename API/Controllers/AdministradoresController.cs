using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.Models;
using PowerVital.DTO;

namespace PowerVital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdministradoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Administradores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdministradorDto>>> GetAdministradores()
        {
            var administradores = await _context.Administradores
                .Select(a => new AdministradorDto
                {
                    idIdUsuario = a.IdUsuario,
                    Nombre = a.Nombre,
                    Email = a.Email,
                    
                    Clave = a.Clave,
                    Rol = a.Rol
                })
                .ToListAsync();

            return Ok(administradores);
        }

        // GET: api/Administradores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdministradorDto>> GetAdministrador(int id)
        {
            var administrador = await _context.Administradores.FindAsync(id);

            if (administrador == null)
            {
                return NotFound(new { message = "❌ Administrador no encontrado." });
            }

            var dto = new AdministradorDto
            {
                idIdUsuario = administrador.IdUsuario,
                Nombre = administrador.Nombre,
                Email = administrador.Email,
                
                Clave = administrador.Clave,
                Rol = administrador.Rol
            };

            return Ok(dto);
        }

        // POST: api/Administradores
        [HttpPost]
        public async Task<ActionResult> CrearAdministrador([FromBody] AdministradorDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var administrador = new Administrador
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
              
                Clave = dto.Email,
               Rol = dto.Rol
            };

            _context.Administradores.Add(administrador);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Administrador creado exitosamente.", id = administrador.IdUsuario });
        }

        // PUT: api/Administradores/5
        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarAdministrador(int id, [FromBody] AdministradorDto dto)
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

            administradorExistente.Nombre = dto.Nombre;
            administradorExistente.Email = dto.Email;
           
            administradorExistente.Clave = dto.Clave;
            administradorExistente.Rol = dto.Rol;

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
