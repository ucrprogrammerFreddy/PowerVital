using System.ComponentModel.DataAnnotations;

namespace PowerVital.Models
{
    public class Usuario
    {
        [Key]
        public int id { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio.")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.
        public string nombre { get; set; }
        [Required(ErrorMessage = "El correo es obligatorio.")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "El correo no puede exeder los 100 caracteres")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.
        public string correo { get; set; }

        [Required(ErrorMessage = "El telefono es obligatorio")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "El telefono no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.

        public string? telefono { get; set; }


        [Required(ErrorMessage = "la clave es obligatoria")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "la clave no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.

        public string? clave { get; set; }


        [Required(ErrorMessage = "El rol es obligatorio")] // Valida que el campo no esté vacío.
       
        [DataType(DataType.Text)] // Especifica que es un texto.

        public string rol { get; set; }

    }
}
