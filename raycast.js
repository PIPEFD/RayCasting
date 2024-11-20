const TILE_SIZE = 64;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;


const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180); // Field of view of 60 degrees converted to radians

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const MINIMAP_SCALE_FACTOR = 0.3;


class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
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
        const mapGridIndexX = Math.floor(x / TILE_SIZE);
        const mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;
    }
    render() {
        for (let i = 0; i < MAP_NUM_ROWS; i++) {
            for (let j = 0; j < MAP_NUM_COLS; j++) {
                const tileX = j * TILE_SIZE;
                const tileY = i * TILE_SIZE;
                const tileColor = this.grid[i][j] == 1 ? '#000' : '#fff';
                stroke('#222');
                fill(tileColor);
                rect(MINIMAP_SCALE_FACTOR * tileX, 
                    MINIMAP_SCALE_FACTOR *  tileY,
                    MINIMAP_SCALE_FACTOR * TILE_SIZE, 
                    MINIMAP_SCALE_FACTOR * TILE_SIZE);
            }
        }
    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 7;
        this.radius = 4;
        this.turnDirection = 0; // -1 of left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 4.0;
        this.rotationSpeed = 3 * (Math.PI / 180);
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
        circle(MINIMAP_SCALE_FACTOR * this.x, 
            MINIMAP_SCALE_FACTOR * this.y, 
            MINIMAP_SCALE_FACTOR * this.radius);
        stroke("black");
        line(MINIMAP_SCALE_FACTOR * this.x, MINIMAP_SCALE_FACTOR * this.y,
            MINIMAP_SCALE_FACTOR * (this.x + Math.cos(this.rotationAngle) * 30),
            MINIMAP_SCALE_FACTOR *( this.y + Math.sin(this.rotationAngle) * 30));
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        // this.length = 0; // Default length, should be adjusted by the cast method
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;
        this.wasHitVertical = false;

        this.isRayFacingDown =  this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;
        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        let xstep;
        let ystep;
        let xintercept;
        let yintercept;



        //////////////////////////////////////////
        // HORIZONTAL RAY_GRID INTERSECTION CODE //
        //////////////////////////////////////////

        var foundHorzWallhit = false;
        let horWallHitX = 0;
        let horWallHitY = 0;
        //Calculate intersections with the map based on rayAngle
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
        ystep *= this.isRayFacingUp ? -1 : 1;

        xstep = TILE_SIZE / Math.tan(this.rayAngle);
        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
        xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

        //////////////////////////////////////////////////////////
        /// HORIZONTAL WALL INTERSECTION
        //////////////////////////////////////////////////////////
        let nextHorzTouchX = xintercept;
        let nextHorzTouchY = yintercept;
        // console.log(nextHorzTouchX);
        // If to First Calculates//
        if (this.isRayFacingUp)
                nextHorzTouchY--;
        while(nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH &&  nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT)
        {
            // Fixing offset //
            // if(grid.hasWallAt(nextHorzTouchX, nextHorzTouchY - this.isRayFacingUp ? 1 : 0))
            if(grid.hasWallAt(nextHorzTouchX, nextHorzTouchY))
            {
                foundHorzWallhit = true;
                horWallHitX = nextHorzTouchX;
                horWallHitY = nextHorzTouchY;
                // console.log(" foundHorzWallhit -->>>", foundHorzWallhit);
                // debug
                // stroke("red");
                // line(player.x, player.y, horWallHitX, horWallHitY);
                break;
            }
            else
            {
                nextHorzTouchX += xstep;
                nextHorzTouchY += ystep;
            }
        }
        //---------------------------------------------------------//
        
        //////////////////////////////////////////////////////////
        // VERTICAL RAY_GRID INTERSECTION CODE //
        //////////////////////////////////////////////////////////
        var foundVerWallhit = false;
        let verWallHitX = 0;
        let verWallHitY = 0;
        //Calculate intersections with the map based on rayAngle
        // console.log("isRayFacingRight", this.isRayFacingRight);
        
        //////////////////////////////////////////
        // X-Intercept and Y-Intercept //
        //////////////////////////////////////////

        // Find the X-coordinate of the closeet vertical grid intersection
        xintercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
        xintercept += this.isRayFacingRight ? TILE_SIZE: 0;
        
        // Find the x-coordinate of the closeet vertical grid intersection
        yintercept = player.y + (xintercept - player.x) * Math.tan(this.rayAngle);

        //Calculate increment xstep and ystep
        xstep = TILE_SIZE;
        xstep *= this.isRayFacingLeft ? -1 : 1;

        ystep = TILE_SIZE * Math.tan(this.rayAngle);
        ystep *= (this.isRayFacingUp && ystep > 0) ? -1 : 1;
        ystep *= (this.isRayFacingDown && ystep < 0) ? -1 : 1;

        //////////////////////////////////////////////////////////
        /// VERTICAL WALL INTERSECTION
        //////////////////////////////////////////////////////////
        let nextVerTouchX = xintercept;
        let nextVerTouchY = yintercept;
        // console.log(nextVerTouchX);

        // If to first Calculates//
        if (this.isRayFacingLeft)
                nextVerTouchX--;
        while(nextVerTouchX >= 0 && nextVerTouchX <= WINDOW_WIDTH &&  nextVerTouchY >= 0 && nextVerTouchY <= WINDOW_HEIGHT)
        {
            // Fixing offset //
            //
          //  if(grid.hasWallAt(nextVerTouchX, nextVerTouchY))
            if(grid.hasWallAt(nextVerTouchX, nextVerTouchY))
            // if(grid.hasWallAt(nextHorzTouchX  - this.isRayFacingLeft ? 1 : 0,nextHorzTouchY))

            {
        
                foundVerWallhit  = true;
                verWallHitX = nextVerTouchX;
                verWallHitY = nextVerTouchY;
                // console.log(" foundVerWallhit -->>>",foundVerWallhit);
                // debug
                // stroke("red");
                // line(player.x, player.y, verWallHitX, verWallHitY);
                break;
            }
            else
            {

                nextVerTouchX += xstep;
                nextVerTouchY += ystep;
            }
        }
        // calculate both horizontal and vertical distances and choose the smallest value
        let horHitDistance =  (foundHorzWallhit) 
        ? distanceBetweenPooints(player.x, player.y, horWallHitX, horWallHitY) 
        : Number.MAX_VALUE;
        // console.log("foundHorzWallhit -->>>",horHitDistance);
        let verHitDistance = (foundVerWallhit)
            ? distanceBetweenPooints(player.x, player.y, verWallHitX, verWallHitY)
            : Number.MAX_VALUE;
        
        this.wallHitX = (horHitDistance < verHitDistance) ? horWallHitX : verWallHitX;
        this.wallHitY = (horHitDistance < verHitDistance) ? horWallHitY : verWallHitY;
        // console.log("Wall Hit X -->>>",this.wallHitX);
        // console.log("Wall Hit Y -->>>",this.wallHitY);
        this.distance = (horHitDistance < verHitDistance) ? horHitDistance : verHitDistance;
        this.wasHitVertical = (verHitDistance < horHitDistance);
    }
    render() {
        stroke("rgb(10, 251, 71)");
        // stroke("rgb(255, 0, 0)");


        // line(player.x, player.y, Math.cos(this.rayAngle) * 30, Math.sin(this.rayAngle) * 30);
        line(MINIMAP_SCALE_FACTOR * player.x, MINIMAP_SCALE_FACTOR * player.y,
             MINIMAP_SCALE_FACTOR * this.wallHitX,MINIMAP_SCALE_FACTOR * this.wallHitY);
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
    let columnId = 0;
    let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);
    rays = [];
    
    //////////////////////////////////
    // Loop to validate the direction of the ray.
    ///////////////////////////////////
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < NUM_RAYS; i++) {
        let ray = new Ray(rayAngle);
        ray.cast(columnId);
        rays.push(ray);
        rayAngle += FOV_ANGLE / NUM_RAYS;
        columnId++;
    }
}

