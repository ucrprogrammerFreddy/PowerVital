using System.ComponentModel.DataAnnotations;

namespace PowerVital.DTO
{
    public class PadecimientoHistorialDTO
    {
        public int IdHistorial { get; set; }

        [Required]
        public int IdCliente { get; set; }

        [Required]
        public int IdPadecimiento { get; set; }

        [Required]
        [StringLength(100)]
        public string NombrePadecimiento { get; set; } // Copia textual del nombre

        public DateTime Fecha { get; set; } = DateTime.Now;

        public decimal? Peso { get; set; } // Peso del cliente al momento

        [StringLength(20)]
        public string Severidad { get; set; } // Leve, Moderado, Grave
    }
}
