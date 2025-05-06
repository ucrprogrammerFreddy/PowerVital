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

        // =========================
        // GET: api/Entrenador
        // =========================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entrenador>>> GetEntrenadores()
        {
            return await _context.Entrenadores.ToListAsync();
        }

        // =========================
        // GET: api/Entrenador/5
        // =========================
        [HttpGet("{id}")]
        public async Task<ActionResult<Entrenador>> GetEntrenador(int id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(id);

            if (entrenador == null)
                return NotFound();

            return entrenador;
        }

        // =========================
        // POST: api/Entrenador
        // =========================
        [HttpPost]
        public async Task<ActionResult<Entrenador>> CreateEntrenador(Entrenador entrenador)
        {
            entrenador.Rol = "Entrenador"; // Discriminador para herencia TPH

            _context.Entrenadores.Add(entrenador);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntrenador), new { id = entrenador.IdUsuario }, entrenador);
        }

        // =========================
        // PUT: api/Entrenador/5
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntrenador(int id, Entrenador entrenador)
        {
            if (id != entrenador.IdUsuario)
                return BadRequest("El ID proporcionado no coincide.");

            entrenador.Rol = "Entrenador"; // Evita cambios de rol no autorizados
            _context.Entry(entrenador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntrenadorExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // =========================
        // DELETE: api/Entrenador/5
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntrenador(int id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(id);
            if (entrenador == null)
                return NotFound();

            _context.Entrenadores.Remove(entrenador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntrenadorExists(int id)
        {
            return _context.Entrenadores.Any(e => e.IdUsuario == id);
        }
    }
}
