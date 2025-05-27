using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.DTO;
using PowerVital.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PowerVital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistorialSaludController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HistorialSaludController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/HistorialSalud/cliente/5
        [HttpGet("obtenerHisotorialPorClienteId/{idCliente}")]
        public async Task<ActionResult<IEnumerable<HistorialSaludDTO>>> GetByClienteId(int idCliente)
        {
            var historiales = await _context.HistorialesSalud
                .Where(h => h.ClienteId == idCliente)
                .ToListAsync();

            var dto = historiales.Select(h => new HistorialSaludDTO
            {
                IdHistorialSalud = h.IdHistorialSalud,
                ClienteId = h.ClienteId,
                Fecha = h.Fecha,
                Peso = h.Peso,
                IndiceMasaCorporal = h.IndiceMasaCorporal
            });

            return Ok(dto);
        }

        // POST: api/HistorialSalud
        [HttpPost("crearHistorialSalud")]
        public async Task<ActionResult<HistorialSaludDTO>> Create([FromBody] HistorialSaludDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var historial = new HistorialSalud
            {
                ClienteId = dto.ClienteId,
                Fecha = dto.Fecha,
                Peso = dto.Peso,
                IndiceMasaCorporal = dto.IndiceMasaCorporal
            };

            _context.HistorialesSalud.Add(historial);
            await _context.SaveChangesAsync();

            dto.IdHistorialSalud = historial.IdHistorialSalud;

            return CreatedAtAction(nameof(GetByClienteId), new { idCliente = dto.ClienteId }, dto);
        }
    }
}
