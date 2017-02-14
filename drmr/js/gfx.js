// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
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
  // start angle
   0,
  // finish angle
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
   // image
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