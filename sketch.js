let video;
let canvas;
let filterImage;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('p5-canvas-container');

  video = createCapture(VIDEO);
  console.log("Câmera iniciada com sucesso!");
  video.size(640, 480);
  video.hide();

  filterImage = loadImage('https://i.postimg.cc/k5PckJLb/85130723-c7a6-4d13-91a8-f4788a95c5ce-20250316-154127-0000.png');
}

function draw() {
  background(220);
  image(video, 0, 0, 640, 480);

  image(filterImage, 0, 0, 640, 480);
}

function takeSnapshot() {
  save('studentName.png');
}