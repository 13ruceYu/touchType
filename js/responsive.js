// RESPONSIVE SIZING --------------------------------------------------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  document.body.style.position = "fixed";
  document.body.style.padding = 0;
  document.body.style.margin = 0;
  document.body.style.overflow = "hidden";
}

// TOUCH DEVICE METHODS FOR BLOCKING DEFAULT PINCH GESTURES ------------------------------------------------------------------

// prevent zoom gesture in safari
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
  document.body.style.zoom = 0.99999;
}
);

document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
  document.body.style.zoom = 0.99999;
}
);

document.addEventListener('gestureend', function (e) {
  e.preventDefault();
  document.body.style.zoom = 1.0;
}
);

// CHECK DEVICE TYPE ------------------------------------------------------------------

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function enableTool() {
  document.getElementById("sorry").style.visibility = "hidden";
  document.getElementById("sorryInfo").style.visibility = "hidden";
  document.getElementById("question").style.visibility = "visible";
  document.getElementById("reset").style.visibility = "visible";
  document.getElementById("download").style.visibility = "visible";
  document.getElementById("glyphWeight").style.visibility = "visible";

  angleMode(DEGREES);
  MT_GUI = new MultiTouch_GUI();
  glyphs.push(new Glyph(width / 2, height / 2));
  setActiveGlyph(glyphs[glyphs.length - 1]);
}

function disableTool() {
  document.getElementById("sorry").style.visibility = "visible";
  document.getElementById("sorryInfo").style.visibility = "visible";
  //document.getElementById("question").style.visibility = "hidden";
  document.getElementById("reset").style.visibility = "hidden";
  document.getElementById("download").style.visibility = "hidden";
  document.getElementById("glyphWeight").style.visibility = "hidden";
}



