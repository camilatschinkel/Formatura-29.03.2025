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
let capture;

async function startWebcam() {
    try {
        const constraints = {
            video: { facingMode: { exact: cameraFacing } },
            audio: true
        };

        // Verifica se a câmera traseira está disponível
        if (cameraFacing === 'environment') {
            constraints.video.facingMode = 'environment';
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (capture) {
            capture.remove();
        }
        capture = createCapture(VIDEO);
        capture.size(window.innerWidth, window.innerHeight);
        capture.hide();
    } catch (err) {
        console.error('Erro ao acessar a webcam:', err);
        // Exibe uma mensagem de erro para o usuário
        alert('Erro ao acessar a webcam: ' + err.message);
    }
}

function flipCamera() {
    cameraFacing = cameraFacing === 'user' ? 'environment' : 'user';
    startWebcam();
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
        updateRecordTime();
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


function gerarNomeArquivo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const NewData = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const filename = `Formatura Vitória Dzwieleski_${NewData}.png`;
    return filename;
  }
flipButton.addEventListener('click', flipCamera);
photoButton.addEventListener('click', takePhoto);
recordButton.addEventListener('click', startRecord);

startWebcam();