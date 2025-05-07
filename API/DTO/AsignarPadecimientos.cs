using System.ComponentModel.DataAnnotations;

namespace PowerVital.DTO
{
    public class AsignarPadecimientos
    {
        [Required(ErrorMessage = "El ID del cliente es obligatorio")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del cliente debe ser mayor a 0")]
        public int IdCliente { get; set; }

        [Required(ErrorMessage = "Debe proporcionar al menos un padecimiento")]
        [MinLength(1, ErrorMessage = "Debe haber al menos un padecimiento asignado")]
        public List<int> IdsPadecimientos { get; set; }
    }
}
