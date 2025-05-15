using System.ComponentModel.DataAnnotations;

namespace PowerVital.Models
{
    public class Ejercicio
    {
        [Key]
        public int IdEjercicio { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string AreaMuscular { get; set; }
        public int Repeticiones { get; set; }

        public ICollection<EjercicioRutina> EjerciciosRutina { get; set; }

        public String GuiaEjercicio { get; set; }

        public String Dificultad { get; set; }

    }
}
