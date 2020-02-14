

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(250);
    perlinWave();
}

function perlinWave() {
    let noise_scale = 0.0008;
    for (let x = 0; x < windowWidth; x++) {
        noiseDetail(2, 0.4);
        let perlin_noise = noise(x*noise_scale, Date.now()*noise_scale);
        stroke(255*perlin_noise);
        line(x, windowHeight*perlin_noise, x, windowHeight);
    }
}