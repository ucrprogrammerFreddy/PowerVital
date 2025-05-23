using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PowerVital.Models
{
    public class HistorialSalud
    {
        [Key]
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; }

        public int EntrenadorId { get; set; }
        public Entrenador Entrenador { get; set; }

        public DateTime FechaRegistro { get; set; }

        public decimal Peso { get; set; }
        public decimal IndiceGrasaCorporal { get; set; }

        public ICollection<PadecimientoHistorial> PadecimientosHistorial { get; set; }
    }
}
