let video;
let canvas;
let filterImage;

function setup() {
  // Cria o canvas e posiciona-o ao centro
  canvas = createCanvas(640, 480);
  canvas.position((windowWidth - width) / 2, 280);

  // Inicializa o vídeo e oculta o elemento HTML padrão
  video = createCapture(VIDEO);
  console.log("Câmera iniciada com sucesso!");
  video.size(640, 480);
  video.hide(); // Esconde o elemento de vídeo padrão do HTML

  // Carrega a imagem do filtro
  filterImage = loadImage('https://i.postimg.cc/k5PckJLb/85130723-c7a6-4d13-91a8-f4788a95c5ce-20250316-154127-0000.png');
}

function draw() {
  // Renderiza o vídeo no canvas
  background(220);
  image(video, 0, 0, 640, 480);

  // Aplica a imagem como filtro (como uma camada)
  image(filterImage, 0, 0, 640, 480);
}

function takeSnapshot() {
  // Salva a imagem com o nome especificado
  save('studentName.png');
}
