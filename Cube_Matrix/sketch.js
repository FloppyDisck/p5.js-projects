let matrixSize = 20;
let squares = matrixSize / 2;
let cubeSize = 60;
let cubeSpacing = 50;

let matrixes = [];

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	for (i = 0; i < squares; i++) {
		//Create each matrix with the according size
		matrixes.push(new guideBox(cubeSize*((i*2)+1) + cubeSpacing*((i*2)+1)));
	}
}

function draw() {
	background(100);
	normalMaterial();
	let rotation = frameCount * 0.01;
	for (x = 0; x < squares; x++) {
		let coords = matrixes[x].rotate(0.3, x*2);
		for (j = 0; j < coords.length; j++) {
			translate(coords[j][0], coords[j][1], 0);
			push();
			rotateZ(rotation);
			rotateX(rotation);
			rotateY(rotation);
			box(cubeSize, cubeSize, cubeSize);
			pop();
			translate(-1*coords[j][0], -1*coords[j][1], 0);
		}
	}
}

class guideBox {
	constructor(boxSize) {
		//generate upper left and lower right coords
		this.boxSize = boxSize;
		let coord = boxSize / 2;
		this.coords = [[-1*coord, coord], [coord, coord], [-1*coord, -1*coord], [coord, -1*coord]];
	}
	
	rotate(step, segments) {
		//Rotate each coord for step degrees
		for (i = 0; i < 4; i++) {
			this.coords[i] = [(this.coords[i][0] * cos(radians(step)))-(this.coords[i][1] * sin(radians(step))),
											  (this.coords[i][0] * sin(radians(step)))+(this.coords[i][1] * cos(radians(step)))];
		}
		//return the appropriate coordinates
		if (segments == 0) {
			return this.coords;
		}
		else {
			let returnCoords = [];
			
			for (i = 0; i < this.coords.length; i++) {
				returnCoords.push(this.coords[i]);
			}
			
			let forMatrix = [[0,1],[0,2],[2,3],[1,3]];

			for (j = 0; j < forMatrix.length; j++) {
				for (i = 1; i < (segments + 1); i++) {
					returnCoords.push([this.coords[forMatrix[j][0]][0] + (((this.boxSize /(segments + 1)) * i) / this.boxSize)*(this.coords[forMatrix[j][1]][0] - this.coords[forMatrix[j][0]][0]),
														 this.coords[forMatrix[j][0]][1] + (((this.boxSize /(segments + 1)) * i) / this.boxSize)*(this.coords[forMatrix[j][1]][1] - this.coords[forMatrix[j][0]][1])]);
				}
			}
			return returnCoords;
		}
	}
	
}
