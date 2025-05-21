export class ClienteModel {
  constructor(
    idUsuario,
    nombre,
    clave,
    email,
    genero,
    telefono,
    fechaNacimiento,
    altura,
    peso,
    estadoPago,
    entrenadorId,
    padecimientos
  ) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.clave = clave;
    this.email = email;
    this.genero = genero;
    this.rol = "Cliente";
    this.telefono = parseInt(telefono);
    this.fechaNacimiento = fechaNacimiento;
    this.altura = parseFloat(altura);
    this.peso = parseFloat(peso);
    this.estadoPago = "true";
    this.entrenadorId = entrenadorId;
    this.padecimientos = padecimientos;
  }
}
