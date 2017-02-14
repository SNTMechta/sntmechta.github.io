// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
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

 // get personalized greeting message
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