using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_BD.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ejercicios",
                columns: table => new
                {
                    IdEjercicio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AreaMuscular = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Repeticiones = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ejercicios", x => x.IdEjercicio);
                });

            migrationBuilder.CreateTable(
                name: "Padecimientos",
                columns: table => new
                {
                    IdPadecimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AreaMuscularAfectada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Severidad = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Padecimientos", x => x.IdPadecimiento);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Clave = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rol = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    Titulacion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Genero = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altura = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Peso = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EstadoPago = table.Column<bool>(type: "bit", nullable: true),
                    EntrenadorId = table.Column<int>(type: "int", nullable: true),
                    FormacionAcademica = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Usuarios_EntrenadorId",
                        column: x => x.EntrenadorId,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "PadecimientoCliente",
                columns: table => new
                {
                    IdCliente = table.Column<int>(type: "int", nullable: false),
                    IdPadecimiento = table.Column<int>(type: "int", nullable: false),
                    ClienteIdUsuario = table.Column<int>(type: "int", nullable: true),
                    PadecimientoIdPadecimiento = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PadecimientoCliente", x => new { x.IdCliente, x.IdPadecimiento });
                    table.ForeignKey(
                        name: "FK_PadecimientoCliente_Padecimientos_PadecimientoIdPadecimiento",
                        column: x => x.PadecimientoIdPadecimiento,
                        principalTable: "Padecimientos",
                        principalColumn: "IdPadecimiento");
                    table.ForeignKey(
                        name: "FK_PadecimientoCliente_Usuarios_ClienteIdUsuario",
                        column: x => x.ClienteIdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "Rutinas",
                columns: table => new
                {
                    IdRutina = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdCliente = table.Column<int>(type: "int", nullable: false),
                    ClienteIdUsuario = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rutinas", x => x.IdRutina);
                    table.ForeignKey(
                        name: "FK_Rutinas_Usuarios_ClienteIdUsuario",
                        column: x => x.ClienteIdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "EjercicioRutina",
                columns: table => new
                {
                    IdRutina = table.Column<int>(type: "int", nullable: false),
                    IdEjercicio = table.Column<int>(type: "int", nullable: false),
                    RutinaIdRutina = table.Column<int>(type: "int", nullable: true),
                    EjercicioIdEjercicio = table.Column<int>(type: "int", nullable: true),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EjercicioRutina", x => new { x.IdRutina, x.IdEjercicio });
                    table.ForeignKey(
                        name: "FK_EjercicioRutina_Ejercicios_EjercicioIdEjercicio",
                        column: x => x.EjercicioIdEjercicio,
                        principalTable: "Ejercicios",
                        principalColumn: "IdEjercicio");
                    table.ForeignKey(
                        name: "FK_EjercicioRutina_Rutinas_RutinaIdRutina",
                        column: x => x.RutinaIdRutina,
                        principalTable: "Rutinas",
                        principalColumn: "IdRutina");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EjercicioRutina_EjercicioIdEjercicio",
                table: "EjercicioRutina",
                column: "EjercicioIdEjercicio");

            migrationBuilder.CreateIndex(
                name: "IX_EjercicioRutina_RutinaIdRutina",
                table: "EjercicioRutina",
                column: "RutinaIdRutina");

            migrationBuilder.CreateIndex(
                name: "IX_PadecimientoCliente_ClienteIdUsuario",
                table: "PadecimientoCliente",
                column: "ClienteIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_PadecimientoCliente_PadecimientoIdPadecimiento",
                table: "PadecimientoCliente",
                column: "PadecimientoIdPadecimiento");

            migrationBuilder.CreateIndex(
                name: "IX_Rutinas_ClienteIdUsuario",
                table: "Rutinas",
                column: "ClienteIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_EntrenadorId",
                table: "Usuarios",
                column: "EntrenadorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EjercicioRutina");

            migrationBuilder.DropTable(
                name: "PadecimientoCliente");

            migrationBuilder.DropTable(
                name: "Ejercicios");

            migrationBuilder.DropTable(
                name: "Rutinas");

            migrationBuilder.DropTable(
                name: "Padecimientos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
