//Settings Sliders
let spacingSlider;
let thetaSlider;
let amplitudeSlider;
let waveColorPicker;
let backgroundColorPicker;

//Wave variables
let xspacing = 5; //separation between points
let temp_spacing;

let theta = 0.0; //where the angle starts
let theta_step; //angular velocity
let amplitude; //have height
let period = 500.0; //how many pixels before the wave repeats
let yvalues = []; //array storing height values

let w;  //wave width
let dx; //x increment, function of period and spacing
let backgroundColor;
let vectorColor;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 360, 100, 100);
	init();
	init_settings();
	
}

function init() {
	w = width+16;
	dx = (TWO_PI / period) * xspacing;
	
	yvalues = [];
	for (i = 0; i < w/xspacing; i++){
		yvalues.push(0);
	}
}

function init_settings(){
	label();
	//Setup sliders.
  //slider for size control.
  spacingSlider = createSlider(1, 20, 5, 1);
  spacingSlider.position(10, 25);

  //slider for controling rotation radius.
  amplitudeSlider = createSlider(1, 200, 75, 1);
  amplitudeSlider.position(10, 70);
	
	//slider for animation speed control.
  thetaSlider = createSlider(0.01, 1.0, 0.02, 0.01); //Divide by 100 for the real values
  thetaSlider.position(10, 120);

  //Setup colot pickers.
  //create a color Picker Element.
  waveColorPicker = createColorPicker('#172e3b');
  waveColorPicker.style('width', '50px');
  waveColorPicker.style('height', '50px');
  waveColorPicker.style('background', 'black');
  waveColorPicker.style('border-radius', '2px');
  waveColorPicker.style('border', '#234557');
  waveColorPicker.position(10, 170);

  //create background color picker.
  backgroundColorPicker = createColorPicker('#f7f7f7');
  backgroundColorPicker.style('width', '50px');
  backgroundColorPicker.style('height', '50px');
  backgroundColorPicker.style('background', 'black');
  backgroundColorPicker.style('border-radius', '2px');
  backgroundColorPicker.style('border', '#f7f7f7');
  backgroundColorPicker.position(85, 170);
}

function draw() {	
	//Get slider values
	temp_spacing = spacingSlider.value();
	//Check if point values changed to restart array
	if (xspacing != temp_spacing){
		xspacing = temp_spacing;
		init();
	}
	theta_step = thetaSlider.value();
	amplitude = amplitudeSlider.value();
	
	backgroundColor = backgroundColorPicker.value();
	vectorColor = waveColorPicker.value();
	
	background(backgroundColor);
  stroke(vectorColor);
	
	calcWave();
	renderWave();
}

function calcWave() {
	theta += theta_step; //angular velocity
	
	let x = theta;
	for (i = 0; i < yvalues.length; i++){
		yvalues[i] = sin(x)*amplitude;
		x += dx;
	}
}

function renderWave() {
	for (x = 0; x < yvalues.length; x++){
		strokeWeight(1); // Default
		line(x*xspacing, height/2+yvalues[x], (yvalues.length-x)*xspacing, height);
		line(x*xspacing, height/2+yvalues[x], (yvalues.length-x)*xspacing, 0);
	}
}

//Funciton for labeling the sliders,buttons etc.
function label() {
  let sizeLabel = createDiv('Vector Spacing');
  sizeLabel.position(10, 10);
  sizeLabel.style('font-family', 'Helvetica');
  sizeLabel.style('font-weight', 'bold');
  sizeLabel.style('font-size', '14px');

  let radiusLabel = createDiv('Wave Amplitude');
  radiusLabel.position(10, 50);
  radiusLabel.style('font-family', 'Helvetica');
  radiusLabel.style('font-weight', 'bold');
  radiusLabel.style('font-size', '14px');


  let speedLabel = createDiv('Step Speed');
  speedLabel.position(10, 100);
  speedLabel.style('font-family', 'Helvetica');
  speedLabel.style('font-weight', 'bold');
  speedLabel.style('font-size', '14px');

  let colorLabel = createDiv('Colors');
  colorLabel.position(10, 150);
  colorLabel.style('font-family', 'Helvetica');
  colorLabel.style('font-weight', 'bold');
  colorLabel.style('font-size', '14px');
}