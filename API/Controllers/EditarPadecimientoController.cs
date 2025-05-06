using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.DTO;
using PowerVital.Models;

namespace PowerVital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditarPadecimientoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EditarPadecimientoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/padecimientos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EditarPadecimientoDto>>> GetPadecimientos()
        {
            var padecimientos = await _context.Padecimientos
                .Select(p => new EditarPadecimientoDto
                {
                    IdPadecimiento = p.IdPadecimiento,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    AreaMuscularAfectada = p.AreaMuscularAfectada,
                    Severidad = p.Severidad
                })
                .ToListAsync();

            return Ok(padecimientos);
        }

        // GET: api/padecimientos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EditarPadecimientoDto>> GetPadecimiento(int id)
        {
            var padecimiento = await _context.Padecimientos.FindAsync(id);

            if (padecimiento == null)
                return NotFound(new { mensaje = "Padecimiento no encontrado" });

            var dto = new EditarPadecimientoDto
            {
                IdPadecimiento = padecimiento.IdPadecimiento,
                Nombre = padecimiento.Nombre,
                Descripcion = padecimiento.Descripcion,
                AreaMuscularAfectada = padecimiento.AreaMuscularAfectada,
                Severidad = padecimiento.Severidad
            };

            return Ok(dto);
        }

        // POST: api/padecimientos
        [HttpPost]
        public async Task<ActionResult> CrearPadecimiento([FromBody] EditarPadecimientoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nuevoPadecimiento = new Padecimiento
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                AreaMuscularAfectada = dto.AreaMuscularAfectada,
                Severidad = dto.Severidad
            };

            _context.Padecimientos.Add(nuevoPadecimiento);
            await _context.SaveChangesAsync();

            dto.IdPadecimiento = nuevoPadecimiento.IdPadecimiento;

            return CreatedAtAction(nameof(GetPadecimiento), new { id = nuevoPadecimiento.IdPadecimiento }, dto);
        }

        // PUT: api/padecimientos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarPadecimiento(int id, [FromBody] EditarPadecimientoDto dto)
        {
            if (id != dto.IdPadecimiento)
                return BadRequest(new { mensaje = "El ID proporcionado no coincide con el del DTO" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var padecimiento = await _context.Padecimientos.FindAsync(id);
            if (padecimiento == null)
                return NotFound(new { mensaje = "Padecimiento no encontrado" });

            padecimiento.Nombre = dto.Nombre;
            padecimiento.Descripcion = dto.Descripcion;
            padecimiento.AreaMuscularAfectada = dto.AreaMuscularAfectada;
            padecimiento.Severidad = dto.Severidad;

            _context.Entry(padecimiento).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/padecimientos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPadecimiento(int id)
        {
            var padecimiento = await _context.Padecimientos.FindAsync(id);
            if (padecimiento == null)
                return NotFound(new { mensaje = "Padecimiento no encontrado" });

            _context.Padecimientos.Remove(padecimiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

