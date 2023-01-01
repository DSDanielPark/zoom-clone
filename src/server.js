import express from "express";
import http from "http";
import WebSocket from "ws";
import socketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const wsServer = socketIO(httpServer);

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

        socket.to(roomName).emit("welcome", socket.nickname);
        wsServer.sockets.emit("room_change", publicRoom());

        // disconnecting(user가 방을 나갔을 경우 알리는 이벤트)
        socket.on("disconnecting", () => {
            socket.rooms.forEach((room) => 
                socket.to(room).emit("bye", socket.nickname));
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