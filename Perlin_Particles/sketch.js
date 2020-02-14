let particles = [];
let noiseScale = 0.001;
let runTime = 0;
let saveCount = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(60);
    angleMode(DEGREES);
    noiseDetail(10, 0.8);
    //vectorPerlin();


    for (let i = 0; i < 200; i++) {
        particles.push(new movingParticle(color(map(noise(i), 0.0, 1.0, 0, 255), 
                                                map(noise(i + 10000), 0.0, 1.0, 0, 255), 
                                                map(noise(i + 20000), 0.0, 1.0, 0, 255), 
                                                map(noise(i + 20000), 0.0, 1.0, 10, 100))));
    }
}

function draw() {
    //runTime += 0.001;
    for (let i = 0; i < particles.length; i++) {
        //particles[i].move(2,2);
        particles[i].ranMove(1);
    }
}

function keyPressed() {
    if (key == 'x') {
      save("screenshot" + saveCount + ".png");
      saveCount++;
    }
  }

function vectorPerlin() {
    let step = 20;
    let magnitude = 15;
    for (let x = 0; x < windowWidth; x+=step) {
        for (let y = 0; y < windowHeight; y+=step) {
            strokeWeight(3);
            stroke(100);
            let angle = map(noise(x*noiseScale, y*noiseScale, runTime*noiseScale), 0.0, 1.0, 0.0, 360.0);
            point(x, y);
            line(x, y, x+(magnitude*cos(angle)), y+(magnitude*sin(angle)));
        }
    }
}

class movingParticle {
    constructor(partColor) {
        this.partColor = partColor;
        this.generate_coords();
        this.ranStroke = random(2,5);
    }

    generate_coords() {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
    }

    move(step, weight) {
        strokeWeight(weight);
        stroke(this.partColor);
        let angle = map(noise(this.x*noiseScale, this.y*noiseScale, runTime*noiseScale), 0.0, 1.0, 0.0, 360.0);
        let nX = this.x + step*cos(angle);
        let nY = this.y + step*sin(angle);
        line(this.x, this.y, nX, nY);
        this.x = nX;
        this.y = nY
        this.check_collision();
        //point(this.x, this.y);
    }

    ranMove(step) {
        this.move(step, this.ranStroke);
    }

    check_collision() {
        if (this.x < 0 || this.x > windowWidth || this.y < 0 || this.y > windowHeight) {
            this.generate_coords();
        }
    }
}
