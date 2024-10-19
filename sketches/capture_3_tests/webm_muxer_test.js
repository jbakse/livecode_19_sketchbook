// require https://cdn.jsdelivr.net/npm/webm-muxer@5.0.2/build/webm-muxer.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// Web APIs
// canvas -> VideoFrame -> VideoEncoder ->
// WebMMuxer
// -> addVideoChunk ->

console.log(WebMMuxer);

let muxer = new WebMMuxer.Muxer({
  target: new WebMMuxer.ArrayBufferTarget(),
  video: {
    codec: "V_VP9",
    width: 1280,
    height: 720,
  },
});

let videoEncoder = new VideoEncoder({
  output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
  error: (e) => console.error(e),
});
videoEncoder.configure({
  codec: "vp09.00.10.08",
  width: 1280,
  height: 720,
  bitrate: 1e6,
});

function setup() {
  pixelDensity(1);
  createCanvas(1280, 720);
  frameRate(10);
}

function draw() {
  background("gray");
  noStroke();
  fill("black");
  ellipse(map(frameCount, 1, 91, 0, width), height / 2, 200, 200);

  const t = (frameCount - 1) / 30;

  const frame = new VideoFrame(canvas, {
    timestamp: t * 1000 * 1000,
  });

  //key frames every 30 frames
  videoEncoder.encode(frame, { keyFrame: frameCount % 30 === 1 });
  frame.close();

  if (frameCount === 91) {
    noLoop();
    endRecording();
  }
}

async function endRecording() {
  await videoEncoder.flush();
  muxer.finalize();

  let { buffer } = muxer.target;

  console.log("buffer", buffer);

  downloadBlob(new Blob([buffer]));
}

const downloadBlob = (blob) => {
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "webm_muxer_test.webm";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
