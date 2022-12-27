const socket = new WebSocket(`ws://${window.location.host}`)


socket.addEventListener("open", () => {
    console.log("Conneted to server check!!")
})