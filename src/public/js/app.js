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





function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}


function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");

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
socket.on("welcome", () => {
    console.log("welcome");
    addMessage("someone joind!!!");
});

socket.on("bye", () => {
    addMessage("someone left!!!");
});
