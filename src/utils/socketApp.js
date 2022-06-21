import socketio from 'socket.io';
class SocketApp {
  constructor(expressServer) {
    if (!SocketApp.instance) {
      SocketApp.instance = this;
    }
    this.io = socketio(expressServer, {
      cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });
    return SocketApp.instance;
  }

  static init(expressServer) {
    this.io = socketio(expressServer, {
      cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });
  }
}

export default SocketApp;
