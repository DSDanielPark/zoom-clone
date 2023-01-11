const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;


async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        // console.log(myStream);
        myFace.srcObject = myStream;
    } catch (e) {
        console.log(e);
    }
}

getMedia();

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

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);