function render3DProjectedWalls()
{
    // loop every ray in the array of rays
    for(let i = 0; i < NUM_RAYS; i++)
    {
        let ray = rays[i];
        let correctWallDistance = ray.distance * Math.cos(ray.rayAngle - player.rotationAngle);
        let distanceProjectionPlane = (WINDOW_WIDTH / 2) / Math.tan(FOV_ANGLE / 2);
        let wallStripHeight = (TILE_SIZE / correctWallDistance) * distanceProjectionPlane;
        let alpha = 170 / correctWallDistance
        fill("rgba(255, 255, 255, " + alpha + ")");
        noStroke();
        rect(
        
            i * WALL_STRIP_WIDTH,
            (WINDOW_HEIGHT / 2) - (wallStripHeight / 2),
            WALL_STRIP_WIDTH,
            wallStripHeight
        );
    }
}
function normalizeAngle(angle) {
    angle %= 2 * Math.PI;
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
}

function distanceBetweenPooints(x1, y1, x2, y2)
{
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1 ) * (y2 - y1));
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    // castAllRays(); // Initial casting
}
function update()
{
    player.update();
    castAllRays(); // Recast all rays each frame
}
function draw() {
   clear("#212121");
    update();
    render3DProjectedWalls();
    grid.render();
    rays.forEach(ray => ray.render());
    player.render();
}
