let gol;

function setup() {
	createCanvas(windowWidth, windowHeight);
	gol = new GameOfLife(10);
}

function draw() {
	background(255);
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
		this.present = false;

		this.board = [];
		for (let y = 0; y < windowHeight/this.res; y++) {
			let row = [];
			for (let x = 0; x < windowWidth/this.res; x++) {
				row.push(new Cell(Math.floor(random(0, 1.9))));
			}
			this.board.push(row);
		}
	}

	update() {
		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board[0].length; x++) {
				this.updateCell(x, y);
				if (this.board[y][x].getState(this.present) > 0) {
					this.display(x, y, this.board[y][x].getState(this.present));
				}
			}
		}
		this.present = !this.present;
	}

	updateCell(x, y) {
		let neighbors = this.getNeighbors(x, y);
		this.board[y][x].updateState(this.present);
		if (this.board[y][x].getState(this.present) > 0 && 
			this.board[y][x].getState(this.present) < 3) { //if alive
			if (neighbors < 2) { //die of loneliness
				this.board[y][x].kill(this.present);
			}
			 else if (neighbors > 3) { //die of overpop
				this.board[y][x].kill(this.present);
			 }
		}
		else if (this.board[y][x].getState(this.present) == 0 || 
		this.board[y][x].getState(this.present) == 3) { //if dead or dying
			if (neighbors == 3) { //if dead and 3 neighbors rebirth
				this.board[y][x].spawn(this.present);
			}
		}
	}

	getNeighbors(x, y) {
		let neighbors = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if ( j + y >= 0 && j + y < this.board.length && 
					 i + x >= 0 && i + x < this.board[0].length &&
					 (x + y) != 0 && this.board[y+j][x+i].getState(this.present) > 0
					 && this.board[y+j][x+i].getState(this.present) < 3) { //when the board is 1 or 2, index doesnt pass array and its not the center
						neighbors++;
				}
			}
		}
		return neighbors;
	}

	display(x, y, state) {
		let colors;
		switch(state) {
			case 1:
				colors = color(0, 0, 0);
				break;
			case 2:
				colors = color(0, 0, 255);
				break;
			case 3:
				colors = color(255, 0, 0);
				break;
		}
		stroke(colors);
		fill(colors);
		rect(x*this.res, y*this.res, this.res, this.res);
	}
}
//TODO: make new class cell that manages all of its state data
//if its previous state is dead and now its alive color red
//if its previous state is alive and now its dead color blue
//the automata class just manages each individual cell

class Cell {
	constructor(alive) {
		//init cell either dead or alive
		this.state = [+alive, +alive];
	}

	updateState(present) {
		if (this.state[+present] == 2) {
			this.state[+!present] = 1;
		}
		if (this.state[+present] == 1 && this.state[+!present] == 2) {
			this.state[+!present] = 1;
		}
		else if (this.state[+present] == 0 && this.state[+!present] == 3) {
			this.state[+!present] = 0;
		}
		else if (this.state[+present] == 3) {
			this.state[+!present] = 0;
		}
	}

	kill(present) {
		//death of cell
		this.state[+!present] = 3;
	}

	spawn(present) {
		//birth of cell
		this.state[+!present] = 2;
	}

	setState(state, present) {
		//0 = dead; 1 == alive; 2 == born; 3 == dying
		this.state[+!present] = state;
	}

	getState(present) {
		//this.updateState(+present);
		return this.state[+present];
	}
}