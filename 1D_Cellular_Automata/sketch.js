let automata;
function setup() {
	createCanvas(windowWidth, windowHeight);
	let troco = Math.floor(random(0,255));
	print(troco);
	automata = new CelularAutomata(troco, 4);

	//146
	//165
	//195
	//110
	//90
	//75
	//73
}

function draw() {
	background(0);
	automata.run();
}

class CelularAutomata {
	constructor(rule, size) {
		this.size = size;
		this.generateRules(rule);
		this.initMap();

	}

	run() {
		this.display();
		this.nextMap();
	}

	generateRules(rule) {
		let ruleBase2 = rule.toString(2);
		this.rules = [];
		//generate rules inversed for ease of access
		for (let c = 0; c < 8; c++) {
			if (c < ruleBase2.length) {
				this.rules.push(parseInt(ruleBase2.charAt(ruleBase2.length - 1 - c), 10));
			}
			else {
				this.rules.push(0);
			}
		}
	}

	calcRules(x, y) {
		let combination;
		let result;
		if (x == 0) {
			combination = "" + this.curMap[y][this.curMap[0].length - 1] + this.curMap[y][x] + this.curMap[y][x+1];
		}
		else if (x == this.curMap[0].length - 1) {
			combination = "" + this.curMap[y][x-1] + this.curMap[y][x] + this.curMap[y][0]
		}
		else {
			combination = "" + this.curMap[y][x-1] + this.curMap[y][x] + this.curMap[y][x+1]
		}
		result = parseInt(combination, 2);
		return this.rules[result];

	}

	initMap() {
		this.curMap = [];
		//Generate first array with random values
		let row = [];
		for (let x = 0; x <= windowWidth; x += this.size) {
			row.push(Math.floor(random(0, 1.9)));
		}
		this.curMap.push(row);

		//Generate next arrays with the values
		for (let y = 1; y <= windowHeight/this.size; y++) {
			row = [];
			for (let x = 0; x <= windowWidth/this.size; x++ ) {
				row.push(this.calcRules(x, y-1));
			}
			this.curMap.push(row);
		}

		this.newMap = this.curMap.slice();
	}

	nextMap() {
		for (let y = 1; y < this.curMap.length; y++) {
			this.newMap[y-1] = this.curMap[y].slice();
		}
		for (let x = 0; x < windowWidth/this.size; x++) {
			this.newMap[this.curMap.length-1][x] = this.calcRules(x, this.curMap.length-1);
		}

		this.curMap = this.newMap.slice();
	}

	display() {
		for (let y = 0; y < this.curMap.length ; y++) {
			for (let x = 0; x < this.curMap[0].length; x++) {
				stroke(map(this.curMap[y][x], 0, 1, 255, 0));
				//stroke(255);
				fill(map(this.curMap[y][x], 0, 1, 255, 0)); //when 0 it will give 0 and 1; 255
				//rect(x*this.size, (this.curMap.length - 1 - y)*this.size, this.size, this.size);
				rect(x*this.size, (y)*this.size, this.size, this.size);
			}
		}
	}
}