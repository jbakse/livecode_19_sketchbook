When I built grabber_01 and grabber_02, I used webm-writer-0.3.0.js
https://github.com/thenickdude/webm-writer-js

This library uses canvas.toDataURL() to export frames to WebP. WebP was supported on only Chrome, and now also on Firefox, but not everywhere (safari, node). Also, i think webm writer is using the webp images as frames in the webm directly so temporal compression is not possible. The resulting file size would be larger than you'd want. Thats part of what I want to test and improve (if necessary.

I then looked to see what libraries for this were on Github. An ideal library would allow encode on the fly for memory efficiency, non-realtime rendering, manually triggering frame capture, and WebM and MP4 export.

webm-writer-js
https://github.com/thenickdude/webm-writer-js
4 years old. Still on 0.3.0
Works well for grabber_02

webm-muxer
https://github.com/Vanilagy/webm-muxer
recent
Uses WebCodecs API. Looks promising. Specifically mentions advantages over webm-writer.
Update: demo app works great on simple test. Looks like we get a properly compressed video and the resource overhead is low. Code isn't hacky!

CCapture
https://github.com/spite/ccapture.js
4 years old
Highly starred, ues webm-writer under the hood

render-video
https://github.com/ziyunfei/render-video?tab=readme-ov-file
2 years old.
Uses WebCodecs API. Looks promising.

Canvas Recorder
https://github.com/SMUsamaShah/CanvasRecorder?tab=readme-ov-file
5 years old
Uses MediaStream and MediaRecorder. Captures realtime only. Good example source.

Canvas Video Recorder
https://github.com/zb3/CanvasVideoRecorder
9 years old
Requires backend.

fast-image-sequence
https://github.com/mediamonks/fast-image-sequence
recent
For image sequence playback, not relevant.

## Approaches

MediaStream/MediaRecorder
https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream
https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

It appears that media recorder doesn't support fixed framerate playback from non-realtime renders:
https://github.com/w3c/mediacapture-record/issues/213
https://github.com/w3c/mediacapture-fromelement/issues/28#issuecomment-974580904

Hack: pausing the recorder during renders and resuming for 1/fps seems to work.
https://stackoverflow.com/questions/41093389/how-to-edit-webm-blobs-captured-by-chrome-mediarecorder/41275515#41275515

WebCodecs API

webm-writer style
get WebPs and stack into WebM

## Evaluating Output

ffprobe (from ffmpeg) can give details on the video file

```bash
ffprobe -v quiet -print_format json -show_streams -show_frames "test (6).webm"
```

## Result

I built three tests

### webm-writer-js

good timestamps
slow at export finalize
largest output filesize
buffers full uncomressed frames

### No library MediaStream

okay timestamps with hack
very quick at export finalize
medium output filesize

### webm-muxer (clear winnner)

perfect timestamps
very quick at export finalize
small and configurable output filesize
(might be able to use mp4-muxer easily for more flexibility on browser support and output)
buffer is encoded/compressed?
