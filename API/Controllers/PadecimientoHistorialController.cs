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
    public class PadecimientoHistorialController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PadecimientoHistorialController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene todos los historiales de padecimiento de un cliente por su IdCliente.
        /// </summary>
        /// <param name="idCliente">Identificador del cliente (usuario).</param>
        /// <returns>Lista de historiales de padecimientos asociados al cliente.</returns>

        [HttpGet("historialPadecimientoPorId/{idCliente}")]
        public async Task<ActionResult<IEnumerable<PadecimientoHistorialDTO>>> GetByClienteId(int idCliente)
        {
            try
            {
                var historiales = await _context.PadecimientosHistorial
                    .Include(ph => ph.HistorialSalud)
                    .Include(ph => ph.Padecimiento)
                    .Where(ph => ph.HistorialSalud.ClienteId == idCliente)
                    .ToListAsync();

                if (historiales == null || historiales.Count == 0)
                    return NotFound();

                var dtos = historiales.Select(ph => new PadecimientoHistorialDTO
                {
                    IdHistorial = ph.Id,
                    IdCliente = ph.HistorialSalud.ClienteId,
                    IdPadecimiento = ph.PadecimientoId,
                    NombrePadecimiento = ph.Padecimiento.Nombre,
                    Fecha = ph.HistorialSalud.Fecha,
                    Peso = ph.HistorialSalud.Peso,
                    Severidad = ph.Severidad
                }).ToList();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los historiales de padecimiento del usuario.", details = ex.Message });
            }
        }





        /// <summary>
        /// Crea un nuevo registro de historial de padecimiento para un cliente.
        /// </summary>
        /// <param name="dto">DTO con los datos del historial a guardar</param>
        /// <returns>DTO del historial creado</returns>

        [HttpPost("crearHistorialPadecimiento")]
        public async Task<ActionResult<PadecimientoHistorialDTO>> Create([FromBody] PadecimientoHistorialDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existeCliente = await _context.Clientes.AnyAsync(c => c.IdUsuario == dto.IdCliente);
                if (!existeCliente)
                    return BadRequest(new { message = "El cliente especificado no existe." });

                var existePadecimiento = await _context.Padecimientos.AnyAsync(p => p.IdPadecimiento == dto.IdPadecimiento);
                if (!existePadecimiento)
                    return BadRequest(new { message = "El padecimiento especificado no existe." });

                var severidadesValidas = new[] { "Leve", "Moderado", "Grave" };
                if (!severidadesValidas.Contains(dto.Severidad))
                    return BadRequest(new { message = "La severidad debe ser Leve, Moderado o Grave." });

                // 1. Crear el historial de salud (si aplica)
                var historialSalud = new HistorialSalud
                {
                    ClienteId = dto.IdCliente,
                    Fecha = dto.Fecha,
                    Peso = dto.Peso ?? 0,
                    IndiceMasaCorporal = 0 // ajustar según necesidad
                };

                _context.HistorialesSalud.Add(historialSalud);
                await _context.SaveChangesAsync();

                // 2. Crear el historial de padecimiento
                var entity = new PadecimientoHistorial
                {
                    HistorialSaludId = historialSalud.IdHistorialSalud,
                    PadecimientoId = dto.IdPadecimiento,
                    Severidad = dto.Severidad
                };

                _context.PadecimientosHistorial.Add(entity);
                await _context.SaveChangesAsync();

                var resultDto = new PadecimientoHistorialDTO
                {
                    IdHistorial = entity.Id,
                    IdCliente = dto.IdCliente,
                    IdPadecimiento = dto.IdPadecimiento,
                    NombrePadecimiento = (await _context.Padecimientos.FindAsync(dto.IdPadecimiento)).Nombre,
                    Fecha = historialSalud.Fecha,
                    Peso = historialSalud.Peso,
                    Severidad = dto.Severidad
                };

                return CreatedAtAction(nameof(GetByClienteId), new { idCliente = dto.IdCliente }, resultDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error inesperado al guardar el historial de padecimiento.", details = ex.Message });
            }
        }






    }
}