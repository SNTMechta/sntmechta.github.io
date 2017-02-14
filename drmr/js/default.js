// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
(function () {
 "use strict";

 var defaultMusicTrack = "../drmr/res/LetItSnowShort.mp3";
 var defaultSnowmanImage = "../drmr/res/Snowman.png";
 var musicIsPlaying = true;
 var togglePlaybackCode = 112;
 var toggleSoundButton = document.getElementById("toggleSoundButton");

 var snowflakesCanvas = document.getElementById("snowflakesCanvas");
 var snowflakesContext = document.getElementById("snowflakesCanvas").getContext("2d");
 var backgroundGradientCanvas = document.getElementById("backgroundGradient");
 var backgroundGradientContext = backgroundGradientCanvas.getContext("2d");
 var siSnowflakesCount = document.getElementById("siSnowflakesCount");
 var postcard = document.getElementById("postcard");
 var music = document.getElementById("music");
 var snowman = document.getElementById("snowman");

 function resizeCanvasElements() {
  SnowPostcard.updateBounds();
  Snowflakes.updateBounds();
  snowflakesCanvas.width = window.innerWidth;
  snowflakesCanvas.height = window.innerHeight;
  backgroundGradientCanvas.width = window.innerWidth + 400;
  backgroundGradientCanvas.height = window.innerHeight + 400;
 }

 function pauseMusic() {
   music.pause();
   musicIsPlaying = false;
   toggleSoundButton.innerHTML = "Включить звук!";
 }

 function playMusic() {
   music.play();
   musicIsPlaying = true;
   toggleSoundButton.innerHTML = "Приостановить звук!";
 }

 function toggleMusic() {
  musicIsPlaying ? pauseMusic() : playMusic();
 }

 toggleSoundButton.addEventListener("click", toggleMusic);

 document.addEventListener("DOMContentLoaded", function () {
  SnowPostcard.show();
  var snowflakesCountSelect = document.getElementById("siSnowflakes");
  snowflakesCountSelect.addEventListener("change", function (evt) {
   var value = evt.target.options[evt.target.selectedIndex].value;
   if (value) {
    Snowflakes.dynamicSnowflakesCount = (value === "auto");
    if (!Snowflakes.dynamicSnowflakesCount) {
     Snowflakes.generate(parseInt(value));
     siSnowflakesCount.textContent = "";
    }
   }
  }, true);

  SystemInformation.post(SystemInformation.getInformation());
  Snowflakes.generate(250);
  resizeCanvasElements();
  Animation.addFrameRenderer(Snowflakes.render, snowflakesContext);
  Animation.addFrameRenderer(Gradient.render, backgroundGradientContext);
  Animation.start();
 });

 window.addEventListener("resize", function () {
  SystemInformation.post({ width: window.innerWidth, height: window.innerHeight });
  resizeCanvasElements();
 });

})();