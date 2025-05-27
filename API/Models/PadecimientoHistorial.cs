using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PowerVital.Models
{
    public class PadecimientoHistorial
    {
         [Key]
    public int Id { get; set; }

    [Required]
    public int HistorialSaludId { get; set; }

    [ForeignKey("HistorialSaludId")]
    public HistorialSalud HistorialSalud { get; set; }

    [Required]
    public int PadecimientoId { get; set; }

    [ForeignKey("PadecimientoId")]
    public Padecimiento Padecimiento { get; set; }

    [Required]
    [StringLength(20)]
    public string Severidad { get; set; } // Ejemplo: Leve, Moderado, Grave
    

    }
}
