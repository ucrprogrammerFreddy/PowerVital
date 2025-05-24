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
        [HttpGet("cliente/{idCliente}")]
        public async Task<ActionResult<IEnumerable<PadecimientoHistorialDTO>>> GetByClienteId(int idCliente)
        {
            try
            {
                // Busca todos los historiales asociados al IdCliente recibido
                var historiales = await _context.PadecimientosHistorial
                    .AsNoTracking()
                    .Where(x => x.IdCliente == idCliente)
                    .ToListAsync();

                // Si no existen historiales para ese cliente, retorna 404
                if (historiales == null || historiales.Count == 0)
                    return NotFound();

                // Mapea las entidades a DTOs para la respuesta
                var dtos = historiales.Select(ph => new PadecimientoHistorialDTO
                {
                    IdHistorial = ph.IdHistorial,
                    IdCliente = ph.IdCliente,
                    IdPadecimiento = ph.IdPadecimiento,
                    NombrePadecimiento = ph.NombrePadecimiento,
                    Fecha = ph.Fecha,
                    Peso = ph.Peso,
                    Severidad = ph.Severidad
                }).ToList();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                // Retorna error 500 si ocurre una excepción inesperada
                return StatusCode(500, new { message = "Error al obtener los historiales de padecimiento del usuario.", details = ex.Message });
            }
        }

        /// <summary>
        /// Crea un nuevo registro de historial de padecimiento para un cliente.
        /// </summary>
        /// <param name="dto">DTO con los datos del historial a guardar</param>
        /// <returns>DTO del historial creado</returns>
        [HttpPost]
        public async Task<ActionResult<PadecimientoHistorialDTO>> Create([FromBody] PadecimientoHistorialDTO dto)
        {
            try
            {
                // Valida las anotaciones de datos del modelo recibido
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Verifica si existe el cliente en la base de datos (usando IdUsuario)
                var existeCliente = await _context.Clientes.AnyAsync(c => c.IdUsuario == dto.IdCliente);
                if (!existeCliente)
                {
                    ModelState.AddModelError("IdCliente", "El cliente especificado no existe.");
                    return BadRequest(ModelState);
                }

                // Verifica si existe el padecimiento en la base de datos
                var existePadecimiento = await _context.Padecimientos.AnyAsync(p => p.IdPadecimiento == dto.IdPadecimiento);
                if (!existePadecimiento)
                {
                    ModelState.AddModelError("IdPadecimiento", "El padecimiento especificado no existe.");
                    return BadRequest(ModelState);
                }

                // Valida que la severidad sea válida
                var severidadesValidas = new[] { "Leve", "Moderado", "Grave" };
                if (!string.IsNullOrEmpty(dto.Severidad) && !severidadesValidas.Contains(dto.Severidad))
                {
                    ModelState.AddModelError("Severidad", "La severidad debe ser Leve, Moderado o Grave.");
                    return BadRequest(ModelState);
                }

                // Valida el rango de peso
                if (dto.Peso.HasValue && (dto.Peso < 0 || dto.Peso > 500))
                {
                    ModelState.AddModelError("Peso", "El peso debe estar entre 0 y 500 kg.");
                    return BadRequest(ModelState);
                }

                // Crea una nueva entidad a partir del DTO
                var entity = new PadecimientoHistorial
                {
                    IdCliente = dto.IdCliente,
                    IdPadecimiento = dto.IdPadecimiento,
                    NombrePadecimiento = dto.NombrePadecimiento,
                    Fecha = dto.Fecha,
                    Peso = dto.Peso,
                    Severidad = dto.Severidad
                };

                // Agrega la entidad al contexto y guarda los cambios
                _context.PadecimientosHistorial.Add(entity);
                await _context.SaveChangesAsync();

                // Prepara el DTO de respuesta con el Id generado
                var resultDto = new PadecimientoHistorialDTO
                {
                    IdHistorial = entity.IdHistorial,
                    IdCliente = entity.IdCliente,
                    IdPadecimiento = entity.IdPadecimiento,
                    NombrePadecimiento = entity.NombrePadecimiento,
                    Fecha = entity.Fecha,
                    Peso = entity.Peso,
                    Severidad = entity.Severidad
                };

                // Retorna 201 Created apuntando al endpoint de consulta por cliente
                return CreatedAtAction(nameof(GetByClienteId), new { idCliente = entity.IdCliente }, resultDto);
            }
            catch (DbUpdateException ex)
            {
                // Error específico de base de datos
                return StatusCode(500, new { message = "Error de base de datos al guardar el historial de padecimiento.", details = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                // Error inesperado
                return StatusCode(500, new { message = "Error inesperado al guardar el historial de padecimiento.", details = ex.Message });
            }
        }
    }
}