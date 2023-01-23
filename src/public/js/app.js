const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


// Phone Call Code
let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;


async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        // console.log(devices);
        const cameras = devices.filter(device => device.kind === "videoinput");
        // console.log(cameras);

        const currentCamera = myStream.getVideoTracks()[0];

        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label == camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch(e) {
        console.log(e)
    }
}


async function getMedia(deviceId) {
    const initialConstraints = {
        audio: true,
        video: { facingMode: "user" }
    };
    const cameraConstraint = {
        audio: true,
        video: {
            deviceId: {exact: deviceId}
          }
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraint : initialConstraints
        );
        // console.log(myStream);
        myFace.srcObject = myStream;
        if (!deviceId) {
        await getCameras()
    };
    } catch (e) {
        console.log(e);
    }
}

// getMedia(); 이거는 이제 함수 안으로 들어감
function handleMuteClick() {
    myStream
        .getAudioTracks() //스트림에 닮긴 트랙 확인
        .forEach((track) => {track.enabled = !track.enabled})
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    myStream
        .getVideoTracks() //스트림에 닮긴 트랙 확인
        .forEach((track) => {track.enabled = !track.enabled})
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}


async function handleCameraChange() {
    await getMedia(camerasSelect.value);
    // getMedia에 보면 deviceId를 기반으로 새로운 비디오 스트림을 create하므로 바로 변수 만들어서 
    // 넣어주면 됨 그래서 videoTrack을 밑에다가 넣는거임
    if (myPeerConnection) {
      const videoTrack = myStream.getVideoTracks()[0];
      // video sender는 webrtc 과정들을 거쳐서 이제 스트림을 주고 받을 수 있으면 그 사이의 데이터 교환 정도
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
  }

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);




// Welcome Form (choose a room)
// 여기서부터는 이제 welcome form에서 받았던거 다시 뱉어주는거
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");

const welcomeForm = welcome.querySelector("form");

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}


async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    // console.log(input.value);
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
    initCall();
}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code
// 이 부분은 이미 방에 들어가있는 브라우저에서 실행될거임 
// Peer A
socket.on("welcome", async() => {
    // console.log("someone joined!");

    // 여기부터 3줄은 데이터 채널용으로 중간에는 스킵, 오퍼를 하는 쪽에서 일단 데이터 채널을 파고
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", (event) => console.log(event.data));
    console.log("made data channel"); 
    //이제 다른 피어는 데이터 채널이 이미 존재하므로 event listener만 만들면 됨

    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log(offer);
    socket.emit("offer", offer, roomName);
    console.log("sent the offer");
});

// 이 부분은 위에 브라우저가 아닌 offer를 받는 브라우저에서 실행될거임
// Peer B
socket.on("offer", async(offer) => {

    // 145번 코드에서 오퍼하는쪽에서 데이터 채널을 팠으면 다음과 같이 이벤트 리스너를 생성해주기만 하면 된다.
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;   // 여기에도 동일하게 myDataChannel이라는 변수 선언해줘야함
        myDataChannel.addEventListener("message", (event) =>
          console.log(event.data)
        );
      });
      console.log("received the offer");
    // 여기까지 데이터 채널에 대한 간단한 예시




    myPeerConnection.setRemoteDescription(offer);
    // console.log(offer);
    const answer = await myPeerConnection.createAnswer();
    // console.log(answer);
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
})




// 여긴 peerA
socket.on("answer", answer => {
    console.log("receive the answer");
    myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", ice => {
    console.log("receive candidate")
    myPeerConnection.addIceCandidate(ice);
})

// RTC code


function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
  }


// 브라우저간(피어간) 데이터 교환이 이루어짐
function handleIce(data){
    socket.emit("ice", data.candidate, roomName);
    console.log("sent ice candidates");
    console.log(data);   
}

function handleAddStream(data) {
    // console.log("got an stream data from my peer");
    // console.log("Peer's stream", data.stream);
    // console.log("My stream", myStream);
    const peerFace = document.getElementById("peerFace");
    // console.log(data.stream)
    peerFace.srcObject = data.stream;
}