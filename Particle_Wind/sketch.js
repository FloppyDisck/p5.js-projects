let noiseScale = 0.003;
let particles = [];
let curTime = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    for (let p = 0; p < 400; p++) {
        particles.push(new Particle());
    }
    
}

function draw() {
    background(250);
    //visualizeWind(curTime);
    for (let p = 0; p < particles.length; p++) {
        particles[p].update(curTime);
        particles[p].display()
    }
    curTime++;

}

function calculateForce(x, y, time) {
    //let windAngle = map(noise(x*noiseScale, y*noiseScale, time*noiseScale), 0.0, 1.0, 0.0, 360.0); //Using perlin noise simulate wind on the given point
    //let windMag = map(noise(time*noiseScale), 0.0, 1.0, 1, 4);
    //let windForce = createVector(windMag, 0).rotate(windAngle);
    let windDirection = map(noise(x*noiseScale, y*noiseScale, time*noiseScale), 0.0, 1.0, -4.0, 4.0); //Using perlin noise simulate wind on the given point
    let windForce = createVector(windDirection, 0);
    let gravityForce = createVector(0, 2);
    let netForce = p5.Vector.add(windForce, gravityForce);
    return netForce
}

class Particle {
    constructor() {
        this.pos = createVector(random(0, windowWidth), random(0, windowHeight));
        this.velocity = createVector(0,0);
    }

    update(time) {
        let acceleration = calculateForce(this.pos.x, this.pos.y, time);
        this.velocity.add(acceleration);
        this.velocity.limit(6);
        this.pos.add(this.velocity);
        this.checkFloor();
    }

    display() {
        strokeWeight(5);
        point(this.pos.x, this.pos.y);
    }

    checkFloor() {
        if (this.pos.y > windowHeight) {
            this.pos = createVector(this.pos.x, 0);
        }
    }
}

function visualizeWind(time) {
    let step = 10;
    for (let x = 0; x < windowWidth; x+=step) {
        for (let y = 0; y < windowHeight; y+=step) {
            strokeWeight(3);
            stroke(100);
            let acceleration = calculateForce(x, y, time);
            let location = createVector(x, y);
            let direction = p5.Vector.add(location, acceleration);
            point(x, y);
            line(x, y, direction.x, direction.y);
        }
    }
}
