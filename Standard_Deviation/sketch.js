

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(250);
}

function draw() {
    drawGauss();
}

function drawGauss() {
    let gaussX = randomGaussian(windowWidth/2, 100);
    let gaussY1 = randomGaussian(windowHeight/2, 300);
    let gaussY2 = randomGaussian(windowHeight/2, 300);
    //insteresting results actually
    //line(gaussY1, 100, gaussY2+windowHeight/2, 400);
    line(gaussX, gaussY1, gaussX, gaussY2+windowHeight/2);
}