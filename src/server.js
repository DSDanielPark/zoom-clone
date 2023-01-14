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


const httpServer = http.createServer(app);
const wsServer = socketIO(httpServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);
        done();
    }) 
})

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);