let gol;

function setup() {
	createCanvas(windowWidth, windowHeight);
	gol = new GameOfLife(2);
}

function draw() {
	background(0);
	gol.run();
}


class GameOfLife {
	constructor(res) {
		this.res = res;
		this.generate();
	}

	run() {
		this.update();
	}

	generate() {
		this.present = false; //when false present is index 0, when true index is 1
		// [y[x[false, true],[false, true],[false, true]]]
		this.board = [];
		for (let y = 0; y < windowHeight/this.res; y++) {
			let row = [];
			for (let x = 0; x < windowWidth/this.res; x++) {
				row.push([Math.floor(random(0, 1.9)), 0]);
			}
			this.board.push(row);
		}
	}

	update() {
		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board[0].length; x++) {
				this.updateCell(x, y);
				this.display(x, y);
			}
		}

		//switch up the array spaces
		this.present = !this.present;
	}

	getNeighbors(x, y) {
		let neighbors = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if ( j + y >= 0 && j + y < this.board.length && 
					 i + x >= 0 && i + x < this.board[0].length &&
					 (x + y) != 0 && this.board[y+j][x+i][+this.present]) { //when the board is 1, index doesnt pass array and its not the center
						neighbors++;
				}
			}
		}
		return neighbors;
	}

	updateCell(x, y) {
		//if nothing happens, remain unchanged
		let neighbors = this.getNeighbors(x, y);
		this.board[y][x][+(!this.present)] = this.board[y][x][+this.present];

		if (this.board[y][x][+this.present] == 1) { //if alive
			if (neighbors < 2) { //die of loneliness
				this.board[y][x][+(!this.present)] = 0;
			}
			 else if (neighbors > 3) { //die of overpop
				this.board[y][x][+(!this.present)] = 0;
			 }
		}
		else if (neighbors == 3) { //if dead and 3 neighbors rebirth
			this.board[y][x][+(!this.present)] = 1;
		}

	}

	display(x, y) {
		stroke(map(this.board[y][x][+this.present], 0, 1, 255, 0));
		fill(map(this.board[y][x][+this.present], 0, 1, 255, 0)); //when 0 it will give 0 and 1; 255
		rect(x*this.res, y*this.res, this.res, this.res);
	}
}