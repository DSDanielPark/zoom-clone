const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;


function addMessage(message){
    console.log("lets")
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
};


function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
    input.value = "";
    });
}

function handleNickameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
    input.value = "";
    ;
};

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

    const msgFrom = room.querySelector("#msg");
    const nameFrom = room.querySelector("#name");
    
    msgFrom.addEventListener("submit", handleMessageSubmit);
    nameFrom.addEventListener("submit", handleNickameSubmit);

}


function handleRoomSubmit(event){
    event.preventDefault();
    const input = welcome.querySelector("input");

    socket.emit("enter_room", input.value, showRoom);

    roomName = input.value;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);



// socket.on("welcom", () => {
//     const ul = room.querySelector("ul");
//     const li = document.querySelector("li");
//     li.innerText = "Someone Joind!!";
//     ul.appendChild(li);
// })



// function addMessage(message){
//     const ul = room.querySelector("ul");
//     const li = document.createElement("li");
//     li.innerText = message;
//     console.log(li.innerText);
//     ul.appendChild(li);
// };


//addEventListener 대신 socket.on 사용한다.
socket.on("welcome", (user) => {
    console.log(`${user} welcome!!`);
    addMessage("someone joind!!!");
});

socket.on("bye", (left) => {
    addMessage(`${left} left!!!`);
});


socket.on("new_message", addMessage);
// socket.on("new_message", (msg) => {addMessage(msg)}); 랑 동일함

socket.on("room_change", console.log);
