class MultiTouch {

  constructor() {
    this.ptouches = [];

    this.hold = false;
    this.tapped = false;
    this.released = false;

    this.releasedCounter = 0;
    this.releasedCounterMax = 1;

    this.tapCounter = 0;
    this.tapCounterMax = 15;
    this.tapOnce = false;
    this.tapTwice = false;
    this.tapThrice = false;

    this.holdCounter = 0;
    this.holdCounterMax = 5;
    this.hold1 = false;
    this.hold2 = false;
    this.hold3 = false;
    this.hold4 = false;
    this.hold5 = false;

    this.moved1 = false;
    this.moved2 = false;
    this.moved3 = false;
    this.moved4 = false;
    this.moved5 = false;

    this.maxTouches = 3;

    this.touchSize = 80;

    this.lastActivity = 0;
    this.waitForInactive = 50;
    this.lerpToInactive = 50;

  }

  //----------

  update() {
    if (this.released == true) this.checkRelease();
    if (this.tapped && !this.hold) this.checkTap();
    else if (this.hold && this.holdCounter >= this.holdCounterMax) this.checkHold();
    this.tapCounter++;

    if (frameCount - this.lastActivity < this.waitForInactive) {
      textColorMute = grey;
      textColorFocus = green;
    } else if (frameCount - this.lastActivity < this.waitForInactive + this.lerpToInactive) {
      let value = map(frameCount - this.lastActivity, this.waitForInactive, this.waitForInactive + this.lerpToInactive, 0.0, 1.0);
      textColorMute = lerpColor(grey, white, value);
      textColorFocus = lerpColor(green, white, value);
    } else {
      textColorMute = white;
      textColorFocus = white;
    }
  }

  updatePTouch() {
    this.ptouches = [];
    for (var i = 0; i < touches.length; i++) {
      this.ptouches.push(touches[i]);
    }
  }

  //----------

  checkTap() {
    if (this.tapThrice == true) {
      this.tappedThrice();
      this.tapThrice = false;
      this.tapTwice = false;
      this.tapOnce = false;
      this.lastActivity = frameCount;
    } else if (this.tapTwice == true && this.tapCounter > this.tapCounterMax) {
      this.tappedTwice();
      this.tapTwice = false;
      this.tapOnce = false;
      this.lastActivity = frameCount;
    } else if (this.tapOnce == true && this.tapCounter > this.tapCounterMax) {
      this.tappedOnce();
      this.tapOnce = false;
      this.lastActivity = frameCount;
    }
  }

  checkHold() {
    if (this.hold5) {
      this.movedFive();
      this.hold4 = false;
      this.hold3 = false;
      this.hold2 = false;
      this.hold1 = false;
      this.lastActivity = frameCount;
    } else if (this.hold4) {
      this.movedFour();
      this.hold5 = false;
      this.hold3 = false;
      this.hold2 = false;
      this.hold1 = false;
      this.lastActivity = frameCount;
    } else if (this.hold3) {
      this.movedThree();
      this.hold5 = false;
      this.hold4 = false;
      this.hold2 = false;
      this.hold1 = false;
      this.lastActivity = frameCount;
    } else if (this.hold2) {
      this.movedTwo();
      this.hold5 = false;
      this.hold4 = false;
      this.hold3 = false;
      this.hold1 = false;
      this.lastActivity = frameCount;
    } else if (this.hold1) {
      this.hold5 = false;
      this.hold4 = false;
      this.hold3 = false;
      this.hold2 = false;
      this.lastActivity = frameCount;
      this.movedOne();
    }
  }

  checkRelease() {
    this.releasedCounter++;
    if (this.releasedCounter >= this.releasedCounterMax) {
      this.released = false;
      this.releasedCounter = 0;
    }
  }

  //----------

