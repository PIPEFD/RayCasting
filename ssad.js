const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;
const FOV_ANGLE = 60 * (Math.PI / 180); // Field of view of 60 degrees converted to radians
const WALL_STRIP_WIDTH = 10;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
    hasWallAt(x, y) {
        if (x < 0 || x >= WINDOW_WIDTH || y < 0 || y >= WINDOW_HEIGHT) {
            return true;
        }
        const mapGridIndexX = Math.floor(x / TILE_SIZE);
        const mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] === 1;
    }
    render() {
        for (let i = 0; i < MAP_NUM_ROWS; i++) {
            for (let j = 0; j < MAP_NUM_COLS; j++) {
                const tileX = j * TILE_SIZE;
                const tileY = i * TILE_SIZE;
                const tileColor = this.grid[i][j] === 1 ? '#000' : '#fff';
                stroke('#222');
                fill(tileColor);
                rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0;
        this.walkDirection = 0;
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180);
    }
    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        const moveStep = this.walkDirection * this.moveSpeed;
        const newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        const newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;
        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius * 2);
        stroke("red");
        line(this.x, this.y, this.x + Math.cos(this.rotationAngle) * 30, this.y + Math.sin(this.rotationAngle) * 30);
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        this.length = 0; // Se ajustará basado en la intersección
        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;
        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }

    cast() {
        let xintercept, yintercept, xstep, ystep;
        
        // Inicialización de la interceptación horizontal
        yintercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yintercept += this.isRayFacingDown ? TILE_SIZE : 0;
        
        xintercept = player.x + (yintercept - player.y) / Math.tan(this.rayAngle);

        // Pasos horizontales
        ystep = TILE_SIZE * (this.isRayFacingUp ? -1 : 1);
        xstep = TILE_SIZE / Math.tan(this.rayAngle);
        xstep *= (this.isRayFacingLeft ? -1 : 1);

        let nextTouchX = xintercept;
        let nextTouchY = yintercept + (this.isRayFacingUp ? -1 : 0); // Ajuste para intersección arriba del grid
        
        // Comprobar intersección horizontal
        while (nextTouchX >= 0 && nextTouchX <= WINDOW_WIDTH && nextTouchY >= 0 && nextTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextTouchX, nextTouchY)) {
                this.wallHitX = nextTouchX;
                this.wallHitY = nextTouchY;
                this.distance = Math.sqrt(Math.pow(nextTouchX - player.x, 2) + Math.pow(nextTouchY - player.y, 2));
                break;
            }
            nextTouchX += xstep;
            nextTouchY += ystep;
        }
    }

    render() {
        if (this.distance > 0) { // Solo dibujar si hay una distancia calculada
            stroke("rgba(255, 0, 0, 0.7)");
            line(player.x, player.y, this.wallHitX, this.wallHitY);
        }
    }
}

let grid = new Map();
let player = new Player();
let rays = [];

function keyPressed() {
    if (keyCode === UP_ARROW) {
        player.walkDirection = 1;
    } else if (keyCode === DOWN_ARROW) {
        player.walkDirection = -1;
    } else if (keyCode === RIGHT_ARROW) {
        player.turnDirection = 1;
    } else if (keyCode === LEFT_ARROW) {
        player.turnDirection = -1;
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        player.walkDirection = 0;
    }
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        player.turnDirection = 0;
    }
}

function castAllRays() {
    let columnid = 0
    let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);
    rays = [];
    for (let i = 0; i < NUM_RAYS; i++) {
        let ray = new Ray(rayAngle);
        ray.cast(columnid);
        rays.push(ray);
        rayAngle += FOV_ANGLE / NUM_RAYS;
        columnid++;
    }
}
function normalizeAngle(angle)
{
    angle = angle % (2 * Math.PI);
    if(angle < 0)
    {
        angle = (2 * Math.PI) + angle;
    }
    return angle
}
function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
    background(220);
    grid.render();
    player.update();
    // castAllRays(); // Recast all rays each frame
    rays.forEach(ray => ray.render());
    player.render();
    castAllRays(); // Initial casting

}
