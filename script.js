const camera = document.getElementById('camera');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
const downloadLink = document.getElementById('downloadLink');
const downloadVideoLink = document.getElementById('downloadVideoLink');

const photoModeButton = document.getElementById('photoMode');
const videoModeButton = document.getElementById('videoMode');

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let isPhotoMode = true;

// Função para iniciar a câmera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            camera.srcObject = stream;
            startRecording(stream); // Inicia a gravação se for vídeo
        })
        .catch(err => {
            console.error('Erro ao acessar a câmera:', err);
            alert('Não foi possível acessar a câmera. Verifique as permissões.');
        });
}

// Função para iniciar a gravação de vídeo
function startRecording(stream) {
    const options = { mimeType: 'video/webm;codecs=vp9' };

    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Baixa automaticamente o vídeo após a gravação
        const videoURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = videoURL;
        a.download = 'video.mp4'; // Forçando o download com extensão .mp4
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
}

// Função para capturar uma foto
function capturePhoto() {
    const largura = camera.videoWidth;
    const altura = camera.videoHeight;

    canvas.width = largura;
    canvas.height = altura;

    // Desenha o vídeo no canvas
    contexto.drawImage(camera, 0, 0, largura, altura);

    // Converte a imagem para base64 e baixa automaticamente
    const fotoBase64 = canvas.toDataURL('image/png');
    downloadLink.href = fotoBase64;
    downloadLink.style.display = 'block';
    downloadLink.click();  // Baixa automaticamente
}

// Alterna entre os modos de foto e vídeo
photoModeButton.addEventListener('click', () => {
    isPhotoMode = true;
    photoModeButton.classList.add('active');
    videoModeButton.classList.remove('active');
    captureButton.innerHTML = '<i class="fas fa-camera"></i>';  // Ícone de foto
    captureButton.classList.remove('recording');
});

videoModeButton.addEventListener('click', () => {
    isPhotoMode = false;
    videoModeButton.classList.add('active');
    photoModeButton.classList.remove('active');
    captureButton.innerHTML = '<i class="fas fa-video"></i>';  // Ícone de vídeo
    captureButton.classList.remove('recording');
});

// Função de captura (foto ou vídeo)
captureButton.addEventListener('click', () => {
    if (isPhotoMode) {
        capturePhoto();  // Captura foto
    } else {
        if (isRecording) {
            mediaRecorder.stop(); // Para a gravação
            isRecording = false;
            captureButton.innerHTML = '<i class="fas fa-video"></i>'; // Ícone de vídeo
            captureButton.classList.remove('recording');
        } else {
            mediaRecorder.start(); // Inicia a gravação
            isRecording = true;
            captureButton.innerHTML = '<i class="fas fa-stop"></i>'; // Ícone de parar gravação
            captureButton.classList.add('recording');
        }
    }
});

// Inicia a câmera assim que a página carrega
window.onload = startCamera;
