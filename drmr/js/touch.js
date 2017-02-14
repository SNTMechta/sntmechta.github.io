// https://github.com/MicrosoftEdge/Demos/tree/master/letitsnow
Touch = (function () {    
    "use strict";
function preventEvents(evtObj) {
 /*
  if (evtObj.preventDefault)
   evtObj.preventDefault();
  if (evtObj.preventManipulation)
   evtObj.preventManipulation();
  if (evtObj.preventMouseEvent)
   evtObj.preventMouseEvent();
 */
    }
return {"preventEvents": preventEvents}})();