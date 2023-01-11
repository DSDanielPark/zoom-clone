const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        // console.log(devices);
        const cameras = devices.filter(device => device.kind === "videoinput");
        // console.log(cameras);
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        })
    } catch(e) {
        console.log(e)
    }
}


async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        // console.log(myStream);
        myFace.srcObject = myStream;
        await getCameras();
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
camerasSelect.addEventListener("input", handleCameraChange);