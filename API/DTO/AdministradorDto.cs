﻿using System.ComponentModel.DataAnnotations;

namespace PowerVital.DTO
{
    public class AdministradorDto
    {


       
        public int idIdUsuario { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio.")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.
        public string? Nombre { get; set; }
        [Required(ErrorMessage = "El correo es obligatorio.")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "El correo no puede exeder los 100 caracteres")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.
        public string Email { get; set; }

        //[Required(ErrorMessage = "El telefono es obligatorio")] // Valida que el campo no esté vacío.
        //[StringLength(100, ErrorMessage = "El telefono no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        //[DataType(DataType.Text)] // Especifica que es un texto.

        //public string? telefono { get; set; }


        [Required(ErrorMessage = "la clave es obligatoria")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "la clave no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.

        public string? Clave { get; set; }


        [Required(ErrorMessage = "El rol es obligatorio")] // Valida que el campo no esté vacío.

        [DataType(DataType.Text)] // Especifica que es un texto.

        public string Rol { get; set; }


  public int Telefono { get; set; }

        [Required(ErrorMessage = "El campo titulacion es obligatorio.")] // Valida que el campo no esté vacío.
        [StringLength(100, ErrorMessage = "La titulacion no puede exceder los 100 caracteres.")] // Define la longitud máxima.
        [DataType(DataType.Text)] // Especifica que es un texto.
        public string? FormacionAcademica { get; set; }


    }
}
