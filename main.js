host = null
function SelectHost() {
  function hostInit(id) {
    console.log("Host", id)
    document.getElementById("host-id").innerHTML = id;
  }
  function guestOpen(id, name) {
    console.log("Guest Open", id, name)
  }
  function guestClose(id) {
    console.log("Guest Closed", id)
  }
  function gotMessage(guest, message) {
    console.log("From", guest, "Message", message)
  }
  host = new Host(hostInit, guestOpen, guestClose, gotMessage);
}
function SendHost() {
  message = document.getElementById("host-send").value;
  guest = host.guests[0].id
  host.Send(guest, message)
}
function SendHostAll() {
  message = document.getElementById("host-sendall").value;
  host.SendAll(message)
}

guest = null
function SelectGuest() {
  function guestInit(id) {
    console.log("Guest", id)
    document.getElementById("guest-id").innerHTML = id;
  }
  guest = new Guest("Jarrett", guestInit)
}
function Join() {
  room = document.getElementById("guest-join").value;
  function gotMessage(message) {
    console.log("Message", message)
  }
  function closed(id) {
    console.log("Closed", id)
  }
  guest.Join(room, gotMessage, closed)
}
function SendGuest() {
  message = document.getElementById("guest-send").value;
  guest.Send(message)
}
