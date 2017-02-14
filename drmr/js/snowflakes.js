// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
Snowflakes = (function () {

 "use strict";

 var snowflakes = [];
 var snowflakesDefaultCount = 1000;
 var dynamicSnowflakesCount = true;
 var snowflakeCountIncrement = 0.1;
 var snowflakeRemoveFactor = 2;
 var snowflakeSpritesLocation = "../drmr/res/Snowflakes.png";
 var snowflakeSprites = [];
 var spritesCount = 5;
 var spriteWidth = 20;
 var spriteHeight = 20;

 var bounds = { width: window.innerWidth, height: window.innerHeight };
 var landingBounds;
 var landingProbability = 0.5;

 var minVerticalVelocity = 1;
 var maxVerticalVelocity = 4;
 var minHorizontalVelocity = -1;
 var maxHorizontalVelocity = 3;
 var minScale = 0.2;
 var maxScale = 1.25;
 var minHorizontalDelta = 2;
 var maxHorizontalDelta = 3;
 var minOpacity = 0.2;
 var maxOpacity = 0.9;
 var maxOpacityIncrement = 50;

 var speedCorrectionFrames = 60;
 var currentSpeedCorrectionFrame = 0;
 var speedFactor = 1;
 var minSpeedFactor = 0.1;
 var maxSpeedFactor = 1.5;
 var speedFactorDelta = 0.05;

 var snowHeap = document.getElementById("snowHeap");
 var heapSizeIncrement = 0.00006;
 var minHeapSize = 0.10;
 var maxHeapSize = 0.15;
 var heapSize = minHeapSize;

 function generate(number, add) {
  var image = new Image();
  image.onload = function () {
 for (var numnum = 0; numnum < spritesCount; numnum++) {
  var sprite = document.createElement("canvas");
  sprite.width = spriteWidth;
  sprite.height = spriteHeight;
  var context = sprite.getContext("2d");
  context.drawImage(
   image,
   numnum * spriteWidth,
   0,
   spriteWidth,
   spriteHeight,
   0,
   0,
   spriteWidth,
   spriteHeight);
  snowflakeSprites.push(sprite);
 }

 if (number) {
  snowflakesDefaultCount = number;
 }
 if (!add) {
  snowflakes = [];
 }
 for (var numnum = 0; numnum < snowflakesDefaultCount; numnum++) {
  snowflakes.push(generateSnowflake());
 }
  }
  image.src = snowflakeSpritesLocation;
 }

 function generateSnowflake() {
  var scale = Math.random() * (maxScale - minScale) + minScale;
  return {
 x: Math.random() * bounds.width,
 y: Math.random() * bounds.height,
 vv: Math.random() * (maxVerticalVelocity - minVerticalVelocity) + minVerticalVelocity,
 hv: Math.random() * (maxHorizontalVelocity - minHorizontalVelocity) + minHorizontalVelocity,
 sw: scale * spriteWidth,
 sh: scale * spriteHeight,
 mhd: Math.random() * (maxHorizontalDelta - minHorizontalDelta) + minHorizontalDelta,
 hd: 0,
 hdi: Math.random() / (maxHorizontalVelocity * minHorizontalDelta),
 o: Math.random() * (maxOpacity - minOpacity) + minOpacity,
 oi: Math.random() / maxOpacityIncrement,
 si: Math.ceil(Math.random() * (spritesCount - 1)),
 nl: false
  }
 }

 function isWithinPostcard(x, y) {
  if (x < landingBounds.left) return false;
  if (y < landingBounds.top) return false;
  if (x > landingBounds.right) return false;
  if (y > landingBounds.bottom) return false;
  return true;
 }

 function progressHeapSize() {
  if (heapSize >= maxHeapSize) return;
  heapSize += heapSizeIncrement * speedFactor;
  snowHeap.style.height = heapSize * 100 + "%";
 }

 function advanceSnowFlakes() {
  progressHeapSize();
  for (var numnum = 0; numnum < snowflakes.length; numnum++) {
 var sf = snowflakes[numnum];
 sf.y += sf.vv * speedFactor;
 sf.x += (sf.hd + sf.hv) * speedFactor;   
 sf.hd += sf.hdi;
 if (sf.hd < -sf.mhd || sf.hd > sf.mhd) {
  sf.hdi = -sf.hdi;
 };

 sf.o += sf.oi;
 if (sf.o > maxOpacity || sf.o < minOpacity) { sf.oi = -sf.oi };
 if (sf.o > maxOpacity) sf.o = maxOpacity;
 if (sf.o < minOpacity) sf.o = minOpacity;
 var resetNotLanding = false;
 if (sf.y > bounds.height + spriteHeight / 2) {
  sf.y = 0
  resetNotLanding = true;
 };
 if (sf.y < 0) {
  sf.y = bounds.height
  resetNotLanding = true;
 };
 if (sf.x > bounds.width + spriteWidth / 2) {
  sf.x = 0
  resetNotLanding = true;
 };
 if (sf.x < 0) {
  sf.x = bounds.width
  resetNotLanding = true;
 };
 if (resetNotLanding) { sf.nl = false; }

 if (!sf.nl && isWithinPostcard(sf.x, sf.y)) {
  var chance = Math.random();
  if (chance < landingProbability) {
   SnowPostcard.addSnowmark(
  Math.random() * landingBounds.width,
  Math.random() * landingBounds.height, 
  snowflakeSprites[sf.si]);
   sf.y = 0;
   sf.x = Math.random() * bounds.width;
  } else {
   sf.nl = true;
  }
 }
  }
 }

 function adjustSpeedFactor() {
  if (++currentSpeedCorrectionFrame === speedCorrectionFrames) {
 var lastFps = SystemInformation.getLastFps();
 var targetSpeedFactor = (lastFps * (maxSpeedFactor - minSpeedFactor) / 60) + minSpeedFactor;
 speedFactor += (targetSpeedFactor < speedFactor) ? -speedFactorDelta : speedFactorDelta;
 if (speedFactor > maxSpeedFactor) { speedFactor = maxSpeedFactor; }
 if (speedFactor < minSpeedFactor) { speedFactor = minSpeedFactor; }
 currentSpeedCorrectionFrame = 0;
  }
 }

 function renderFrame(context) {
  advanceSnowFlakes();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  for (var numnum = 0; numnum < snowflakes.length; numnum++) {
 var sf = snowflakes[numnum];
 context.globalAlpha = sf.o;
 context.drawImage(
  snowflakeSprites[sf.si],
  0,
  0,
  spriteWidth,
  spriteHeight,
  sf.x,
  sf.y,
  sf.sw,
  sf.sh);
  }
 }

 function updateBounds() {
  bounds.width = window.innerWidth;
  bounds.height = window.innerHeight;
  landingBounds = SnowPostcard.updateBounds();
 }

 function count() {
  return snowflakes.length;
 }

 function add(number) {
  if (!number) { number = snowflakes.length * snowflakeCountIncrement; }
  generate(number, true);
 }

 function remove(number) {
  if (!number) { number = snowflakes.length * snowflakeCountIncrement * snowflakeRemoveFactor; }
  if (snowflakes.length - number > 0) {
 snowflakes = snowflakes.slice(0, snowflakes.length - number);
  }
 }

 return {
  "generate": generate,
  "add": add,
  "remove": remove,
  "render": renderFrame,
  "count": count,
  "updateBounds": updateBounds,
  "dynamicSnowflakesCount": dynamicSnowflakesCount
 }

})();