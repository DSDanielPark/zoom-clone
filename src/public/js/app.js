


const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`)


function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}


socket.addEventListener("open", () => {
    console.log("Conneted to server check!!");
})

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data //li에다가 메시지 입력
    messageList.append(li); //계속 위로 올라가게 됨

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
    socket.send(makeMessage("new_message", input.value));
    
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSumbit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSumbit);
