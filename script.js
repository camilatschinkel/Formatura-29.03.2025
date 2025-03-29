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

// Carregar a imagem do filtro (moldura) do arquivo "Canvas.png"
const filterImage = new Image();
filterImage.src = 'Canvas.png'; // Caminho para a imagem local "Canvas.png"

// Função para iniciar a câmera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: true // Solicita permissão para o microfone
    })
        .then(stream => {
            camera.srcObject = stream;

            // Desabilita o áudio no stream (não reproduz no site, mas grava)
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => track.enabled = false); // Desabilita o áudio

            // Inicia o mediaRecorder para gravação (se necessário)
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                recordedChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                downloadVideoLink.href = url;
                downloadVideoLink.style.display = 'block';
                downloadVideoLink.download = 'video.webm';
            };
        })
        .catch(err => {
            console.error('Erro ao acessar a câmera e microfone:', err);
            alert('Não foi possível acessar a câmera ou microfone. Verifique as permissões.');
        });
}

// Função para capturar uma foto com o filtro (moldura) aplicado com delay
function capturePhoto() {
    // Aguardar até que a imagem do filtro tenha sido carregada
    filterImage.onload = function() {
        const largura = camera.videoWidth;
        const altura = camera.videoHeight;

        canvas.width = largura;
        canvas.height = altura;

        // Desenha o vídeo no canvas
        contexto.drawImage(camera, 0, 0, largura, altura);

        // Desenha o filtro (moldura) sobre a imagem capturada
        contexto.drawImage(filterImage, 0, 0, largura, altura);

        // Converte a imagem para base64 e faz o download
        const fotoBase64 = canvas.toDataURL('image/png');
        downloadLink.href = fotoBase64;
        downloadLink.style.display = 'block';
        downloadLink.click();  // Baixa automaticamente a foto com o filtro
    };

    // Se a imagem já estiver carregada, chama a função de captura imediatamente
    if (filterImage.complete) {
        filterImage.onload();
    }
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
            startRecording(); // Inicia a gravação com o filtro
        }
    }
});

// Inicia a câmera assim que a página carrega
window.onload = startCamera;
