using System.Collections.Generic;
using System.Reflection.Emit;
using System.Xml.Serialization;
using Microsoft.EntityFrameworkCore;
using API_BD.Models;


namespace API_BD.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets: representan las tablas
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<Cliente> Clientes { get; set; }

        public DbSet<Ejercicio> Ejercicios { get; set; }
        public DbSet<Padecimiento> Padecimientos { get; set; }
        public DbSet<Rutina> Rutinas { get; set; }

        public DbSet<EjercicioRutina> EjercicioRutina { get; set; }
        public DbSet<PadecimientoCliente> PadecimientoCliente { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Herencia TPH para Usuario
            modelBuilder.Entity<Usuario>()
                .HasDiscriminator<string>("Rol")
                .HasValue<Administrador>("Administrador")
                .HasValue<Entrenador>("Entrenador")
                .HasValue<Cliente>("Cliente");

            // Relación entre Cliente y Entrenador sin cascada
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

    }
}
