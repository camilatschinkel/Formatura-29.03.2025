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

async function checkCameraPermissions() {
    try {
        const status = await navigator.permissions.query({ name: 'camera' });
        if (status.state === 'granted') {
            return true;
        } else {
            return navigator.mediaDevices.getUserMedia({ video: true });
        }
    } catch (err) {
        console.error('Erro ao verificar permissões:', err);
        return false;
    }
}

async function getCameraStream(facingMode) {
    const constraints = {
        video: { facingMode: facingMode },
        audio: true
    };
    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
        console.error('Erro ao obter stream da câmera:', error);
        return null;
    }
}

async function startWebcam() {
    try {
        if (await checkCameraPermissions()) {
            let stream = await getCameraStream({ exact: cameraFacing });
            if (!stream && cameraFacing === 'environment') {
                stream = await getCameraStream('environment');
            }
            if (!stream) {
                stream = await getCameraStream('user');
            }
            if (stream) {
                if (capture) {
                    capture.remove();
                }
                capture = createCapture(VIDEO);
                capture.size(window.innerWidth, window.innerHeight);
                capture.hide();
                return;
            }
            alert('Nenhuma câmera disponível.');
        } else {
            alert('Permissões de câmera não concedidas.');
        }
    } catch (err) {
        console.error('Erro ao acessar a webcam:', err);
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


startWebcam();
