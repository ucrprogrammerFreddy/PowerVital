﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.DTO;
using PowerVital.Models;

namespace PowerVital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RutinaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RutinaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Rutina
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RutinaDTO>>> GetRutinas()
        {
            return await _context.Rutinas
                .Select(r => new RutinaDTO
                {
                    IdRutina = r.IdRutina,
                    FechaInicio = r.FechaInicio,
                    FechaFin = r.FechaFin,
                    IdCliente = r.IdCliente
                }).ToListAsync();
        }

        // GET: api/Rutina/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RutinaDTO>> GetRutina(int id)
        {
            var rutina = await _context.Rutinas.FindAsync(id);

            if (rutina == null)
            {
                return NotFound();
            }

            return new RutinaDTO
            {
                IdRutina = rutina.IdRutina,
                FechaInicio = rutina.FechaInicio,
                FechaFin = rutina.FechaFin,
                IdCliente = rutina.IdCliente
            };
        }

        // POST: api/Rutina
        [HttpPost]
        public async Task<ActionResult<Rutina>> PostRutina(RutinaCreateDto dto)
        {
            var rutina = new Rutina
            {
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                IdCliente = dto.IdCliente
            };

            _context.Rutinas.Add(rutina);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRutina), new { id = rutina.IdRutina }, rutina);
        }

        // PUT: api/Rutina/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRutina(int id, RutinaCreateDto dto)
        {
            var rutina = await _context.Rutinas.FindAsync(id);
            if (rutina == null)
            {
                return NotFound();
            }

            rutina.FechaInicio = dto.FechaInicio;
            rutina.FechaFin = dto.FechaFin;
            rutina.IdCliente = dto.IdCliente;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Rutina/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRutina(int id)
        {
            var rutina = await _context.Rutinas.FindAsync(id);
            if (rutina == null)
            {
                return NotFound();
            }

            _context.Rutinas.Remove(rutina);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
