using System.ComponentModel.DataAnnotations;

namespace PowerVital.Models
{
    public class PadecimientoHistorial
    {
        [Key]
        public int Id { get; set; }

        public int HistorialSaludId { get; set; }
        public HistorialSalud HistorialSalud { get; set; }

        public int PadecimientoId { get; set; }
        public Padecimiento Padecimiento { get; set; }

        public string Severidad { get; set; } // Ejemplo: Leve, Moderado, Grave
    }
}
