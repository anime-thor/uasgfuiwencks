const express = require('express');
const app = express();
const http = require('http');
var started = false;
const server = http.createServer(app);
const { Server } = require("socket.io");
var path = require("path");
const { type } = require('os');
const io = new Server(server);
var players = 0;
var no = 0;
app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname, "/client")));
    res.sendFile(__dirname + '/client/index.html');
});
function check(grid) {
    if (grid[0] !== "" && grid[0] === grid[1] && grid[1] === grid[2]) {
        if (grid[0] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[3] !== "" && grid[3] === grid[4] && grid[4] === grid[5]) {
        if (grid[3] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[6] !== "" && grid[6] === grid[7] && grid[7] === grid[8]) {
        if (grid[6] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[0] !== "" && grid[0] === grid[3] && grid[3] === grid[6]) {
        if (grid[0] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[1] !== "" && grid[1] === grid[4] && grid[4] === grid[7]) {
        if (grid[1] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[2] !== "" && grid[2] === grid[5] && grid[5] === grid[8]) {
        if (grid[2] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[0] !== "" && grid[0] === grid[4] && grid[4] === grid[8]) {
        if (grid[0] === "X")
            return 1;
        else
            return 2;
    }
    else if (grid[2] !== "" && grid[2] === grid[4] && grid[4] === grid[6]) {
        if (grid[2] === "X")
            return 1;
        else
            return 2;
    }
    else
        return 0;
}
var gridbox = {};
var rooms_used = {};
var mp = {};
var room_codes = {};
function createcode(length = 7) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

io.on('connection', (socket) => {
    let stop = false;
    var map_length = 0;
    // for (const key in rooms_used) {
    //     console.log(key)
    //     if (rooms_used[key].length === 1) {
    //         let room = "room" + key;
    //         socket.join(room);
    //         rooms_used[key].push(socket.id);
    //         mp[socket.id] = key;
    //         io.to(room).emit("player_connected", 2);
    //         io.to(room).emit("gamestart", room);
    //         gridbox[room] = ['', '', '', '', '', '', '', '', ''];
    //         stop = true;
    //         break;
    //     }
    // }
    // if (!stop) {
    //     for (const key in rooms_used) {
    //         map_length += 1;
    //         if (rooms_used[key].length === 0) {
    //             let room = "room " + key;
    //             socket.join(room);
    //             rooms_used[key].push(socket.id);
    //             mp[socket.id] = key;
    //             io.to(room).emit("player_connected", 1);
    //             stop = true;
    //             break;
    //         }
    //     }
    // }
    // if (!stop) {
    //     rooms_used[map_length] = [];
    //     let room = "room" + map_length;
    //     socket.join(room);
    //     rooms_used[map_length].push(socket.id);
    //     mp[socket.id] = map_length;
    //     io.to(room).emit("player_connected", 1);

    // }
    // console.log(rooms_used);
    // players += 1;
    // console.log("players = " + players);
    // console.log("user connected");
    socket.on("createroom", (colors, name) => {
        let code = createcode();
        room_codes[code] = [socket.id];
        socket.join(code);
        mp[socket.id] = code;
        socket.emit("setprofile", colors, name, code);
        io.to(code).emit("player_connected", 1);
    })
    socket.on("joinroom", (colors, name, code) => {
        if (code in room_codes) {
            if (room_codes[code].length <= 1) {
                socket.join(code)
                room_codes[code].push(socket.id);
                mp[socket.id] = code;
                socket.emit("setprofile", colors, name, code);
                io.to(code).emit("player_connected", 2);
                io.to(code).emit("gamestart", code);
                gridbox[code] = ['', '', '', '', '', '', '', '', ''];
            }
            else {
                socket.emit("roomfull", code);
            }
        }
        else {
            socket.emit("invalid", code);
        }
    })
    socket.on("clicked", (id, symbol, room_id, username) => {
        console.log("pressed " + id + " with symbol " + symbol);
        gridbox[room_id][id - 1] = symbol;
        console.log(gridbox);
        if (check(gridbox[room_id]) !== 0) {
            console.log("over");
            io.to(room_id).emit("gameover", check(gridbox[room_id]));
        }
        io.to(room_id).emit("update_grid", id, symbol);
    })
    socket.on("reload", (room_id) => {
        io.to(room_id).emit("reload");
    })
    socket.on('disconnect', (a) => {
        players -= 1;
        let id = socket.id;
        console.log('user disconnected ', id);
        let left_room = mp[id];
        if (left_room) {
            room_codes[left_room] = room_codes[left_room].filter((el) => {
                return el != id;
            });
            io.to("room" + left_room).emit("player_connected", 3);
            // io.to("room" + left_room).emit("reload");
            console.log(room_codes);
        }

    });
});
server.listen(process.env.PORT || 5000);
console.log("is listening at ", process.env.PORT);