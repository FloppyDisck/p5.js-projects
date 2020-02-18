let noiseMap;
let particleSystem;

let noiseScale = 0.001;
let saveCount = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    angleMode(DEGREES);
    noiseDetail(10, 0.8);

    noiseMap = new FlowMap(windowWidth, windowHeight, 20, noiseScale);
    particleSystem = new ParticleSystem(noiseMap, 50);
    
}

function draw() {
    
    particleSystem.run();
    //noiseMap.run();
    //noiseMap.tick();
    //noiseMap.display();
}

function keyPressed() {
    if (key == 'x') {
      save("screenshot" + saveCount + ".png");
      saveCount++;
    }
  }

class FlowMap {
    constructor(xSize, ySize, res, noise) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.res = res;
        this.noise = noise;

        this.time = 1;
    }

    run() {
        this.generateMap();
    }

    generateMap() {
        this.flowMap = [];
        let step = this.res/2; //prevent having to divide each iteration
        let mag = 1;

        for (let y = 0; y <= this.ySize; y += this.res) {
            let flowX = [];
            for (let x = 0; x <= this.xSize; x += this.res) {
                let angle = map(noise((x+step)*this.noise, (y+step)*this.noise, this.time*this.noise), 0.0, 1.0, 0, 360);
                let force = createVector(mag, 0);
                force.rotate(angle);
                flowX.push(force);
            }
            this.flowMap.push(flowX);
        }
    }

    tick() {
        this.time++;
    }
    
    getForce(x, y) {
        return this.flowMap[Math.floor(y/this.res)][Math.floor(x/this.res)];
    }

    display() {
        let step = this.res/2;
        for (let y = 0; y < this.flowMap.length; y++) {
            for (let x = 0; x < this.flowMap[0].length; x++) {
                let center = createVector(x*this.res + step, y*this.res + step);
                let centerEnd = this.flowMap[y][x];
                centerEnd.mult(step);
                centerEnd = p5.Vector.add(center, this.flowMap[y][x]);
                strokeWeight(2);
                stroke(255);
                line(center.x, center.y, centerEnd.x, centerEnd.y);
            }
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.loc = createVector(x, y);
        this.size = 4;
        this.color = color;

        this.maxSpeed = 2;
        this.maxForce = 0.1;

        this.vel = p5.Vector.random2D();
        this.vel.mult(this.maxSpeed);
        this.acc = createVector(0, 0);
    }

    getX() {
        return this.loc.x;
    }

    getY() {
        return this.loc.y;
    }

    run() {
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
        force.limit(this.maxForce);
        this.acc.add(force);
    }

    outOfBounds() {
        if (this.loc.x > windowWidth || this.loc.x < 0 || this.loc.y > windowHeight || this.loc.y < 0) {
            return true;
        }

        return false;
    }

    display() {
		stroke(this.color);
		strokeWeight(this.size);
		point(this.loc.x, this.loc.y);
	}
    
}

class ParticleSystem {
    constructor(flowMap, qty) {
        this.flowMap = flowMap;
        this.particles = [];
        for (let p = 0; p < qty; p++) {
            this.particles.push(ParticleSystem.randomParticle(p));
        }
    }

    run() {
        this.flowMap.run();
        this.flowMap.tick();
        //this.flowMap.display();
        for (let p = 0; p < this.particles.length; p++) {
            let force = this.flowMap.getForce(this.particles[p].getX(), this.particles[p].getY());
            this.particles[p].applyForce(force);
            this.particles[p].run();
            if (this.particles[p].outOfBounds()) {
                this.particles[p] = ParticleSystem.randomParticle(p);
            }
        }
    }

    static randomParticle(p) {
        return new Particle(random(0, windowWidth), random(0, windowHeight),
                            color(map(noise(p), 0.0, 1.0, 0, 255),
                                  map(noise(p+10), 0.0, 1.0, 0, 255),
                                  map(noise(p+100), 0.0, 1.0, 0, 255), 100));
    }
}