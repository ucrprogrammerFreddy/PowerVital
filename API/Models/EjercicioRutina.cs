using System.ComponentModel.DataAnnotations;
namespace PowerVital.Models
{
    public class EjercicioRutina
    {

        public int IdRutina { get; set; }
        public Rutina Rutina { get; set; }

        public int IdEjercicio { get; set; }
        public Ejercicio Ejercicio { get; set; }

        public string Comentario { get; set; }

    }
}
