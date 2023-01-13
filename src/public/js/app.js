const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


const welcome = document.getElementById("welcome");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;

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

async function handleCameraChange() {
    // console.log(camerasSelect.value);
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);


// 여기서부터는 이제 welcome form에서 받았던거 다시 뱉어주는거

const welcomeForm = welcome.querySelector("form");

function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    console.log(input.value);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit); 