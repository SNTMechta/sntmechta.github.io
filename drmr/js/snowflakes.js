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

/* <-> postcard.js <-> */
SnowPostcard = (function () {
 "use strict";
 var postcardContainer = document.getElementById("postcardContainer");
 var postcard = document.getElementById("postcard");
 var hint = document.getElementById("hint");
 var csContext;
 var csCanvas;
 var csPathContext;
 var csPathCanvas;
 var snowCanvas;
 var snowContext;
 var bounds;
 var fixedImageBottom = 305;
 var fixedImageWidth = 475;
 var fixedImageHeight = 314;
 var fixedImageMarginLeft = 30;
 var pointerDown = false;
 var stroke = [];
 var defaultImageLocation = "../drmr/img/Dreamr.png";
 function show() {
  createCompositePhoto();
  showHint();
 }
 function showHint() {
  hint.style.opacity = 1.0;
 }
 function hideHint() {
  hint.style.opacity = 0;
 }
 function requestFrameRender() {
  Animation.getRequestAnimationFrame(renderCompositePhoto);
 }
 function getPersonalizedMessage() {
  var imageLocation = defaultImageLocation;
  var separatorIndex = window.location.href.indexOf('?');
  if (separatorIndex > 0) {
   var imageFilename = window.location.href.slice(separatorIndex + 1);
   if (imageFilename.length === 10) {
    imageLocation = "../drmr/img/" + imageFilename + ".png";
   }
  }
  return imageLocation;
 }
 function renderCompositePhoto() {
  var ro = Gfx.getDefaultRenderOptions();
  ro.context = csPathContext;
  Gfx.renderPath(stroke, ro);
  stroke = [];
  var pipeline = [
     csContext,
     snowCanvas,
     csPathCanvas];
  var composeOptions = ["", "", "destination-out"];
  Gfx.composeLayers(pipeline, composeOptions);
 }
 function createPhotoImage(imageSrc) {
  var image = document.createElement("img");
  image.id = "personalizedGreeting";
  image.onload = function () {
   postcard.appendChild(image);
  }
  image.src = getPersonalizedMessage();
 }
 function createCanvas() {
  var canvas = document.createElement("canvas");
  canvas.width = postcard.clientWidth;
  canvas.height = postcard.clientHeight;
  return canvas;
 }
 function createSnowImage() {
  snowCanvas = createCanvas();
  snowCanvas.id = "snowCanvas"
  snowContext = snowCanvas.getContext("2d");
  snowContext.fillStyle = "rgba(255, 255, 255, 1.0)";
  snowContext.fillRect(
   0,
   0,
   snowCanvas.width,
   snowCanvas.height);
 }
 function createClearedSnow() {
  csPathCanvas = createCanvas();
  csPathContext = csPathCanvas.getContext("2d");
  csCanvas = createCanvas();
  csCanvas.className = "clearedSnowCanvas";
  postcard.appendChild(csCanvas);
  csContext = csCanvas.getContext("2d");
 }
 function calcOffset(evt) {
  return {
   x: evt.clientX - bounds.left,
   y: evt.clientY - bounds.top
  }
 }
 function pointerDownHandler(evt) {
  hideHint();
  Touch.preventEvents(evt);
  pointerDown = true;
  stroke.push(calcOffset(evt));
  requestFrameRender();
 }
 function pointerMoveHandler(evt) {
  Touch.preventEvents(evt);
  if (evt.buttons > 0) { pointerDown = true; }
  if (pointerDown) {
   stroke.push(calcOffset(evt));
   requestFrameRender();
  }
 }
 function pointerUpHandler(evt) {
  Touch.preventEvents(evt);
  pointerDown = false;
  stroke = [];
 }
 function createCompositePhoto() {
  if (postcard.childNodes.length > 1) {
   postcard.innerHTML = ""
  };
  createSnowImage();
  createClearedSnow();
  createPhotoImage();
  renderCompositePhoto();
  if (window.navigator.msPointerEnabled) {
   postcardContainer.addEventListener("MSPointerDown", pointerDownHandler);
   postcardContainer.addEventListener("MSPointerUp", pointerUpHandler);
   postcardContainer.addEventListener("MSPointerCancel", pointerUpHandler);
   postcardContainer.addEventListener("MSPointerMove", pointerMoveHandler);
  } else {
   postcardContainer.addEventListener("mousedown", pointerDownHandler);
   postcardContainer.addEventListener("mouseup", pointerUpHandler);
   postcardContainer.addEventListener("mouseleave", pointerUpHandler);
   postcardContainer.addEventListener("mousemove", pointerMoveHandler);
  }
 }
 function addSnowmark(x, y, image) {
  var minScale = 0.5;
  var maxScale = 2;
  var scale = Math.random() * (maxScale - minScale) + minScale;
  var w = image.width;
  var h = image.height;
  var minOpacity = 0.3;
  var maxOpacity = 0.9;
  csPathContext.globalAlpha = Math.random() * (maxOpacity - minOpacity) + minOpacity;
  csPathContext.globalCompositeOperation = "destination-out";
  csPathContext.drawImage(
   image,
   0,
   0,
   w,
   h,
   x - w / 2,
   y - h / 2,
   w * scale,
   h * scale);
  requestFrameRender();
 }
 function updateBounds() {
  bounds = {
   width: fixedImageWidth,
   height: fixedImageHeight,
   left: (window.innerWidth - fixedImageWidth + fixedImageMarginLeft) / 2,
   right: (window.innerWidth + fixedImageWidth + fixedImageMarginLeft) / 2,
   top: window.innerHeight - (fixedImageHeight + fixedImageBottom),
   bottom: window.innerHeight - fixedImageBottom
  }
  return bounds;
 }
 return {
 "show": show,
 "addSnowmark": addSnowmark,
 "updateBounds": updateBounds,
 "defaultImage": defaultImageLocation,
 };
})();
