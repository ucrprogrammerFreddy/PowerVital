namespace API_BD.Models.DTO
{
    public class EditarCliente
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Clave { get; set; }
        public string Email { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public decimal Altura { get; set; }
        public decimal Peso { get; set; }
        public bool EstadoPago { get; set; }
        public int EntrenadorId { get; set; }

    }
}
