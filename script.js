const photoButton = document.getElementById('take-photo');
const mediaContainer = document.getElementById('media-container');

let stream;
let capture;

async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        if (capture) {
            capture.remove();
        }
        capture = createCapture(VIDEO);
        capture.size(window.innerWidth, window.innerHeight);
        capture.hide();
    } catch (err) {
        console.error('Erro ao acessar a webcam:', err);
    }
}

function takePhoto() {
    takeSnapshot();
}

photoButton.addEventListener('click', takePhoto);

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
