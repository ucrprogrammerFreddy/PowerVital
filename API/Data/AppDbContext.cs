

using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using PowerVital.Models;

namespace PowerVital.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

                   
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }



        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<Cliente> Clientes { get; set; }

        public DbSet<Ejercicio> Ejercicios { get; set; }
        public DbSet<Padecimiento> Padecimientos { get; set; }
        public DbSet<Rutina> Rutinas { get; set; }

        public DbSet<EjercicioRutina> EjercicioRutina { get; set; }
        public DbSet<PadecimientoCliente> PadecimientoCliente { get; set; }


        // Relacion entre las tablas y llaves foraneas
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Herencia TPH para Usuario
            modelBuilder.Entity<Usuario>()
                .HasDiscriminator<string>("Rol")
                .HasValue<Administrador>("Administrador")
                .HasValue<Entrenador>("Entrenador")
                .HasValue<Cliente>("Cliente");

            //// Relación entre Cliente y Entrenador sin cascada
            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Entrenador)
                .WithMany(e => e.Clientes)
                .HasForeignKey(c => c.EntrenadorId)
                .OnDelete(DeleteBehavior.NoAction); // 🛡️ Clave para evitar el error

            // Clave compuesta para EjercicioRutina
            modelBuilder.Entity<EjercicioRutina>()
                .HasKey(er => new { er.IdRutina, er.IdEjercicio });

            // Clave compuesta para PadecimientoCliente
            modelBuilder.Entity<PadecimientoCliente>()
                .HasKey(pc => new { pc.IdCliente, pc.IdPadecimiento });

            // Relaciones personalizadas si las necesitas (opcional)
        }







        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<Administrador>().HasData(
        //         new Administrador { id = 1, nombre = "Freddy", correo = "Admin@gmail.com",telefono = "12345678",clave = "123", rol = "Administrador", titulacion = "UCR" }

        //    );


        //}



    }
}
