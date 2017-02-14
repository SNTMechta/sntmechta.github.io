// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
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