using System.ComponentModel.DataAnnotations;

namespace PowerVital.Models
{
    public class Impedimentos
    {
        [Key]
        public int IdImpedimento { get; set; }

        [Required]
        public string Nombre { get; set; }

        // Guardamos como cadena separada por comas en la BD
        public string AreasAfectadas { get; set; }

        public string Severidad { get; set; }
    }
}