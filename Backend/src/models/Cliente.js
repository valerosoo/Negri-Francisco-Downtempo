class Cliente {
  constructor(idCliente, nombre, email, contraseña, fechaRegistro) {
    this.idCliente = idCliente;
    this.nombre = nombre;
    this.email = email;
    this.contraseña = contraseña;
    this.fechaRegistro = fechaRegistro;
  }
}

module.exports = Cliente;
