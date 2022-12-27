const socket = new WebSocket(`ws://${window.location.host}`)


socket.addEventListener("open", () => {
    console.log("Conneted to server check!!");
})

socket.addEventListener("message", (message) => {
    console.log("just got message:", message, "from the server");
})


socket.addEventListener("close", () => {
    console.log("Conneted from server: X");
});