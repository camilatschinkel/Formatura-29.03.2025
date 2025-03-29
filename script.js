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

        // Converte a imagem para base64 em formato JPEG
        const fotoBase64 = canvas.toDataURL('image/jpeg', 0.9); // JPEG com 90% de qualidade

        // Configura o link para download da foto
        downloadLink.href = fotoBase64;
        downloadLink.download = 'foto_com_filtro.jpg'; // Altere o nome do arquivo para .jpg
        downloadLink.style.display = 'block';
        downloadLink.click();  // Baixa automaticamente a foto com o filtro
    };

    // Se a imagem já estiver carregada, chama a função de captura imediatamente
    if (filterImage.complete) {
        filterImage.onload();
    }
}
