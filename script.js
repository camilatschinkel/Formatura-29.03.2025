<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flip Câmera e Gravação</title>
</head>
<body>

<video id="videoElement" width="320" height="240" autoplay></video>
<div id="media-container"></div>

<button id="flip-camera">Trocar Câmera</button>
<button id="take-photo">Tirar Foto</button>
<button id="record-button">Gravar</button>
<p id="record-time">00:00</p>

<script>
    const flipButton = document.getElementById('flip-camera');
    const photoButton = document.getElementById('take-photo');
    const recordButton = document.getElementById('record-button');
    const recordTime = document.getElementById('record-time');
    const mediaContainer = document.getElementById('media-container');
    
    let stream;
    let recorder;
    let chunks = [];
    let startTime;
    let cameraFacing = 'user'; // Inicialmente, usa a câmera frontal
    let isRecording = false;

    async function startWebcam() {
        try {
            // Fechar o stream anterior se já houver um ativo
            if (stream) {
                let tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }

            // Solicitar permissão para acessar a câmera
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: cameraFacing },
                audio: true
            });

            // Passar o stream para o vídeo
            const videoElement = document.getElementById('videoElement');
            videoElement.srcObject = stream;
        } catch (err) {
            console.error('Erro ao acessar a webcam:', err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    }

    function flipCamera() {
        // Trocar a câmera entre frontal e traseira
        cameraFacing = cameraFacing === 'user' ? 'environment' : 'user';
        startWebcam(); // Reiniciar a webcam com a nova câmera
    }

    function takePhoto() {
        // Tirar uma foto (usando a captura de tela)
        const canvas = document.createElement('canvas');
        const videoElement = document.getElementById('videoElement');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imgUrl = canvas.toDataURL('image/png');
        saveMedia(imgUrl, gerarNomeArquivo());
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

    function gerarNomeArquivo() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        const NewData = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        const filename = `Formatura_Vitória_Dzwieleski_${NewData}.png`;
        return filename;
    }

    // Adicionar ouvintes de eventos aos botões
    flipButton.addEventListener('click', flipCamera);
    photoButton.addEventListener('click', takePhoto);
    recordButton.addEventListener('click', startRecord);

    // Inicializar a webcam
    startWebcam();
</script>

</body>
</html>
