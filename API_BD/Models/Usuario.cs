using System.ComponentModel.DataAnnotations;

namespace API_BD.Models
{
    public abstract  class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Clave { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }

    }
}
