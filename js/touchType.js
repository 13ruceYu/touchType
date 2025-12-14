

var MT = new MultiTouch();
var MT_GUI;
var activeInput = false;
var glyphs = [];

var activeGlyph;
var activeGlyphOnFocus = false;

var glyphWeightDefault = 7;
var glyphWeight = glyphWeightDefault;
var glyphWeightMin = 1;
var glyphWeightMax = 50;
var glyphWeightInc = 50;

var bgColor;
var textColor;
var textColorMute;
var textColorFocus;

var black;
var white;
var grey;
var green;

//--------------------------------------------------

function preload() {
  black = color(0);
  white = color(255);
  grey = color(100);
  green = color(0, 255, 0);
  bgColor = black;
  textColor = white;
  textColorMute = grey;
  textColorFocus = green;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.body.style.backgroundColor = bgColor;
    document.getElementById("glyphWeight").value = map(glyphWeight, glyphWeightMin, glyphWeightMax, 0, 100);
  if (isTouchDevice() == false) {
    disableTool();
  } else {
    enableTool();
  }
}

function draw() {
  MT.update();
  background(bgColor);
  for (var i = 0; i < glyphs.length; i++) glyphs[i].display();
  if (activeGlyph != null) activeGlyph.display();
  if (touches.length > 0 && activeGlyph != null && MT.hold) {
    MT_GUI.display();
  }
}

//--------------------------------------------------

function addGlyph(x, y) {
  if (activeGlyph != null) {
    activeGlyph.active = false;
    activeGlyph.focus = false;
  }
  glyphs.push(new Glyph(x, y));
  activeGlyph = glyphs[glyphs.length - 1];
}

function deleteGlyph(i) {
  if (glyphs.length > 0) {
    glyphs.splice(i, 1);
    for (var j = i; j < glyphs.length; j++) {
      glyphs[j].index = j;
    }

    MT.holdCounter = 0;
    MT.releasedCounter = 0;
    MT.hold = false;
    MT.tapped = false;
    MT.released = true;

    if (glyphs.length > 0) {
      activeGlyph = glyphs[glyphs.length - 1];
      activeGlyph.active = true;
    } else {
      activeGlyph = null;
    }
  }
}

function setActiveGlyph(glyph) {
    if (glyph == null) {
    activeGlyph.active = false;
    activeGlyph.focus = false;
    activeGlyph = null;
  } else {
    if (activeGlyph != null && glyph != activeGlyph) {
      activeGlyph.active = false;
      activeGlyph.focus = false;
    }
    activeGlyph = glyph;
    activeGlyph.active = true;
  }
}

function setGlyphWeight(value) {
  glyphWeight = map(value, 0, 100, glyphWeightMin, glyphWeightMax);
  glyphWeight = constrain(glyphWeight, glyphWeightMin, glyphWeightMax);
}

function startInput() {
activeInput = true;
}

function endInput() {
activeInput = false;
}

//--------------------------------------------------

function reset() {
  glyphWeight = glyphWeightDefault;
  background(bgColor);
  glyphs = [];
  glyphs.push(new Glyph(width / 2, height / 2));
  setActiveGlyph(glyphs[glyphs.length - 1]);
}

//--------------------------------------------------

function saveIMG() {
  let filename = "IMG_" + year() + '-' + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + '_' + round(millis()) + ".png";
  background(bgColor);
  for (var i = 0; i < glyphs.length; i++) {
    let activeStatus = glyphs[i].active;
    let focusStatus = glyphs[i].focus;
    glyphs[i].active = true;
    glyphs[i].focus = false;
    glyphs[i].display();
    glyphs[i].active = activeStatus;
    glyphs[i].focus = focusStatus;
  }
  saveCanvasToServer(filename);
}

function saveCanvasToServer(filename) {
  var canvasData = document.getElementById('defaultCanvas0').toDataURL('image/png');
  var formData = new FormData();
  var blob = dataURLtoBlob(canvasData);
  formData.append('imageData', blob, filename);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log('Image saved.');
      save(filename);
    }
  };
  xhttp.open("POST", "saveImage.php", true);
  xhttp.send(formData);
}

function dataURLtoBlob(dataURL) {
  var arr = dataURL.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}