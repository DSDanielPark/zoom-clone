import express from "express";
import http from "http";
import WebSocket from "ws";
import socketIO from "socket.io";
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"], //http://localhost:3000/admin으로 서버 입력하면 패널 확인 가능
      credentials: true
    }
  });

instrument(wsServer, {
    auth: false,
    mode: "development",
  });
  

function publicRoom() {
    const {sockets: {adapter: {sids, rooms}}} = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms; 위와 동일한 표현
    const PublicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            PublicRooms.push(key);
        }
    });
    return PublicRooms
}

function countRoom(roomName) {
    console.log(wsServer.sockets.adapter.rooms.get(roomName)?.size)
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}


wsServer.on("connection", (socket) => {
    // console.log(socket);
    socket.onAny((event) => {
        // console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
        // console.log(socket.id);
        console.log(socket.rooms);
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRoom());
        // disconnecting(user가 방을 나갔을 경우 알리는 이벤트)
        socket.on("disconnecting", () => {
            socket.rooms.forEach((room) => 
                socket.to(room).emit("bye", socket.nickname, countRoom(roomName) -1));
        });
        socket.on("disconnect", () => {
            wsServer.sockets.emit("room_change", publicRoom());
        });
        socket.on("new_message", (msg, room, done) => {
            socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
            done();
        })
        socket.on("nickname", nickname => (socket["nickname"] = nickname));
    });
});


// const wss = new WebSocket.Server({ server });
// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon"
//     console.log("connect to brower!!");
//     socket.on("close", () => console.log("disconnected from the brower"));

//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString('utf-8'));

//         switch(message.type) {
//             case "new_message":
//                 console.log(socket.nickname)
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));        
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 console.log(message.payload)
//         }

//     });
//     // socket.send("hello!!!");
// });


// app.listen(3000, handleListen);
httpServer.listen(3000, handleListen);