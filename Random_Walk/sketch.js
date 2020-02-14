let w;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(250);
    w = new Walker();
}

function draw() {
    w.step();
    w.display();
}

class Walker {
    constructor() {
        this.x = windowWidth/2;
        this.y = windowHeight/2;
    }

    display() {
        stroke(0);
        point(this.x, this.y);
    }

    step() {
        let choiseX = random(1);
        let choiseY = random(1);

        if (choiseX <= 0.6) {
            this.x++;
        }
        else if (choiseX <= 0.8) {
            this.x--;
        }

        if (choiseY <= 0.6) {
            this.y++;
        }
        else if (choiseY <= 0.8) {
            this.y--;
        }
    }
}