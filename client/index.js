var socket = io();
var colors = [];
const onClick = (event) => {
  var curr = event.srcElement.id;
  if (curr.length > 0) {
    if (curr.substring(0, 3) == "img") {
      if (colors.length >= 1) {
        if (colors.length == 1) {
          if (colors[0] == curr) {
            document.getElementById(curr).style.borderColor = "red";
            colors = [];
            return;
          }
        }
        for (let i = 0; i < colors.length; i++) {
          var chn = colors[i];
          document.getElementById(chn).style.borderColor = "red";
        }
        colors = []
      }
      document.getElementById(curr).style.borderColor = "blue";
      colors.push(curr)
    }
  }
}
window.addEventListener('click', onClick);

function CreateRoom() {
  if (colors.length != 1) {
    window.alert("Please atleast select one character as profile pic!");
    return;
  }
  var name = document.getElementById("name").value;
  if (!name || name.length < 3) {
    window.alert("Input name is invalid!!");
    return;
  }
  socket.emit("createroom", colors, name);
  // window.location.href = './gamepage.html'
}

function Enter() {
  console.log(colors);
  if (colors.length != 1) {
    window.alert("Please atleast select one character as profile pic!");
    return;
  }
  var name = document.getElementById("name").value;
  if (!name || name.length < 3) {
    window.alert("Input name is invalid!!");
    return;
  }
  var roomcode = document.getElementById("room").value;
  socket.emit("joinroom", colors, name, roomcode);
}

socket.on("invalid", (code) => {
  window.alert("Entered roomcode is invalid!!");
  return;
})
socket.on("roomfull", (code) => {
  window.alert("Entered roomcode is Already Full!!");
  return;
})