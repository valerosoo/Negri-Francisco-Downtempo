class Entrada {
    constructor(idEntrada, codigo, nombreInvitado, usada = false) {
        this.idEntrada = idEntrada;
        this.codigo = codigo;
        this.nombreInvitado = nombreInvitado;
        // Se marca en la puerta cuando se valida el código.
        this.usada = usada;
    }
}

export default Entrada;
