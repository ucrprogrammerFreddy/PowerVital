using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PowerVital.DTO
{
    public class ImpedimentosDto
    {
        [Key]
        public int IdImpedimento { get; set; }

        [Required]
        public string Nombre { get; set; }

        // Lista de áreas afectadas (mapeada desde/para cadena separada por comas)
        public List<string> AreasAfectadas { get; set; }

        public string Severidad { get; set; }
    }
}