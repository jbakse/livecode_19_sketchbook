// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const chunks = [];
let recorder;
function startRecording() {
  chunks.length = 0;
  const stream = document.querySelector("canvas").captureStream(30);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;

  recorder.start();
}

function stopRecording() {
  recorder.stop();
}

function exportVideo(e) {
  const blob = new Blob(chunks);
  const vid = document.createElement("video");
  vid.id = "recorded";
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}

// taken from pr.js docs
var x, y;

function setup() {
  createCanvas(300, 200);
  // Starts in the middle
  x = width / 2;
  y = height;

  startRecording();
}

function draw() {
  if (frameCount === 60) stopRecording();

  background(200);

  // Draw a circle
  stroke(50);
  fill(100);
  ellipse(x, y, 24, 24);

  // Jiggling randomly on the horizontal axis
  x += random(-1, 1);
  // Moving up at a constant speed
  y -= 1;

  // Reset to the bottom
  if (y < 0) {
    y = height;
  }
}
