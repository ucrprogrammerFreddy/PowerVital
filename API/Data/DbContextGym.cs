
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using PowerVital.Models;

namespace PowerVital.Data
{
    public class DbContextGym : DbContext
    {

        public DbContextGym(DbContextOptions<DbContextGym> options) : base(options)
        {

        }

                   
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Administrador> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Administrador>().HasData(
                 new Administrador { id = 1, nombre = "Freddy", correo = "Admin@gmail.com",telefono = "12345678",clave = "123", rol = "Administrador", titulacion = "UCR" }
 
            );


        }
    }
}
