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
        // ✅ GET: api/cliente
        [HttpGet("listaClientes")]
        public async Task<ActionResult<IEnumerable<EditarClienteDto>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Include(c => c.Entrenador)
                .Include(c => c.PadecimientosClientes)
                             .ThenInclude(pc => pc.Padecimiento)
                .ToListAsync();

            // Mapear a DTO
            var clientesDto = clientes.Select(c => new EditarClienteDto
            {
                IdUsuario = c.IdUsuario,
                Nombre = c.Nombre,
                Clave = c.Clave,
                Email = c.Email,
                Telefono = c.Telefono,
                FechaNacimiento = c.FechaNacimiento,
                Genero = c.Genero,
                Altura = c.Altura,
                Peso = c.Peso,
                EstadoPago = c.EstadoPago,
                EntrenadorId = c.EntrenadorId
            }).ToList();

            return Ok(clientesDto);
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

            // *** VALIDA QUE EL EMAIL NO ESTÉ YA REGISTRADO ***
            var emailExiste = await _context.Clientes.AnyAsync(c => c.Email == dto.Email);
            if (emailExiste)
                return Conflict(new { mensaje = "El correo electrónico ya está registrado." });

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

            // *** VALIDA QUE EL EMAIL NO ESTÉ YA REGISTRADO POR OTRO CLIENTE ***
            var emailExiste = await _context.Clientes.AnyAsync(c => c.Email == dto.Email && c.IdUsuario != dto.IdUsuario);
            if (emailExiste)
                return Conflict(new { mensaje = "El correo electrónico ya está registrado por otro usuario." });

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


        //Este metodo se encarga de mostrar la rutina actual del cliente, con el fin de mostrarla en el modulo del entrenador
        // GET: api/cliente/{id}/rutinaActual
        [HttpGet("{id}/rutinaActual")]
        public async Task<IActionResult> ObtenerRutinaActual(int id)
        {
            var rutina = await _context.Rutinas
                .Where(r => r.IdCliente == id && r.FechaFin >= DateTime.Now)
                .OrderByDescending(r => r.FechaInicio)
                .Select(r => new
                {
                    r.IdRutina,
                    r.FechaInicio,
                    r.FechaFin,
                    Ejercicios = r.EjerciciosRutina.Select(er => new
                    {
                        er.Ejercicio.Nombre,
                        er.Ejercicio.Descripcion,
                        er.Comentario
                    })
                })
                .FirstOrDefaultAsync();

            if (rutina == null)
                return NotFound(new { mensaje = "No se encontró una rutina actual para este cliente." });

            return Ok(rutina);
        }
    }
}