  tappedOnce() {
    //print("Tapped 1 times");
    if (this.ptouches[0] != null) {

      if (isPositionOverUI(this.ptouches[0].x, this.ptouches[0].y) == false) {

        let hoveredGlyph = getGlyphAtPosition(this.ptouches[0].x, this.ptouches[0].y);
        if (hoveredGlyph != null) {
          setActiveGlyph(hoveredGlyph);
        } else {
          if (activeGlyph != null && activeGlyph.focus == true) {
            activeGlyph.focus = false;
          }
        }
      }
    } else {

      if (isPositionOverUI(tapX, tapY) == false) {

        let hoveredGlyph = getGlyphAtPosition(tapX, tapY);
        if (hoveredGlyph != null) {
          setActiveGlyph(hoveredGlyph);
        } else {
          if (activeGlyph != null && activeGlyph.focus == true) {
            activeGlyph.focus = false;
          }
        }
      }
    }
  }

  tappedTwice() {
    //print("Tapped 2 times");
    if (this.ptouches[0] != null) {
      if (isPositionOverUI(this.ptouches[0].x, this.ptouches[0].y) == false) {
        addGlyph(this.ptouches[0].x, this.ptouches[0].y);
      }
    } else {
      if (isPositionOverUI(tapX, tapY) == false) {
        let hoveredGlyph = getGlyphAtPosition(tapX, tapY);
        if (hoveredGlyph != null && hoveredGlyph.active == true) {
          hoveredGlyph.focus = !hoveredGlyph.focus;
        } else {
          addGlyph(tapX, tapY);
        }
      }
    }
  }

  tappedThrice() {
    //print("Tapped 3 times");
  }

  //----------

  movedOne() {
    if (this.moved1 == false) {
      //print("Moved 1");
    } else {
      if (isPositionOverUI(touches[0].x, touches[0].y) == false) {
        if (activeGlyph != null) {
          if (activeGlyph.focus == false) {
            var direction = p5.Vector.sub(createVector(touches[0].x, touches[0].y), createVector(this.ptouches[0].x, this.ptouches[0].y));
            if ((abs(direction.x) + abs(direction.y)) > 100) {
              deleteGlyph(activeGlyph.index);
            } else {
              activeGlyph.updatePosition(touches[0], this.ptouches[0], touches[0], this.ptouches[0]);
            }
          }
        }
      }
    }
    this.moved1 = true;
  }

