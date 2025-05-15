export class AdministradorModel {
  constructor(id, nombre, email, clave, formacionAcademica) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;         // nombre esperado por la API
    this.clave = clave;
    this.rol = "Admin";
    this.formacionAcademica = formacionAcademica;
    
  }
}