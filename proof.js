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
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }
        let mapGridIndexX = Math.floor(x / TILE_SIZE);
        let mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] == 1;
    }
    render() {
        for (let i = 0; i < MAP_NUM_ROWS; i++) {
            for (let j = 0; j < MAP_NUM_COLS; j++) {
                let tileX = j * TILE_SIZE;
                let tileY = i * TILE_SIZE;
                let tileColor = this.grid[i][j] == 1 ? '#000' : '#fff';
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
        let moveStep = this.walkDirection * this.moveSpeed;
        let newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        let newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;
        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius * 2);
        // stroke("red");
        // line(this.x, this.y, this.x + Math.cos(this.rotationAngle) * 30, this.y + Math.sin(this.rotationAngle) * 30);
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        // this.length = 0; // Default length, should be adjusted by the cast method
        // this.wallHitX = 0;
        // this.wallHitY = 0;
        // this.distance = 0;

        // this.isRayFacingDown =  this.rayAngle > 0 && this.rayAngle < Math.PI;
        // this.isRayFacingUp = !this.isRayFacingDown;
        // this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        // this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        //////////////////////////////////////////
        // HORIZONTAL RAY_GRID INTERSECTION CODE //
        //////////////////////////////////////////
        let xstep;
        let ystep;
        let xintercept;
        let yintercept;

        // var foundHorzWallhit = false;
        // let wallHitX = 0;
        // let wallHitY = 0;
        // //Calculate intersections with the map based on rayAngle
        // console.log("isRayFacingRight", this.isRayFacingRight);
        
        //////////////////////////////////////////
        // X-Intercept and Y-Intercept //
        //////////////////////////////////////////

        // Find the y-coordinate of the closeet horizontal grid intersection
        yintercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yintercept += this.isRayFacingDown ? TILE_SIZE: 0;
        
        // Find the x-coordinate of the closeet horizontal grid intersection
        xintercept = player.x + (yintercept - player.y) / Math.tan(this.rayAngle);

        //Calculate increment xstep and ystep
        ystep = TILE_SIZE;
        ystep += this.isRayFacingUp ? -1 : 1;

        xstep = TILE_SIZE / Math.tan(this.rayAngle);
        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
        xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

        //////////////////////////////////////////////////////////
        /// HORIZONTAL WALL INTERSECTION
        //////////////////////////////////////////////////////////
        // let nextHorzTouchX = xintercept;
        // let nextHorzTouchY = yintercept;
        // if (this.isRayFacingUp)
        //         nextHorzTouchY--;
        // while(nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH &&  nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT)
        // {
        //     if(grid.hasWallAt(nextHorzTouchX, nextHorzTouchY))
        //     {
        //         foundHorzWallhit = true;
        //         wallHitX = nextHorzTouchX;
        //         wallHitY = nextHorzTouchY;
        //         // debug
        //         stroke("red");
        //         line(player.x, player.y, this.wallHitX, this.wallHitY);
        //         //
        //         break;
        //     }
        //     else
        //     {
        //         nextHorzTouchX += xstep;
        //         nextHorzTouchY += ystep;
        //     }
        // }

        //////////////////////////////////////////////////////////
        /// VERTICAL WALL INTERSECTION
        //////////////////////////////////////////////////////////
        
    }
    render() {
        stroke("rgba(128, 0, 128, 0.5)");
        // line(player.x, player.y, player.x + Math.cos(this.rayAngle), player.y + Math.sin(this.rayAngle) );
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
    let columnId = 0
    let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);
    rays = [];
    for (let i = 0; i < NUM_RAYS; i++) {
        let ray = new Ray(rayAngle);
        ray.cast(columnId);
        rays.push(ray);
        rayAngle += FOV_ANGLE / NUM_RAYS;
        columnId++;
    }
}
function normalizeAngle(angle)
{
    angle = angle % (2 * Math.PI);
    if(angle < 0)
        angle = (2 * Math.PI) + angle;
    return angle
}
function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    castAllRays(); // Recast all rays each frame
}

function draw() {
    background(220);
    grid.render();
    player.update();
    // castAllRays(); // Initial casting
    rays.forEach(ray => ray.render());
    player.render();

}
