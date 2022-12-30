const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone() {
    console.log("back-end done");
}


function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");

    socket.emit("enter_room", 
    {payload: input.value}, backendDone);

    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);