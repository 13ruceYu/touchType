class MultiTouch_GUI {
  constructor() {
    this.guiImg = createGraphics(width, height);
    this.guiImg.angleMode(DEGREES);
    this.touchSize = 80;
    this.font = loadFont('assets/MonoCode-112.otf');
    this.fontBold = loadFont('assets/MonoCode-147.otf');
    this.prevSize = 0;
    this.swMed = 5.0;
    this.sw = 7.0;
  }

  display() {

    // Clear Setup
    this.guiImg.background(bgColor);
    this.guiImg.stroke(white);
    this.guiImg.strokeWeight(this.sw);
    this.guiImg.textFont(this.font, 15);
    this.guiImg.textAlign(RIGHT, BOTTOM);

    // Draw Interface Elements
    // if (isPositionOverUI(touches[0].x, touches[0].y) == false) {
    if (activeInput == false) {
      this.drawTouchInfoBG();
      this.drawGlyphInfo();
      if (activeGlyph.focus == false) {
        if (touches.length == 2) {
          this.drawRotationInfo();
          this.drawSizeInfo();
        } else if (touches.length >= 3) {
          this.drawLetterInfo();
        }
      }
      this.drawTouchInfoFG();
    }
    // }

    blendMode(LIGHTEST);
    image(this.guiImg, 0, 0);
    blendMode(BLEND);
  }

  //----------

  drawGlyphInfo() {

    this.guiImg.push();
    this.guiImg.translate(activeGlyph.position.x, activeGlyph.position.y);
    this.guiImg.rotate(activeGlyph.rotation);

    this.guiImg.noFill();
    this.guiImg.stroke(white);
    this.guiImg.strokeWeight(0.5);

    this.guiImg.ellipse(0, 0, activeGlyph.size, activeGlyph.size);
    this.guiImg.line(activeGlyph.size * -0.5, 0, activeGlyph.size * 0.5, 0);
    this.guiImg.line(0, activeGlyph.size * -0.5, 0, activeGlyph.size * 0.5);

    this.guiImg.pop();
  }

  //----------

  drawRotationInfo() {

    this.guiImg.push();
    this.guiImg.translate(activeGlyph.position.x, activeGlyph.position.y);

    this.guiImg.noFill();
    this.guiImg.stroke(white);
    this.guiImg.strokeWeight(this.swMed);

    this.guiImg.rotate(-90);

    var tempRot = activeGlyph.rotation;
    if (tempRot > 180) tempRot = map(tempRot, 180, 360, -180, 0);

    if (tempRot < 0) this.guiImg.arc(0, 0, activeGlyph.size + (this.sw * 10), activeGlyph.size + (this.sw * 10), tempRot, 0, OPEN);
    else this.guiImg.arc(0, 0, activeGlyph.size + (this.sw * 10), activeGlyph.size + (this.sw * 10), 0, tempRot, OPEN);


    this.guiImg.rotate(90);

    this.guiImg.strokeWeight(8);
    this.guiImg.point(0, -(activeGlyph.size + (this.sw * 10)) / 2);


    this.guiImg.fill(white);
    this.guiImg.noStroke();
    this.guiImg.textAlign(CENTER, BOTTOM);

    this.guiImg.text(str(int(round(tempRot))) + '°', 0, -(activeGlyph.size / 2) - (this.sw * 7.5));

    this.guiImg.pop();
  }

  //----------

  drawSizeInfo() {

    this.guiImg.push();
    this.guiImg.translate(activeGlyph.position.x, activeGlyph.position.y);

    this.guiImg.noFill();
    this.guiImg.stroke(white);
    this.guiImg.strokeWeight(0.5);


    this.guiImg.ellipse(0, 0, activeGlyph.size, activeGlyph.size);
    this.guiImg.ellipse(0, 0, this.prevSize, this.prevSize);

    this.guiImg.strokeWeight(this.swMed);
    this.guiImg.line(-activeGlyph.size * 0.5, 0, -this.prevSize * 0.5, 0);

    this.guiImg.strokeWeight(8);
    this.guiImg.point(-activeGlyph.size * 0.5, 0);

    this.guiImg.fill(white);
    this.guiImg.noStroke();
    this.guiImg.textAlign(RIGHT, CENTER);

    var tempScale = activeGlyph.size / this.prevSize * 100;

    if (this.prevSize > activeGlyph.size) this.guiImg.text(str(int(round(tempScale))) + '%', -(this.prevSize / 2) - (this.sw * 4), 0);
    else this.guiImg.text(str(int(round(tempScale))) + '%', -(activeGlyph.size / 2) - (this.sw * 4), 0);

    this.guiImg.pop();
  }

  //----------

  drawLetterInfo() {

    this.guiImg.push();
    this.guiImg.translate(activeGlyph.position.x, activeGlyph.position.y);

    this.guiImg.fill(white);
    this.guiImg.noStroke();
    this.guiImg.textAlign(CENTER, CENTER);

    for (var glyphIndex = 0; glyphIndex < activeGlyph.abc.length; glyphIndex++) {
      if (activeGlyph.abcIndex == glyphIndex) {
        this.guiImg.fill(white);
        this.guiImg.textFont(this.fontBold, 20);
      } else {
        this.guiImg.fill(grey);
        this.guiImg.textFont(this.font, 15);
      }

      var angle = ((360 / activeGlyph.abc.length) * glyphIndex) - 90 - activeGlyph.abcAngle;
      var radius = (activeGlyph.size / 2) + (this.touchSize / 2);
      var x = cos(angle) * radius;
      var y = sin(angle) * radius;

      var tempAngle = ((360 / activeGlyph.abc.length) * glyphIndex) - 90;
      this.guiImg.translate(x, y);
      this.guiImg.rotate(angle + 90);
      this.guiImg.text(activeGlyph.abc.charAt(glyphIndex), 0, 0);
      this.guiImg.rotate(-angle - 90);
      this.guiImg.translate(-x, -y);
    }


    this.guiImg.pop();
  }

  //----------

  drawTouchInfoBG() {

    this.guiImg.strokeWeight(0.5);

    // Connective Line
    for (var i = 0; i < touches.length - 1; i++) {
      if (i >= MT.maxTouches - 1) break;
      let closestDist = 100000000;
      let closestTouch = 0;
      for (var j = i + 1; j < touches.length; j++) {
        if (j >= MT.maxTouches) break;
        let dist = p5.Vector.dist(createVector(touches[i].x, touches[i].y), createVector(touches[j].x, touches[j].y));
        if (dist < closestDist) {
          closestDist = dist;
          closestTouch = j;
        }
      }
      this.guiImg.line(touches[i].x, touches[i].y, touches[closestTouch].x, touches[closestTouch].y);
    }

    if (activeInput == false) { } else { }

    if (touches.length == 1) {
      this.guiImg.line(touches[0].x, touches[0].y, activeGlyph.position.x, activeGlyph.position.y);
    } else if (touches.length == 2) {
      let touchCenter = p5.Vector.lerp(createVector(touches[0].x, touches[0].y), createVector(touches[1].x, touches[1].y), 0.5);
      this.guiImg.line(touchCenter.x, touchCenter.y, activeGlyph.position.x, activeGlyph.position.y);
    }

    this.guiImg.push();
    this.guiImg.translate(activeGlyph.position.x, activeGlyph.position.y);

    this.guiImg.fill(bgColor);
    this.guiImg.noStroke();

    this.guiImg.pop();
  }

  drawTouchInfoFG() {

    this.guiImg.fill(bgColor);
    this.guiImg.stroke(white);
    this.guiImg.strokeWeight(this.swMed);

    for (var i = 0; i < touches.length; i++) {
      if (i >= MT.maxTouches) break;
      this.guiImg.ellipse(touches[i].x, touches[i].y, MT.touchSize, MT.touchSize);
    }

    this.guiImg.fill(white);
    this.guiImg.noStroke();

    for (var i = 0; i < touches.length; i++) {
      if (i >= MT.maxTouches) break;

      // Touch xPos
      this.guiImg.textAlign(RIGHT, CENTER);
      this.guiImg.text(str(int(touches[i].x)), touches[i].x - (this.touchSize / 2) - (this.sw * 4), touches[i].y);

      // Touch yPos
      this.guiImg.translate(touches[i].x, touches[i].y + (this.touchSize / 2) + (this.sw * 4));
      this.guiImg.rotate(90);
      this.guiImg.textAlign(LEFT, CENTER);
      this.guiImg.text(str(int(touches[i].y)), 0, 0);
      this.guiImg.rotate(-90);
      this.guiImg.translate(-touches[i].x, -touches[i].y - (this.touchSize / 2) - (this.sw * 4));

      // Touch index
      this.guiImg.textAlign(CENTER, BOTTOM);
      this.guiImg.text('#' + (i + 1), touches[i].x, touches[i].y - (this.touchSize / 2) - (this.sw * 4));
    }
  }
}
