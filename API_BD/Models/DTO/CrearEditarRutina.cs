namespace API_BD.Models.DTO
{
    public class CrearEditarRutina
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int IdCliente { get; set; }
        public List<EjercicioRutina> Ejercicios { get; set; }

    }
}
