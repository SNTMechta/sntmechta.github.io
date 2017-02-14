// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
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