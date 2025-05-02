namespace API_BD.Models
{
    public class Padecimiento
    {
        public int IdPadecimiento { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string AreaMuscularAfectada { get; set; }
        public string Severidad { get; set; }

        public ICollection<PadecimientoCliente> PadecimientosClientes { get; set; }

    }
}
