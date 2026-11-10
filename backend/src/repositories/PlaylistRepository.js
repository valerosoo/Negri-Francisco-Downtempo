import store from "../db/store.js";

class PlaylistRepository {
    findAll() {
        return store.get("playlists");
    }

    findByDJ(idDJ) {
        return this.findAll().filter((playlist) => playlist.idDJ === idDJ);
    }

    deleteByDJ(idDJ) {
        const playlists = this.findAll();
        const restantes = playlists.filter((playlist) => playlist.idDJ !== idDJ);
        playlists.splice(0, playlists.length, ...restantes);
        store.save();
    }
}

export default new PlaylistRepository();
