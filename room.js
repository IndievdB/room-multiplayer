TYPE_CONNECT = 0;
TYPE_DATA = 1;

class Host {
  constructor(hostInit, guestOpen, guestClose, gotMessage) {
    this.guests = []
    this.name = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
      .replace("I", "A")
      .replace("L", "B")
      .replace("O", "C")
      .replace("0", "D")
      .replace("1", "E");
    this.peer = new Peer("HOST_" + this.name);
    this.peer.on('open', (id) => {
      hostInit(this.name)
    });
    this.peer.on('connection', (conn) => {
        conn.on('data', (d) => {
          if (d.type == TYPE_CONNECT) {
            this.guests.push({id:conn.peer, conn:conn, name: d.name})
            guestOpen(conn.peer, d.name)
          }
          if (d.type == TYPE_DATA) {
            gotMessage(conn.peer, d.message)
          }
        });
        conn.on('close', () => {
            this.guests = this.guests.filter(function( p ) {
                return p.id !== conn.peer;
            });
            guestClose(conn.peer)
        });
    });
  }

  Send(id, message) {
    for (var i = 0; i < this.guests.length; i++) {
      if (this.guests[i].id == id) {
        this.guests[i].conn.send({type:TYPE_DATA, message: message});
        return
      }
    }
  }

  SendAll(message) {
    for (var i = 0; i < this.guests.length; i++) {
      this.guests[i].conn.send({type:TYPE_DATA, message: message});
    }
  }
}

class Guest {
  constructor(name, guestInit) {
    this.name = name
    this.peer = new Peer(Math.random().toString(36).substring(2, 8).toUpperCase() + "_" + name)
    this.peer.on('open', (id) => {
      guestInit(name)
    });
  }

  Join(room, gotMessage, closed) {
    this.conn = this.peer.connect("HOST_" + room);
    this.conn.on('open', () => {
      this.conn.send({type: TYPE_CONNECT, name: this.name});
    });
    this.conn.on('data', (d) => {
      if (d.type == TYPE_DATA) {
        gotMessage(d.message)
      }
    });
    this.conn.on('close', () => {
      closed()
    });
  }

  Send(message) {
    this.conn.send({type:TYPE_DATA, message: message})
  }
}
