let particleSystem;

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	particleSystem = new ParticleSystem(100, 150);
}

function draw() {
	background(255, 255, 255);
	particleSystem.run();
}

class ParticleSystem {
	constructor(qty, res) {
		this.particles = [];
		this.res = res;
		this.particleGrid = [];
		for (let y = 0; y <= windowHeight; y += this.res) {
			let gridY = [];
			for (let x = 0; x <= windowWidth; x += this.res) {
				gridY.push([]);
			}
			this.particleGrid.push(gridY);
		}

		//When creating each particle add them to the grid
		for (let p = 0; p < qty; p++) {
			let x = random(0, windowWidth);
			let y = random(0, windowHeight);
			this.particleGrid[Math.floor(y/this.res)][Math.floor(x/this.res)].push(p);
			this.particles.push(new Particle(x, y, 5));
		}
	}

	run() {
		for (let p = 0; p < this.particles.length; p++) {
			//Get old location
			let oldLoc = this.particles[p].getLocation();
			let index = this.particleGrid[Math.floor(abs(oldLoc.y)/this.res)][Math.floor(abs(oldLoc.x)/this.res)].indexOf(p);
			//Remove from grid
			this.particleGrid[Math.floor(abs(oldLoc.y)/this.res)][Math.floor(abs(oldLoc.x)/this.res)].splice(index, 1);
			//Update location
			this.particles[p].run();
			//Get new location
			let newLoc = this.particles[p].getLocation();
			//add to grid NOTE: adding abs cause sometimes some vectors have negative values
			let gridX = Math.floor(abs(newLoc.x)/this.res);
			let gridY = Math.floor(abs(newLoc.y)/this.res);
			this.particleGrid[gridY][gridX].push(p);

			for (let gy = -1; gy <= 1; gy++) { //iterate over the up, middle and lower cubes
				let y = gridY + gy;
				if (y >= 0 && y < this.particleGrid.length) { //avoid non existing cubes
					for (let gx = -1; gx <= 1; gx++) { //iterate over the left middle and right cubes
						let x = gridX + gx;
						if (x >= 0 && x < this.particleGrid[0].length) {
							for (let gp = 0; gp < this.particleGrid[y][x].length; gp++) {
								let z = this.particleGrid[y][x][gp];
								if (z != p) {
									Particle.tryVector(this.res, this.particles[p], this.particles[z]);
								}
							}
						}
					}
				}
				
			}

			//check adjacent grids and tryVector() with the items inside said grids

			//for (let i = p + 1; i < this.particles.length; i++) {
			//	Particle.tryVector(this.res, this.particles[p], this.particles[i]);
			//}
		}
	}
}

class Particle {
    constructor(x, y, size) {
        this.loc = createVector(x, y);
        this.size = size;

        this.maxSpeed = 2;
        this.maxForce = 0.1;

        this.vel = p5.Vector.random2D();
        this.vel.mult(this.maxSpeed);
        this.acc = createVector(0, 0);
    }

    static tryVector(maxDistance, p1, p2) {
		let p1Loc = p1.getLocation();
		let p2Loc = p2.getLocation();
		let distance = p5.Vector.sub(p1Loc, p2Loc).mag();
		if (distance < maxDistance) {
			stroke(0, map(distance, 0, maxDistance, 255, 0));
			strokeWeight(2);
			line(p1Loc.x, p1Loc.y, p2Loc.x, p2Loc.y);
		}
    }

    getLocation() {
        return this.loc;
    }

    run() {
		this.checkWall();
        this.update();
        this.display();
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.loc.add(this.vel);
        this.acc.mult(0); //reset acceleration
    }

    applyForce(force) {
        this.acc.add(force);
	}
	
	changeDirection(desired) {
		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);
		this.applyForce(steer);
	}

    checkWall() {
        if (this.loc.x <= 25) {
			this.changeDirection(createVector(this.maxSpeed, this.vel.y));
        }
        else if (this.loc.x >= windowWidth - 25) {
			this.changeDirection(createVector(-1*this.maxSpeed, this.vel.y));
        }
        if (this.loc.y <= 25) {
			this.changeDirection(createVector(this.vel.x, this.maxSpeed));
        }
        else if (this.loc.y >= windowHeight - 25) {
            this.changeDirection(createVector(this.vel.x, -1*this.maxSpeed));
        }
    }

    display() {
		stroke(0);
		strokeWeight(this.size);
		point(this.loc.x, this.loc.y);
	}

}