  movedTwo() {
    if (this.moved2 == false) {
      MT_GUI.prevSize = activeGlyph.size;
      //print("Moved 2");
    } else {
      if (activeGlyph.focus == true) {
        activeGlyph.updatePar1(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar2(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar3(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar4(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
      } else {
        activeGlyph.updatePosition(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updateRotation(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updateSize(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
      }
    }
    this.moved2 = true;
  }

  movedThree() {
    if (this.moved3 == false) {
      //print("Moved 3");
    } else {
      if (activeGlyph.focus == true) {
        activeGlyph.updatePar1(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar2(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar3(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
        activeGlyph.updatePar4(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
      } else {
        activeGlyph.updateLetter(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
      }
    }
    this.moved3 = true;
  }

  movedFour() {
    if (this.moved4 == false) {
      //print("Moved 4");
    } else {
      this.movedThree();
      // activeGlyph.updatePar1(touches[0], this.ptouches[0], touches[1], this.ptouches[1], touches[2], this.ptouches[2], touches[3], this.ptouches[3]);
      // activeGlyph.updatePar2(touches[0], this.ptouches[0], touches[1], this.ptouches[1], touches[2], this.ptouches[2], touches[3], this.ptouches[3]);
      // activeGlyph.updatePar3(touches[0], this.ptouches[0], touches[1], this.ptouches[1]);
      // activeGlyph.updatePar4(touches[0], this.ptouches[0], touches[1], this.ptouches[1], touches[2], this.ptouches[2], touches[3], this.ptouches[3]);
    }
    this.moved4 = true;
  }

  movedFive() {
    if (this.moved5 == false) {
      //print("Moved 5");
    } else {
      this.movedThree();
      // activeGlyph.updateStrokeWeight(touches[0], this.ptouches[0], touches[1], this.ptouches[1], touches[2], this.ptouches[2], touches[3], this.ptouches[3], touches[4], this.ptouches[4]);
    }
    this.moved5 = true;
  }
}

//--------------------------------------------------------------------------------

var testTimer = 0;

function touchStarted() {
  //print("Touch started");
  if (touches.length == 1) {
    if (MT.tapTwice == true && MT.tapCounter <= MT.tapCounterMax) {
      MT.tapThrice = true;
    } else if (MT.tapOnce == true && MT.tapCounter <= MT.tapCounterMax) {
      MT.tapTwice = true;
    } else if (MT.tapOnce == false) {
      MT.tapOnce = true;
    }
    MT.tapCounter = 0;
  }

  MT.update();
  MT.updatePTouch();
}

//----------

function touchMoved() {
  //print("Touch moved");
  MT.hold = true;
  MT.holdCounter++;
  if (MT.released == false) {
    if (touches.length == 1) {
      MT.hold1 = true;
      MT.hold2 = false;
      MT.hold3 = false;
      MT.hold4 = false;
      MT.hold5 = false;
    } else if (touches.length == 2) {
      MT.hold1 = false;
      MT.hold2 = true;
      MT.hold3 = false;
      MT.hold4 = false;
      MT.hold5 = false;
    } else if (touches.length == 3) {
      MT.hold1 = false;
      MT.hold2 = false;
      MT.hold3 = true;
      MT.hold4 = false;
      MT.hold5 = false;
    } else if (touches.length == 4) {
      MT.hold1 = false;
      MT.hold2 = false;
      MT.hold3 = false;
      MT.hold4 = true;
      MT.hold5 = false;
    } else if (touches.length == 5) {
      MT.hold1 = false;
      MT.hold2 = false;
      MT.hold3 = false;
      MT.hold4 = false;
      MT.hold5 = true;
    } else {
      MT.hold1 = false;
      MT.hold2 = false;
      MT.hold3 = false;
      MT.hold4 = false;
      MT.hold5 = false;
    }
  }
  MT.update();
  MT.updatePTouch();
}

//----------

function touchEnded() {
  //print("Touch ended");
  if (MT.hold == false) MT.tapped = true;
  else MT.tapped = false;
  MT.hold = false;
  MT.moved1 = false;
  MT.moved2 = false;
  MT.moved3 = false;
  MT.moved4 = false;
  MT.moved5 = false;
  if (touches.length != MT.ptouches.length) {
    MT.released = true;
    MT.hold1 = false;
    MT.hold2 = false;
    MT.hold3 = false;
    MT.hold4 = false;
    MT.hold5 = false;
  }
}


// DOUBLE TAP ------------------------------------------------------------------

var tapTimeout = 250;
var lastTapTime;
var tapX;
var tapY;

document.onmousemove = function (e) {
  tapX = e.pageX;
  tapY = e.pageY;
}

function doubleTap() {
  var now = new Date().getTime();
  var interval = now - lastTapTime;
  if (interval > 0 && interval < tapTimeout) {
    MT.tappedTwice();
    MT.tapTwice = false;
    MT.tapOnce = false;
    MT.lastActivity = frameCount;
  } else {
    MT.tappedOnce();
    MT.tapOnce = false;
    MT.lastActivity = frameCount;
  }
  lastTapTime = now;
}


// TOUCH OVER ------------------------------------------------------------------

function isPositionOverUI(x, y) {
  const uiElements = ["ui-bottomRight", "ui-topRight"];
  const elementUnderMouse = document.elementFromPoint(x, y);
  if (activeInput == true) {
    return true;
  }
  if (elementUnderMouse) {
    return uiElements.some(id => elementUnderMouse.closest(`#${id}`));
  }
  return false;
}

function getGlyphAtPosition(x, y) {
  for (let glyph of glyphs) {
    if (glyph.isHovered(x, y) == true) {
      return glyph;
    }
  }
  return null;
}