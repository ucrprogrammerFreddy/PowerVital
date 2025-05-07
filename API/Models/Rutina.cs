﻿using System.ComponentModel.DataAnnotations;
namespace PowerVital.Models
{
    public class Rutina
    {
        [Key]
        public int IdRutina { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int IdCliente { get; set; }
        public Cliente Cliente { get; set; }

        public ICollection<EjercicioRutina> EjerciciosRutina { get; set; }

    }
}
