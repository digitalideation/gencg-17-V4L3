// Based on the code M_1_5_01.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
// Some of the var might be initialised in gui.js
var agents, density, letterPositions;

function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  // Comment it out if the sketch is too slow
  density = displayDensity();
  pixelDensity(density);
  // Init var
  // some of the var might be initialised in gui.js
  backgroundGrey = 0;
  background(backgroundGrey);
  // Init 
  initScene();
  // Draw text
  noStroke();
  fill(backgroundGrey, options.txtAlpha);
  textSize(options.txtSize);
  text(options.txt, width / 2 - textWidth(options.txt) / 2, height / 2 + options.txtSize / 2);
}

function draw() {

  // 
  smooth();
  background(backgroundGrey, options.overlayAlpha);
  stroke(255, options.agentsAlpha);

  noiseDetail(options.octaves, options.falloff);

  // Draw agents  
  for (var i = 0; i < agents.length - 1; i++) {
    agents[i].draw(options.noiseScale, options.noiseStrength, options.strokeWidth, options.drawMode);
  }

  

}


function initScene() {
  background(0);
  fill(1);
  textSize(options.txtSize);
  text(options.txt, width / 2 - textWidth(options.txt) / 2, height / 2 + options.txtSize / 2);

  // Load pixels
  letterPositions = [];
  agents = [];
  var step = options.step;
  let w = width * density;
  let h = height * density;
  let container = document.getElementById('p5Container');
  ctx = container.firstChild.getContext("2d");
  let data = ctx.getImageData(0, 0, w, h).data;
  let position = 0;
  for (var i = 0; i < w; i += step) {
    for (var j = 0; j < h; j += step) {
      if (data[((i + j * w) * 4) + 1] == 1) {
        letterPositions.push({ x: Math.round(this.x), y: Math.round(this.y) })
        let a0 = new Agent(random(0,windowWidth),random(0,windowHeight),i/density, j/density, PI, position)
        agents.push(a0);
        position++;
      }
    }
  }
}

function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) background(backgroundGrey);
  if (keyCode == 32) {
    for (var i = 0; i < agents.length - 1; i++) agents[i].restart();
  }
  if (key == 's' || key == 'S') saveThumb(650, 350);

  if (key == '1') options.drawMode = 1;
  if (key == '2') options.drawMode = 2;
  if (key == ' ') {
    let newNoiseSeed = floor(random(100000));
    noiseSeed(newNoiseSeed);
  }

  if (keyCode == UP_ARROW) options.falloff += 0.05;
  if (keyCode == DOWN_ARROW) options.falloff -= 0.05;
  if (options.falloff > 1.0) options.falloff = 1.0;
  if (options.falloff < 0.0) options.falloff = 0.0;

  if (keyCode == LEFT_ARROW) options.octaves--;
  if (keyCode == RIGHT_ARROW) options.octaves++;
  if (options.octaves < 0) options.octaves = 0;

}

// Tools
// resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

//  conversion
function toInt(value) {
  return ~~value;
}

// Timestamp
function timestamp() {
  return Date.now();
}

// Thumb
function saveThumb(w, h) {
  let img = get(width / 2 - w / 2, height / 2 - h / 2, w, h);
  save(img, 'thumb.jpg');
}