let noiseScale = 0.1;
let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    
    vectorPerlin();

    for (let p = 0; p < 600; p++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(250);
    for (let p = 0; p < particles.length; p++) {
        particles[p].update();
        particles[p].display();
    }
}

function calc_angle(x, y) {
    return map(noise(x*noiseScale, y*noiseScale), 0.0, 1.0, 0.0, 360.0);
}

function vectorPerlin() {
    let step = 20;
    let magnitude = 15;
    for (let x = 0; x < windowWidth; x+=step) {
        for (let y = 0; y < windowHeight; y+=step) {
            strokeWeight(3);
            stroke(100);
            let angle = calc_angle(x, y);
            point(x, y);
            let direction = createVector(magnitude, 0).rotate(angle);
            direction = createVector(x, y).add(direction);
            line(x, y, direction.x, direction.y);
        }
    }
}

class Particle {
    constructor() {
        this.newPos(); //new pos
        this.velocity = createVector(random(1,3), 0).rotate(calc_angle(this.pos.x, this.pos.y)); //init a velocity vector with a random magnitude
        this.acceleration = createVector(0, 0); //make empty acceleration vector
    }

    newPos() {
        this.pos = createVector(random(0, windowWidth), random(0, windowHeight)); //Init random particle pos
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(4);
        this.pos.add(this.velocity);
        this.acceleration = createVector(0.08, 0).rotate(calc_angle(this.pos.x, this.pos.y));
        this.checkEdges();
    }

    display() {
        strokeWeight(6);
        stroke(100);
        point(this.pos.x, this.pos.y);
    }

    checkEdges() {
        if (this.pos.x >= windowWidth || this.pos.x <= 0 || this.pos.y >= windowHeight || this.pos.y <= 0) {
            this.newPos();
        }
    }
}