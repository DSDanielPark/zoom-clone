


const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", () => {
    console.log("Conneted to server check!!");
})

socket.addEventListener("message", (message) => {
    console.log("just got new message:", message.data, "from the server");
})


socket.addEventListener("close", () => {
    console.log("Conneted from server: X");
});


// // 아무 조건이 없으니까 10초뒤에 그냥 다음 익명함수가 실행되는데 socket.send 이다. 브라우저(프론트)로부터
// setTimeout(() => {
//     socket.send("hello from the brower!!");
// }, 10000);


function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    console.log(input.value)
}

messageForm.addEventListener("submit", handleSubmit)