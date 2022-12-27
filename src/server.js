import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000 ws://localhost:3000');

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });



wss.on("connection", (socket) => {
    socket.send("hello!!!");
    console.log("connect to brower!!")
})

// app.listen(3000, handleListen);
server.listen(3000, handleListen);