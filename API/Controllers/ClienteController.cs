using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PowerVital.Data;
using PowerVital.DTO;
using PowerVital.Models;

namespace PowerVital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/cliente
        [HttpGet("listaClientes")]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Include(c => c.Entrenador)
                .Include(c => c.PadecimientosClientes)
                             .ThenInclude(pc => pc.Padecimiento)
                .ToListAsync();

            return Ok(clientes);
        }
        

        // ✅ GET: api/cliente/5
        [HttpGet("obtenerClientePorId/{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes
                .Include(c => c.Entrenador)
                .FirstOrDefaultAsync(c => c.IdUsuario == id);

            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            return Ok(cliente);
        }

        // ✅ POST: api/cliente
        [HttpPost("CrearCliente")]
        public async Task<ActionResult> CrearCliente([FromBody] EditarClienteDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(dto.Nombre) || string.IsNullOrWhiteSpace(dto.Clave) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { mensaje = "Nombre, Clave y Email son obligatorios" });

            if (dto.FechaNacimiento > DateTime.Now)
                return BadRequest(new { mensaje = "La fecha de nacimiento no puede ser en el futuro" });

            if (dto.Altura <= 0 || dto.Peso <= 0)
                return BadRequest(new { mensaje = "Altura y peso deben ser mayores que cero" });

            var entrenador = await _context.Entrenadores.FirstOrDefaultAsync(e => e.IdUsuario == dto.EntrenadorId);
            if (entrenador == null)
                return BadRequest(new { mensaje = "El entrenador especificado no existe" });

            var nuevoCliente = new Cliente
            {
                Nombre = dto.Nombre,
                Clave = dto.Clave,
                Email = dto.Email,
                FechaNacimiento = dto.FechaNacimiento,
                Telefono = dto.Telefono,
                Genero = dto.Genero,
                Altura = dto.Altura,
                Peso = dto.Peso,
                EstadoPago = dto.EstadoPago,
                EntrenadorId = dto.EntrenadorId,
                Rol = "Cliente"
            };

            _context.Clientes.Add(nuevoCliente);
            await _context.SaveChangesAsync();

            // ✅ Retornar solo el ID para que JavaScript lo capture fácilmente
            return Ok(new { IdUsuario = nuevoCliente.IdUsuario });
        }


        // ✅ PUT: api/cliente/editar
        [HttpPut("editarCliente")]
        public async Task<IActionResult> EditarCliente([FromBody] EditarClienteDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.IdUsuario == dto.IdUsuario);
            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            var entrenadorExiste = await _context.Entrenadores.AnyAsync(e => e.IdUsuario == dto.EntrenadorId);
            if (!entrenadorExiste)
                return BadRequest(new { mensaje = "El entrenador especificado no existe" });

            if (dto.Altura <= 0 || dto.Peso <= 0)
                return BadRequest(new { mensaje = "Altura y peso deben ser mayores que cero" });

            if (dto.FechaNacimiento > DateTime.Now)
                return BadRequest(new { mensaje = "La fecha de nacimiento no puede ser en el futuro" });

            cliente.Nombre = dto.Nombre;
            cliente.Clave = dto.Clave;
            cliente.Email = dto.Email;
            cliente.FechaNacimiento = dto.FechaNacimiento;
            cliente.Telefono = dto.Telefono;
            cliente.Genero = dto.Genero;
            cliente.Altura = dto.Altura;
            cliente.Peso = dto.Peso;
            cliente.EstadoPago = dto.EstadoPago;
            cliente.EntrenadorId = dto.EntrenadorId;

            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente actualizado correctamente" });
        }

        // ✅ DELETE: api/cliente/5
        [HttpDelete("eliminarCliente/{id}")]
        public async Task<IActionResult> EliminarCliente(int id)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.IdUsuario == id);
            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            // ⚠️ Asegúrate de manejar relaciones con rutinas o padecimientos si aplican
            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente eliminado correctamente" });
        }
    }
}
