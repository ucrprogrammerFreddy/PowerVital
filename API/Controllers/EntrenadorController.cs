using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Models;
using PowerVital.Data;

namespace API_BD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntrenadorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EntrenadorController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Obtener lista de entrenadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entrenador>>> ObtenerTodosLosEntrenadores()
        {
            return await _context.Entrenadores.ToListAsync();
        }

        // ✅ Obtener entrenador por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Entrenador>> ObtenerEntrenadorPorId(int id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(id);

            if (entrenador == null)
                return NotFound();

            return entrenador;
        }

        // ✅ Agregar nuevo entrenador
        [HttpPost]
        public async Task<ActionResult<Entrenador>> AgregarEntrenador(Entrenador entrenador)
        {
            entrenador.Rol = "Entrenador";

            _context.Entrenadores.Add(entrenador);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerEntrenadorPorId), new { id = entrenador.IdUsuario }, entrenador);
        }

        // ✅ Editar entrenador existente
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarEntrenador(int id, Entrenador entrenador)
        {
            if (id != entrenador.IdUsuario)
                return BadRequest("El ID proporcionado no coincide.");

            entrenador.Rol = "Entrenador";
            _context.Entry(entrenador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExisteEntrenador(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // ✅ Eliminar entrenador
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarEntrenador(int id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(id);
            if (entrenador == null)
                return NotFound();

            _context.Entrenadores.Remove(entrenador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Método auxiliar para verificar existencia
        private bool ExisteEntrenador(int id)
        {
            return _context.Entrenadores.Any(e => e.IdUsuario == id);
        }
    }

}
