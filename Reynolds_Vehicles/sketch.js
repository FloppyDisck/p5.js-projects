let vehicle;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //angleMode(DEGREES);
    vehicle = new Vehicle(windowWidth/2, windowHeight/2);
}

function draw() {
    background(255);
    //vehicle.seek(createVector(mouseX, mouseY));
    vehicle.wander();
    vehicle.run();
}

//action selection; given its surroundings calculate what to do next
//steering; given its selection use a force to steer itself
class Vehicle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.r = 3.0;
        this.maxSpeed = 4;
        this.maxForce = 0.1;
    }

    run() {
        this.update();
        this.display();
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0); //reset acceleration
    }

    applyForce(force) {
        this.acc.add(force);
    }

    wander() {
        let future = this.pos.copy();
        future.mult(50);
        future.limit(50);
        future = p5.Vector.add(future, this.pos);

        let ranDir = random(0, PI*2);
        let rad = 40;

        this.seek(p5.Vector.add(future, createVector(rad * cos(ranDir), rad * sin(ranDir))));
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        desired.normalize();

        if (d < 100) {
            let m = map(d, 0, 100, 0, this.maxSpeed);
            desired.mult(m);
        }

        else {
            desired.mult(this.maxSpeed);
        }

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }

    display() {
        let theta = this.vel.heading() + PI/2;
        fill(175);
        stroke(2);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r*2);
        vertex(-this.r, this.r*2);
        vertex(this.r, this.r*2);
        endShape(CLOSE);
        pop();
    }
}

function keyPressed() {
    if (key == 'x') {
      save("screenshot" + saveCount + ".png");
      saveCount++;
    }
}

