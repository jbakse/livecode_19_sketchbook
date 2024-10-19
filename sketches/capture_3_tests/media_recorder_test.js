// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let stream, mediaRecorder;
function setup() {
  createCanvas(640, 360);
  frameRate(10);
  startRecording();
}

function draw() {
  background("gray");
  noStroke();
  fill("black");
  ellipse(map(frameCount, 1, 91, 0, width), height / 2, 200, 200);

  if (frameCount === 91) {
    mediaRecorder.stop();
    noLoop();
  }
  // capture the frame
  stream.getTracks()[0].requestFrame();

  // resume for 1 frames time, then pause again, trick the recording into thinking the frames are 30fps
  mediaRecorder.resume();
  setTimeout(() => {
    mediaRecorder.pause();
  }, 1000 / 30);
}

function startRecording() {
  // from https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
  const canvas = document.querySelector("canvas");

  // Optional frames per second argument.
  stream = canvas.captureStream(0);
  const recordedChunks = [];

  console.log(stream);
  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  mediaRecorder.pause();

  function handleDataAvailable(event) {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log(recordedChunks);
      download();
    } else {
      // …
    }
  }
  function download() {
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "mediarecorder_test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // demo: to download after 9sec
  // setTimeout((event) => {
  //   console.log("stopping");
  //   mediaRecorder.stop();
  // }, 3000);
}
