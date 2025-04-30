using System.ComponentModel.DataAnnotations;

namespace PowerVital.Models
{
    public class Impedimento
    {
        [Key]
        public int idImpedimento { get; set; }

        [Required]
        public string nombre { get; set; }

        // Guardamos como cadena separada por comas en la BD
        public string areasAfectaadas { get; set; }

        public string severidad { get; set; }
    }
}
