

namespace API_BD.Models
{
    public class Entrenador : Usuario
    {
        public string FormacionAcademica { get; set; }
        public ICollection<Cliente> Clientes { get; set; }

    }
}
