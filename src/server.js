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

const handleListen = () => console.log('Listening on http://localhost:3000 ws://localhost:3000');

const httpServer = http.createServer(app);
const wsServer = socketIO(httpServer);

wsServer.on("connection", (socket) => {
    // console.log(socket);

    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    })


    socket.on("enter_room", (roomName, done) => {
        console.log(socket.id);
        console.log(socket.rooms);
        socket.join("roomName");
        console.log(socket.rooms);

        done();

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