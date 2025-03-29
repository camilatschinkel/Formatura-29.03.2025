let video;
let canvas;
let filterImage;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('p5-canvas-container');

  video = createCapture(VIDEO);
  console.log("Câmera iniciada com sucesso!");
  video.size(window.innerWidth, window.innerHeight);
  video.hide();

  filterImage = loadImage('https://i.postimg.cc/k5PckJLb/85130723-c7a6-4d13-91a8-f4788a95c5ce-20250316-154127-0000.png');
}

function draw() {
  background(220);
  image(video, 0, 0, window.innerWidth, window.innerHeight);

  image(filterImage, 0, 0, window.innerWidth, window.innerHeight);
}


function takeSnapshot() {
  save(filename);
}

function takeSnapshot() {
  const nomeArquivo = gerarNomeArquivo(); // Chama a função para obter o nome do arquivo
  save(nomeArquivo); // Usa o nome do arquivo retornado pela função
}