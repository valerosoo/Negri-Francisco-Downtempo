class Playlist {
    constructor(idPlaylist, nombre, idDJ, canciones = []) {
        this.idPlaylist = idPlaylist;
        this.nombre = nombre;
        this.idDJ = idDJ;
        this.canciones = canciones;
    }
}

export default Playlist;
