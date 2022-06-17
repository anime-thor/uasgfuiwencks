var socket = io();
var username = prompt("Please Enter Your :")
var boxes = document.querySelectorAll('.inbox');
var player_id = 0;
var symbol = "";
var room_id = 0;
var gameover = false;
var canclick = false;

socket.on("setprofile", (colors, name, roomcode) => {
    document.getElementById("ppic").setAttribute("src", "./Utils/logo" + colors[3] + ".jpeg")
    document.getElementById("pname").innerHTML = name;
    document.getElementById("text").innerHTML = "Room Code : " + roomcode;
})

socket.on("player_connected", (s) => {
    if (player_id === 0) {
        if (s === 1) {
            symbol = "X";
            player_id = 1;
        }
        else if (s === 2) {
            symbol = "O";
            player_id = 2;
        }

    }
    if (s === 3) {
        symbol = "X";
        player_id = 1;
    }
})

socket.on("reload", () => {
    window.location.reload();
})

socket.on("gamestart", (room) => {
    room_id = room;
    socket.emit("username", symbol, username, room_id);
    if (player_id === 1) {
        canclick = true;
    }
    document.getElementById('glogs').innerHTML = "Game Started .Player 1's Turn";
    document.getElementById("roomid").innerHTML = room_id;

})

