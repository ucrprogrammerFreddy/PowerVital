using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PowerVital.Models
{
    public class PadecimientoHistorial
    {
        [Key]
        public int IdHistorial { get; set; }

        [Required]
        public int IdCliente { get; set; }

        [ForeignKey("IdCliente")]
        public Cliente Cliente { get; set; }

        [Required]
        public int IdPadecimiento { get; set; }

        [ForeignKey("IdPadecimiento")]
        public Padecimiento Padecimiento { get; set; }

        [Required]
        [StringLength(100)]
        public string NombrePadecimiento { get; set; } // Copia textual del nombre

        public DateTime Fecha { get; set; } = DateTime.Now;

        public decimal? Peso { get; set; } // Peso del cliente al momento

        [StringLength(20)]
        public string Severidad { get; set; } // Leve, Moderado, Grave

    

    }
}
