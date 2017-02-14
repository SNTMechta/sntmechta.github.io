// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
Animation = (function () {

 "use strict";

 var frameRenderersCollection = [];
 var renderContextesCollection = [];
 var isRunning = false;
 var animationCallback;
 // if browser doesn't support requestAnimationFrame - we use setInterval for 60Hz displays (16.7ms per frame)
 var minInterval = 16.7;
 function addFrameRenderer(frameRender, renderContext) {
  if (frameRender && typeof (frameRender) === "function") {
   frameRenderersCollection.push(frameRender);
   renderContextesCollection.push(renderContext);
  }
 }
 function getRequestAnimationFrame(code) {
  if (window.requestAnimationFrame) {
   return window.requestAnimationFrame(code);
  } else if (window.msRequestAnimationFrame) {
   return window.msRequestAnimationFrame(code);
  } else if (window.webkitRequestAnimationFrame) {
   return window.webkitRequestAnimationFrame(code);
  } else if (window.mozRequestAnimationFrame) {
   return window.mozRequestAnimationFrame(code);
  } else {
   return setTimeout(code, minInterval);
  }
 }

 function frameRenderCore() {

  for (var numnum = 0; numnum < frameRenderersCollection.length; numnum++) {
   if (frameRenderersCollection[numnum]) {
    frameRenderersCollection[numnum](renderContextesCollection[numnum]);
   }
  }

  if (isRunning) {
   animationCallback = getRequestAnimationFrame(frameRenderCore);
  }}

 function start() {
  if (isRunning) return;
  animationCallback = getRequestAnimationFrame(frameRenderCore);
  isRunning = true;
 }

 function stop() {
  if (!isRunning) return;
  clearInterval(animationCallback);
  isRunning = false;
 }

 function toggle() {
  var playbackControl = (isRunning) ? stop : start;
  playbackControl();
 }

 return {
  "addFrameRenderer": addFrameRenderer,
  "start": start,
  "stop": stop,
  "toggle": toggle,
  "getRequestAnimationFrame": getRequestAnimationFrame
 }

})();