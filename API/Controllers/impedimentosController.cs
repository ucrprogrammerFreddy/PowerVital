using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.Models;
using PowerVital.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PowerVital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImpedimentosController : ControllerBase
    {
        private readonly DbContextGym _context;

        public ImpedimentosController(DbContextGym context)
        {
            _context = context;
        }

        // GET: api/Impedimentos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<impedimentos>>> GetImpedimentos()
        {
            var lista = await _context.Impedimentos
                .Select(i => new impedimentos
                {
                    idImpedimento = i.idImpedimento,
                    nombre = i.nombre,
                    areasAfectaadas = i.areasAfectaadas?.Split(',').ToList(),
                    severidad = i.severidad
                })
                .ToListAsync();

            return Ok(lista);
        }

        // POST: api/Impedimentos
        [HttpPost]
        public async Task<ActionResult> Crear([FromBody] impedimentos dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.nombre))
                return BadRequest(new { message = "❌ El nombre es obligatorio." });

            var entidad = new Impedimento
            {
                nombre = dto.nombre,
                areasAfectaadas = string.Join(",", dto.areasAfectaadas),
                severidad = dto.severidad
            };

            _context.Impedimentos.Add(entidad);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Impedimento creado exitosamente." });
        }

        // PUT: api/Impedimentos/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Actualizar(int id, [FromBody] impedimentos dto)
        {
            var impedimento = await _context.Impedimentos.FindAsync(id);
            if (impedimento == null)
                return NotFound(new { message = "❌ Impedimento no encontrado." });

            impedimento.nombre = dto.nombre;
            impedimento.areasAfectaadas = string.Join(",", dto.areasAfectaadas);
            impedimento.severidad = dto.severidad;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Actualizado correctamente." });
        }

        // DELETE: api/Impedimentos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            var impedimento = await _context.Impedimentos.FindAsync(id);
            if (impedimento == null)
                return NotFound(new { message = "❌ No se encontró el impedimento." });

            _context.Impedimentos.Remove(impedimento);
            await _context.SaveChangesAsync();

            return Ok(new { message = "🗑️ Eliminado correctamente." });
        }
    }
}
