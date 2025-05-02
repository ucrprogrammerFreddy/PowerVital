namespace API_BD.Models
{
    public class Ejercicio
    {
        public int IdEjercicio { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string AreaMuscular { get; set; }
        public int Repeticiones { get; set; }

        public ICollection<EjercicioRutina> EjerciciosRutina { get; set; }

    }
}
