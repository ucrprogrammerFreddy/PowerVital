﻿using Microsoft.EntityFrameworkCore;
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
       
      
        public DbSet<PadecimientoHistorial> PadecimientosHistorial { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Herencia TPH para Usuario
            modelBuilder.Entity<Usuario>()
                .HasDiscriminator<string>("Rol")
                .HasValue<Administrador>("Admin")
                .HasValue<Entrenador>("Entrenador")
                .HasValue<Cliente>("Cliente");

            // Relación Cliente - Entrenador
            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Entrenador)
                .WithMany(e => e.Clientes)
                .HasForeignKey(c => c.EntrenadorId)
                .OnDelete(DeleteBehavior.NoAction);

            // Relación EjercicioRutina (clave compuesta)
            modelBuilder.Entity<EjercicioRutina>()
                .HasKey(er => new { er.IdRutina, er.IdEjercicio });

            // 🔧 RELACIÓN CORREGIDA para PadecimientoCliente
            modelBuilder.Entity<PadecimientoCliente>()
                .HasKey(pc => new { pc.IdCliente, pc.IdPadecimiento });

            modelBuilder.Entity<PadecimientoCliente>()
                .HasOne(pc => pc.Cliente)
                .WithMany(c => c.PadecimientosClientes)
                .HasForeignKey(pc => pc.IdCliente)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PadecimientoCliente>()
                .HasOne(pc => pc.Padecimiento)
                .WithMany(p => p.PadecimientosClientes)
                .HasForeignKey(pc => pc.IdPadecimiento)
                .OnDelete(DeleteBehavior.Cascade);




            // PadecimientoHistorial -> Cliente
            modelBuilder.Entity<PadecimientoHistorial>()
                .HasOne(ph => ph.Cliente)
                .WithMany()
                .HasForeignKey(ph => ph.IdCliente)
                .OnDelete(DeleteBehavior.Cascade);

            // PadecimientoHistorial -> Padecimiento
            modelBuilder.Entity<PadecimientoHistorial>()
                .HasOne(ph => ph.Padecimiento)
                .WithMany(p => p.PadecimientosHistorial)
                .HasForeignKey(ph => ph.IdPadecimiento)
                .OnDelete(DeleteBehavior.Cascade);








        }

    }
}

