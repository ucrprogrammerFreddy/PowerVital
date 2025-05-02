namespace API_BD.Models
{
    public class Rutina
    {
        public int IdRutina { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int IdCliente { get; set; }
        public Cliente Cliente { get; set; }

        public ICollection<EjercicioRutina> EjerciciosRutina { get; set; }

    }
}
