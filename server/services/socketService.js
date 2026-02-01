
class SocketService {
    constructor() {
        this.io = null;
    }

    setIO(io) {
        this.io = io;
    }

    emitToRoom(room, event, data) {
        if (this.io) {
            this.io.to(room).emit(event, data);
        }
    }

    emitToUser(userId, event, data) {
        if (this.io) {
            this.io.to(userId).emit(event, data);
        }
    }

    emitToAll(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

const Socs = new SocketService();
export default Socs;