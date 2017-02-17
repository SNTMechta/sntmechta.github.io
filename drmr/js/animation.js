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

/* <-> touch.js <-> */
Touch = (function () {
"use strict";
function preventEvents(evtObj) {}
return {"preventEvents": preventEvents}
})();

/* <-> systemInformation.js <->*/
SystemInformation = (function () {
 "use strict";
 var siSnowflakes = document.getElementById("siSnowflakesCount");
function getInformation() {
 var information = {};
 information.width = window.innerWidth;
 information.height = window.innerHeight;
 return information;
}
function post(info) {
 if (!info) return;
 if (info.width && info.height) { siResolution.textContent = info.width + "x" + info.height; }
  if (info.snowflakes) {
 if (Snowflakes.dynamicSnowflakesCount) {
  siSnowflakes.textContent = info.snowflakes;
 }
 }
}
return {
 "post": post,
 "getInformation": getInformation,
}
})();

/* <-> gradient.js <-> */
var Gradient = (function () {
 "use strict";
 var minMovingStop = 0.25;
 var maxMovingStop = 0.80;
 var movingStopIncrement = 0.0001;
 var currentMovingStop = minMovingStop;
 var holidayLights = [[0.75, 0.75, 0.75], [0.9, 0.9, 0.9], [0.5, 0.5, 0.5]];
 var redIntensity = holidayLights[0][0];
 var greenIntensity = holidayLights[0][1];
 var blueIntensity = holidayLights[0][2];
 var currentHolidayLight = 0;

 function nextColor() {
  if (++currentHolidayLight >= holidayLights.length) {
currentHolidayLight = 0;
  }
  redIntensity = holidayLights[currentHolidayLight][0];
  greenIntensity = holidayLights[currentHolidayLight][1];
  blueIntensity = holidayLights[currentHolidayLight][2];
 }

 function renderFrame(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  var gradient = context.createRadialGradient(
context.canvas.width / 2,
0,
0,
context.canvas.width / 2,
context.canvas.height,
context.canvas.height * 1.5);

  var colorMidStopElement = Math.ceil(255 * (1 - currentMovingStop / 2));
  var colorStopElement = Math.ceil(255 * (1 - currentMovingStop));
  var colorStart = "rgba(255,255,255," + currentMovingStop + ")"
  var colorMidStop = "rgba(" +
Math.ceil(colorMidStopElement * redIntensity) + ", " +
Math.ceil(colorMidStopElement * greenIntensity) + ", " +
Math.ceil(colorMidStopElement * blueIntensity) + ", " +
currentMovingStop / 1.25 + ")";
  var colorStop = "rgba(" +
Math.ceil(colorStopElement * redIntensity) + ", " +
Math.ceil(colorStopElement * greenIntensity) + ", " +
Math.ceil(colorStopElement * blueIntensity) + ", " +
currentMovingStop / 1.25 + ")";    
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(currentMovingStop / 2, colorMidStop);
  gradient.addColorStop(currentMovingStop, colorStop);
  currentMovingStop += movingStopIncrement;
  if (currentMovingStop >= maxMovingStop ||
currentMovingStop <= minMovingStop) {
movingStopIncrement = -movingStopIncrement;
if (movingStopIncrement > 0) nextColor();
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
 }
 return {
  "render": renderFrame
 }
})();

/* <-> gfx.js <-> */
var Gfx = (function () {
 "use strict";
 var brushRadius = 30;
 var clearingBrush;

 function createClearingBrush() {
  clearingBrush = document.createElement("canvas");
  clearingBrush.width = brushRadius * 2;
  clearingBrush.height = brushRadius * 2;
  var context = clearingBrush.getContext("2d");
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(
   brushRadius,
   brushRadius,
   brushRadius,
   0,
   2 * Math.PI,
   true);
  context.fill();
 }

 createClearingBrush();

 function renderPath(path, options) {
  var c = options.context;
  setRenderOptions(options);
  for (var num = 0; num < path.length; num++) {
   c.drawImage(
    clearingBrush,   
    path[num].x - brushRadius / 2,
    path[num].y - brushRadius / 2);
  }
 }

 function getDefaultRenderOptions() {
  var ro = {};
  ro.clearContext = true;
  ro.fillStyle = "#000000";
  ro.lineWidth = 5;
  ro.lineCap = "round";
  ro.lineJoin = "round";
  ro.shadowOffsetX = 0;
  ro.shadowOffsetY = 0;
  ro.shadowBlur = 10;
  ro.shadowColor = "#000000";
  ro.globalCompositeOperation = "source-over";
  ro.globalAlpha = "1.0";
  return ro;
 }

 function setRenderOptions(ro) {
  if (!ro || !ro.context)
   return;
  var c = ro.context;
  c.fillStyle = ro.fillStyle;
  c.lineWidth = ro.lineWidth;
  c.lineCap = ro.lineCap;
  c.lineJoin = ro.lineJoin;
  c.shadowOffsetX = ro.shadowOffsetX;
  c.shadowOffsetY = ro.shadowOffsetY;
  c.shadowBlur = ro.shadowBlur;
  c.shadowColor = ro.shadowColor;
  c.globalCompositeOperation = ro.globalCompositeOperation;
  c.globalAlpha = ro.globalAlpha;
 }

 function composeLayers(compositionPipeline, compositionOptions) {
  if (!compositionPipeline ||
   !compositionPipeline.length ||
   !compositionPipeline.length > 1)
   return;
  var cp = compositionPipeline, co = compositionOptions,
   c = compositionPipeline[0];
  if (c.save) c.save();
  for (var num = 1; num < cp.length; num++) {
   if (co[num]) {
    c.globalCompositeOperation = co[num];
   }
   c.drawImage(cp[num], 0, 0);
  }
  if (c.restore) c.restore();
 }
 return {
  "renderPath": renderPath,
  "getDefaultRenderOptions": getDefaultRenderOptions,
  "setRenderOptions": setRenderOptions,
  "composeLayers": composeLayers
 }
})();

/* <-> classes.js <-> */
Classes = (function () {
 "use strict";
 var _classesSeparator = " ";
 function _splitClasses(classesString) {
  return classesString.split(_classesSeparator);
 }
 function _joinClasses(classes) {
  return classes.join(_classesSeparator);
 }
 function _indexInClasses(className, classes) {
  if (!className || !classes || !classes.length)
   return false;
  return classes.indexOf(className);
 }
 function has(object, className) {
  if (!object || !object.className || !className)
   return;
  var cs = _splitClasses(object.className);
  return (_indexInClasses(className, cs) >= 0);
 }
 function add(object, className) {
  if (!object || !className)
   return;
  if (!object.className) {
   object.className = className;
  } else {
   var cs = _splitClasses(object.className);
   if (_indexInClasses(className, cs) === -1)
    cs.push(className);
   object.className = _joinClasses(cs);
  }
  return object.className;
 }
 function remove(object, className) {
  if (!object || !object.className || !className)
   return;
  if (object.className === className) {
   object.className = "";
  } else {
   var cs = _splitClasses(object.className);
   cs.splice(_indexInClasses(className, cs), 1);
   object.className = _joinClasses(cs);
  }
  return object.className;
 }
 function toggle(object, className) {
  if (!object || !className)
   return;
  if (has(object, className)) {
   remove(object, className);
  } else {
   add(object, className);
  }
 }
 return {
  "add": add,
  "remove": remove,
  "has": has,
  "toggle": toggle,
  "names": {
   "hidden": "hidden"
  }
 }
})();