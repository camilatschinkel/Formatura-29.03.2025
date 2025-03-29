const flipButton = document.getElementById('flip-camera');
const photoButton = document.getElementById('take-photo');
const recordButton = document.getElementById('record-button');
const recordTime = document.getElementById('record-time');
const mediaContainer = document.getElementById('media-container');

let stream;
let recorder;
let chunks = [];
let startTime;
let cameraFacing = 'user';
let isRecording = false;

async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing },
            audio: true
        });
    } catch (err) {
        console.error('Erro ao acessar a webcam:', err);
    }
}

function flipCamera() {
    cameraFacing = cameraFacing === 'user' ? 'environment' : 'user';
    stopWebcam();
    startWebcam();
    window.location.reload();
}

function takePhoto() {
    takeSnapshot();
}

function startRecord() {
    if (!isRecording) {
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => chunks.push(event.data);
        recorder.onstop = saveVideo;
        recorder.start();
        startTime = Date.now();
        isRecording = true;
        updateRecordTime(); // Chama a função aqui para iniciar o temporizador
    } else {
        recorder.stop();
        isRecording = false;
    }
}

function stopRecord() {
    if (recorder && recorder.state === 'recording') {
        recorder.stop();
        isRecording = false;
    }
}

function saveVideo() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    saveMedia(videoUrl, 'video.webm');
}

function saveMedia(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    const media = filename.endsWith('.png') ? document.createElement('img') : document.createElement('video');
    media.src = url;
    media.controls = true;
    mediaContainer.appendChild(media);
}

function updateRecordTime() {
    if (isRecording) {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
        recordTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setTimeout(updateRecordTime, 1000);
    } else {
        recordTime.textContent = '00:00';
    }
}

flipButton.addEventListener('click', flipCamera);
photoButton.addEventListener('click', takePhoto);
recordButton.addEventListener('click', startRecord);

startWebcam();