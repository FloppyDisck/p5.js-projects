let noiseScale = 0.005;
let newMap;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    //angleMode(DEGREES);
    noiseDetail(10, 0.8);
    noLoop();
    newMap = new PerlinCubes(10, 100, 10, 100);
    newMap = new perlinPlane(10, 1000, 100, 1000, 100);
}

function draw() {
    normalMaterial();
    background(200);
    rotateX(-0.5);
    newMap.generate();
}

class PerlinCubes {
    constructor(cubeSize, xSize, ySize, zSize) {
        this.cubeSize = cubeSize;
        this.xSize = xSize; //Length
        this.ySize = ySize; //Depth
        this.zSize = zSize; //Height
        this.perlinMap = [];

        for (let x = 0; x < xSize; x++) {
            this.perlinMap.push([]);
            for (let z = 0; z < zSize; z++) {
                this.perlinMap[x].push(map(noise(x*noiseScale, z*noiseScale), 0.0, 1.0, 1, ySize));
            }
        }
        print("Perlin Map is done calculating");
    }
    generate() {
        let xHalf = (this.xSize / 2) * this.cubeSize;
        let zHalf = (this.zSize / 2) * this.cubeSize;
        for (let x = 0; x < this.xSize; x++) {
            for (let z = 0; z < this.zSize; z++) {
                push();
                translate((x*this.cubeSize) - xHalf, 0, (z*this.cubeSize) - zHalf);
                for (let y = 1; y <= this.perlinMap[x][z]; y++) {
                    box(this.cubeSize);
                    translate(0, -this.cubeSize, 0);
                }
                pop();
            }
        }
        //translate(this.xSize/2 * this.cubeSize, this.ySize * this.cubeSize, this.zSize/2 * this.cubeSize);
    }
}

class perlinPlane {
    constructor(res, xSize, ySize, zSize, zOffset) {
        this.perlinArr = [];
        this.res = res;
        this.xSize = xSize;
        this.ySize = ySize;
        this.zSize = zSize;
        for (let z = 0; z < Math.floor(zSize/res); z++) {
            let xArr = [];
            for (let x = 0; x < Math.floor(xSize/res); x++) {
                xArr.push(map(noise(x*noiseScale, z*noiseScale), 0.0, 1.0, 0, ySize) + zOffset);
            }
            this.perlinArr.push(xArr);
        }
    }

    generate() {
        //beginShape();
        let zStep = -1 * (this.zSize / 2);
        for (let z = 0; z < this.perlinArr.length - 1; z++) {
            let xStep = -1 * (this.xSize / 2);
            for (let x = 0; x < this.perlinArr[0].length - 1; x++) {
                xStep += this.res;
                //vertex(xStep, this.perlinArr[z][x], zStep);
                //vertex(xStep + this.res, this.perlinArr[z][x+1], zStep);
                //vertex(xStep + this.res, this.perlinArr[z+1][x+1], zStep + this.res);
                //vertex(xStep, this.perlinArr[z+1][x], zStep + this.res);
                //vertex(xStep, this.perlinArr[z][x], zStep);
                line(xStep, this.perlinArr[z][x], zStep, xStep + this.res, this.perlinArr[z][x+1], zStep);
                line(xStep, this.perlinArr[z][x], zStep, xStep, this.perlinArr[z+1][x], zStep + this.res);
                line(xStep + this.res, this.perlinArr[z+1][x+1], zStep + this.res, xStep + this.res, this.perlinArr[z][x+1], zStep);
                line(xStep + this.res, this.perlinArr[z+1][x+1], zStep + this.res, xStep, this.perlinArr[z+1][x], zStep + this.res);
            }
            zStep += this.res;
        }
        //endShape();
    }
}

function keyPressed() {
    if (key == 'x') {
      save("screenshot" + saveCount + ".png");
      saveCount++;
    }
}

