using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.DTO;
using PowerVital.Models;

namespace PowerVital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsignarPadecimientosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsignarPadecimientosController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/padecimientocliente
        [HttpPost ("asignarPadecimiento")]
        public async Task<IActionResult> AsignarPadecimientos([FromBody] AsignarPadecimientos dto)
        {
            /* if (!ModelState.IsValid)
                 return BadRequest(ModelState);

             var clienteExiste = await _context.Clientes.AnyAsync(c => c.IdUsuario == dto.IdCliente);
             if (!clienteExiste)
                 return NotFound(new { mensaje = "Cliente no encontrado" });

             // Validar existencia de cada Padecimiento
             var padecimientosValidos = await _context.Padecimientos
                 .Where(p => dto.IdsPadecimientos.Contains(p.IdPadecimiento))
                 .Select(p => p.IdPadecimiento)
                 .ToListAsync();

             var padecimientosInvalidos = dto.IdsPadecimientos.Except(padecimientosValidos).ToList();
             if (padecimientosInvalidos.Any())
                 return BadRequest(new { mensaje = $"Los siguientes IDs de padecimientos no existen: {string.Join(", ", padecimientosInvalidos)}" });

             // Eliminar asignaciones anteriores
             var existentes = await _context.PadecimientoCliente
                 .Where(pc => pc.IdCliente == dto.IdCliente)
                 .ToListAsync();

             _context.PadecimientoCliente.RemoveRange(existentes);

             // Agregar nuevas asignaciones
             var nuevasAsignaciones = dto.IdsPadecimientos.Select(idP => new PadecimientoCliente
             {
                 IdCliente = dto.IdCliente,
                 IdPadecimiento = idP
             });

             await _context.PadecimientoCliente.AddRangeAsync(nuevasAsignaciones);
             await _context.SaveChangesAsync();

             return Ok(new { mensaje = "Padecimientos asignados correctamente" });*/


            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var clienteExiste = await _context.Clientes.AnyAsync(c => c.IdUsuario == dto.IdCliente);
                if (!clienteExiste)
                    return NotFound(new { mensaje = "Cliente no encontrado" });

                dto.IdsPadecimientos ??= new List<int>();

                // Validar existencia de IDs solo si hay elementos
                if (dto.IdsPadecimientos.Any())
                {
                    var padecimientosValidos = await _context.Padecimientos
                     .Where(p => dto.IdsPadecimientos.Contains(p.IdPadecimiento))
                     .Select(p => p.IdPadecimiento)
                     .ToListAsync();

                    var padecimientosInvalidos = dto.IdsPadecimientos.Except(padecimientosValidos).ToList();

                    if (padecimientosInvalidos.Any())
                    {
                        return BadRequest(new
                        {
                            mensaje = $"Los siguientes IDs de padecimientos no existen: {string.Join(", ", padecimientosInvalidos)}"
                        });
                    }

                }

                // Eliminar anteriores
                var existentes = await _context.PadecimientoCliente
                    .Where(pc => pc.IdCliente == dto.IdCliente)
                    .ToListAsync();
                _context.PadecimientoCliente.RemoveRange(existentes);

                // Agregar nuevos solo si hay
                if (dto.IdsPadecimientos.Any())
                {
                    var nuevasAsignaciones = dto.IdsPadecimientos.Select(idP => new PadecimientoCliente
                    {
                        IdCliente = dto.IdCliente,
                        IdPadecimiento = idP
                    });

                    await _context.PadecimientoCliente.AddRangeAsync(nuevasAsignaciones);
                }

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Padecimientos actualizados correctamente" });
            }
            catch (Exception ex)
            {
                // ⚠️ Aquí el error interno real
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }


        }

        // GET: api/padecimientocliente/5
        [HttpGet("obtenerPadecimiento/{idCliente}")]
        public async Task<ActionResult<List<int>>> ObtenerPadecimientosDeCliente(int idCliente)
        {
            var clienteExiste = await _context.Clientes.AnyAsync(c => c.IdUsuario == idCliente);
            if (!clienteExiste)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            var ids = await _context.PadecimientoCliente
                .Where(pc => pc.IdCliente == idCliente)
                .Select(pc => pc.IdPadecimiento)
                .ToListAsync();

            return Ok(ids);
        }

        // DELETE: api/padecimientocliente/5
        [HttpDelete("eliminarPadecimiento/{idCliente}")]
        public async Task<IActionResult> EliminarPadecimientosDeCliente(int idCliente)
        {
            var clienteExiste = await _context.Clientes.AnyAsync(c => c.IdUsuario == idCliente);
            if (!clienteExiste)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            var relaciones = await _context.PadecimientoCliente
                .Where(pc => pc.IdCliente == idCliente)
                .ToListAsync();

            if (!relaciones.Any())
                return NotFound(new { mensaje = "Este cliente no tiene padecimientos asignados" });

            _context.PadecimientoCliente.RemoveRange(relaciones);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Padecimientos eliminados correctamente para el cliente" });
        }
    }
}
