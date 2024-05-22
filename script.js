const MAX_VELOCITY = 30;
const CLOUD_COUNT = 5;
const CLOUD_DETAIL = 4;

const canvas = document.getElementById('gameContainer');
const score = document.getElementById('score');
let canvasWidth;
let canvasHeight;
let scoreValue = 0;



document.getElementById('startGameButton').addEventListener('click', function() {
    // Hide the start button
    this.style.display = 'none';
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.style.display = 'block';

    // Show the game canvas
    //document.getElementById('mainContainer').style.display = 'none';
    canvas.style.display = 'block';
    
    // Start the game
    let game = new p5(myp5,mainContainer);
    
});

const myp5 = p => {
    class GameLevel{
        constructor(platform,balls,obstaclesCount, bckgndColor,p){
            this.platform = platform;
            this.balls = balls;
            this.obstCount = obstaclesCount;
            this.score = 0;
            this.lives = 3;
            this.obstacles = this.generateObstacles();
            this.background = new Background(bckgndColor,p);
            this.playing = true;
            this.p = p;
        }

        update(){
            score.innerText = 'Score: ' + this.score;
            if (this.playing){
                for (let i=0; i< this.obstCount; i++){
                    //this.obstacles[i].animate(2);
                }
                this.platform.platformMovement();
                for (let i=0; i<this.balls.length; i++){
                    this.balls[i].collisions(this.platform,this.obstacles,this.score);
                    this.balls[i].move();
                }
            }
            
        }

        draw(){
            this.background.draw();
            this.platform.drawPlatform();
            for (let i=0; i<this.balls.length; i++){
                this.balls[i].drawBall();
            }
            for (let i=0; i<this.obstacles.length; i++){
                this.obstacles[i].drawObstacle();
            }
        }

        generateObstacles() {
            let obstacleCount = this.obstCount;
            let obstacles = [];
            let minDistance = canvasWidth/obstacleCount;

            let x;
            let y;
            let width;
            let height;
            for (let i = 0; i < obstacleCount; i++) {
                
                let overlap;
                do {
                    overlap = false;
                    // Define the obstacle's width and height with a random size
                    width = Math.random() * (canvasWidth / 6) + 20; // Minimum width of 20
                    height = Math.random() * (canvasHeight / 5) + 20; // Minimum height of 20
        
                    // Random position within the canvas bounds, accounting for the obstacle's size
                    x = i*minDistance + Math.random() * (minDistance - width) ;
                    y = Math.random() * (canvasHeight/3 - height );
                    
                    for (let i=0; i<this.balls.length; i++){
                        if (this.balls[i].x - this.radius/2 >= x && this.balls[i].x + this.radius/2 <= x + width ||
                             this.balls[i].y + this.radius/2 <= y){
                                overlap = true;
                            }
                    }
                    
                    // Check if the new obstacle is too close to existing obstacles
                    // for (let j = 0; j < obstacles.length; j++) {
                    //     let other = obstacles[j];
                    //     let dx = x - other.x;
                    //     let dy = y - other.y;
                    //     let distance = Math.sqrt(dx * dx + dy * dy);
        
                    //     if (distance < minDistance) {
                    //         overlap = true; // Too close to another obstacle
                    //         break;
                    //     }
                    // }
                } while (overlap); // Keep trying until it's not overlapping
                
                let obstacle = new Obstacle(x,y,width,height,p);
                console.log(obstacle);
                // Add the non-overlapping obstacle to the array
                obstacles.push(obstacle);
            }
            console.log(obstacles);
            console.log(obstacles.length);
            return obstacles;
        }
    }
    let gameLevel;

    class Background{
        constructor(color,p){
            this.color = color;
            this.clouds = this.generateClouds(CLOUD_COUNT);
            this.p = p;
        }

        update(){
            for (let i=0; i<CLOUD_COUNT; i++){
                this.clouds[i].animateCloud();
            }
            
            if (streak == true){
                color = color + Math.sin(clouds[0].x) * 5;
            }
        }

        draw(){
            this.p.background(this.color);
            for (let i=0; i<CLOUD_COUNT; i++){
                this.clouds[i].drawCloud();
            }
        }

        generateClouds(count){
            let clouds = [];
            
            //For each cloud
            for (let i=0;i<count;i++){
                
                //Set X and Y to approximately this.p.fill the width of the canvas with all the clouds
                let cloudX = Math.floor(Math.random() * canvasWidth /(CLOUD_COUNT+1) );
                let cloudY = Math.floor(Math.random() * canvasWidth /6 + 30);
        
                cloudX += canvasWidth /(CLOUD_COUNT) * i;    //Move the cloud to the right as many times as already created clouds
                
                //If current cloud is too close to previous cloud, increase distance
                if (i>0 && Math.abs(cloudX-clouds[i-1].x) < canvasWidth /CLOUD_COUNT + 100){
                    cloudX += canvasWidth /(CLOUD_COUNT+1);
                }
                if (i>0 && Math.abs(cloudY-clouds[i-1].y) < canvasWidth /(CLOUD_COUNT+1) ){
                    cloudY += canvasWidth /(CLOUD_COUNT+4);
                }
        
                //Create Random Ellipses for the Cloud
                let randomEllipses = [];
                for(let j=0;j<CLOUD_DETAIL;j++){
                    
                    //Create ellipse objects
                    const ellipse = {
                        //Random X and Y close to the Cloud's overall X and Y
                        x: cloudX + Math.floor(Math.random() * canvasWidth /10),
                        y: cloudY + Math.floor(Math.random() * canvasWidth /15),
                        //Random Width and Height based on the canvas size
                        width: Math.random() * canvasWidth /10 + canvasWidth/10,
                        height: Math.random() * canvasWidth /20 + canvasWidth/15
                    };
                    //Place the current ellipse into the array randomEllipses
                    randomEllipses.push(ellipse);
                }
        
                //Create a new Cloud and give it the X Y and Ellipses array
                let cloud = new Cloud(cloudX,cloudY,randomEllipses,p);
                //Place the current cloud in the clouds array
                clouds.push(cloud);
                
            }
            return clouds;
        }
    }
    //** Ball Properties *****

    class Ball{
        constructor(posX,posY,p){
            this.x = posX;
            this.y = posY;
            this.radius = 30;
            this.velocityX = 0;
            this.velocityY = 0;
            this.gravity = 0.2;
            this.rotation = 0;
            this.bounced = false;
            this.p = p;
        }
        
        move(){
            if (Math.abs(this.velocityY) > MAX_VELOCITY){
                //If velocity exceeds 40 (or -40) then set it to 40 (or -40)
                this.velocityY = this.velocityY / Math.abs(this.velocityY) * MAX_VELOCITY;
            }
            this.velocityY = this.velocityY + this.gravity;
            
            this.y= this.y + this.velocityY;
            this.x = this.x + this.velocityX;

            
        }

        collisions(platform,obstacles,scoreValue){
            //******* Check for platform collision **********

            let ballEdgeBottom = this.y + this.radius/2;
            let ballLeftEdge = this.x - this.radius/2;
            let ballRightEdge = this.x + this.radius/2;

            let platformLeftEdge = platform.x;
            let platformRightEdge = platform.x + platform.width;
            let platformTop = platform.y;
            let platformBottom = platform.y + platform.height;
            
            //Checking if the ball's bottom is currently touching the platform, or if with current velocity
            //the ball will move past the platform, both cases are treated like hitting the platform
            let ballBottomIsHit = ballEdgeBottom >= platformTop && ballEdgeBottom <= platformBottom;
            let ballBottomShouldHit = (ballEdgeBottom + this.velocityY >= platformBottom && ballEdgeBottom <= platformTop);
            let ballBottomHit = (ballBottomIsHit || ballBottomShouldHit);

            //Checking if the ball is within the platform's width coordinates (= not to its left or right)
            let ballSideIsHit = ballRightEdge >= platformLeftEdge &&
                                ballLeftEdge <= platformRightEdge;
            let ballSideShouldHit = ballRightEdge + this.velocityX >= platformLeftEdge &&
                                    ballLeftEdge <= platformRightEdge;
            let ballInPlatformWidth = ballSideShouldHit && ballSideIsHit;

                
            // IF BALL COLLIDES WITH PLATFORM
            if (ballBottomHit && ballInPlatformWidth){

                //Update level score
                scoreValue += 10;
                this.y = platform.y - this.radius/2;
                this.velocityY = this.velocityY * (-1.05);
                let randomBounce = Math.random() - 0.5; //Effectively gives a number between -0.5 and 0.5
                let randomBounceDirection = randomBounce / Math.abs(randomBounce); //Determine whether it's negative or positive (left or right)
                this.velocityX = platform.velocity * (0.8) + (this.velocityX + 2)  * randomBounceDirection *0.5;

            }

            // //Check for obstacle collisions

            for (let i=0; i<obstacles.length; i++){

                let collisionInfo = this.calculateCollisionPointAndNormal(obstacles[i]);
                if (collisionInfo != null){
                    this.adjustTrajectory(collisionInfo.normal.x,collisionInfo.normal.y);
                    this.x = collisionInfo.collisionPoint.x + (this.radius/2 +5) * collisionInfo.normal.x;
                    this.y = collisionInfo.collisionPoint.y + (this.radius/2 +5) * collisionInfo.normal.y;
                }

            }
            
            //if ball drops below canvas
            if(this.y>canvasHeight){
                this.x = canvasWidth /2;
                this.y = canvasHeight/10;
                this.velocityY = 0;
                //lose a life
                
            }
            //if ball hits the ceiling
            else if (this.y < this.radius/2){
                this.y = this.radius/2;
                this.velocityY = this.velocityY * (-1);
            }
            else if (this.x < this.radius/2){
                this.x = this.radius/2;
                this.velocityX = this.velocityX *(-1);
            }
            else if (this.x > canvasWidth - this.radius/2){
                this.x = canvasWidth - this.radius/2;
                this.velocityX = this.velocityX * (-1);
            }

            //Return updated scoreValue;
            return scoreValue

        }

        adjustTrajectory(normalX, normalY) {

            // Calculate the dot product of velocity and normal
            let dot = this.velocityX * normalX + this.velocityY * normalY;

            // Reflect the velocity across the normal
            this.velocityX = this.velocityX - 2 * dot * normalX;
            this.velocityY = this.velocityY - 2 * dot * normalY;
        }

        calculateCollisionPointAndNormal(obstacle) {
            // Find the closest point on the obstacle to the ball's center

            let closestX = this.p.constrain(this.x, obstacle.x, obstacle.x + obstacle.width);
            let closestY = this.p.constrain(this.y, obstacle.y, obstacle.y + obstacle.height);

            // Calculate the distance from the ball's center to the closest point
            let distanceX = this.x - closestX;
            let distanceY = this.y - closestY;

            // Check if the ball is colliding with the obstacle
            if (distanceX * distanceX + distanceY * distanceY < this.radius * this.radius -1) {
                // Collision detected
                let collisionPoint = { x: closestX, y: closestY };

                // Calculate the normal at the collision point
                let normal = { x: 0, y: 0 };
                if (closestX === obstacle.x) {
                    normal.x = -1; // Left edge
                } else if (closestX === obstacle.x + obstacle.width) {
                    normal.x = 1; // Right edge
                }
                if (closestY === obstacle.y) {
                    normal.y = -1; // Top edge
                } else if (closestY === obstacle.y + obstacle.height) {
                    normal.y = 1; // Bottom edge
                }

                // Normalize the normal vector if it's a corner collision
                if (normal.x !== 0 && normal.y !== 0) {
                    let magnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                    normal.x /= magnitude;
                    normal.y /= magnitude;
                }
                
                return { collisionPoint, normal };
            }

            // No collision
            return null;
        }

        drawBall(){
            
            this.p.stroke(255,0,0);
            this.p.fill(255,0,0);
            this.rotation=this.p.PI/50 + this.rotation + this.velocityY/20;
            for(let i=0;i<6;i++){
                let startangle=i*this.p.PI/3;
                if (i%2===0){
                    //this.p.stroke(255,0,0);
                    this.p.fill(255,0,0);    
                }
                else{
                    //this.p.stroke(255,255,255);
                    this.p.fill(255,255,255);
                }
                
                this.p.arc(this.x, this.y, this.radius, this.radius, startangle + this.rotation, startangle + this.rotation+this.p.PI/3);
            }
        }
    }
    //let ball = new Ball(0,0);

    //************************

    //** Platform Properties *****
    class Platform {
        constructor(posX,posY,width,p){
            this.x = posX;
            this.y = posY;
            this.velocity = 0;
            this.width = width;
            this.height = width/5;
            this.p = p;
        }

        drawPlatform(){
            this.platformMovement();
            this.p.stroke(20,20,20);
            this.p.fill(0,0,0);
            this.p.rect(this.x,this.y,this.width,this.height);
        }

        platformMovement(){
            if (this.p.keyIsDown(37) || this.p.keyIsDown(65)){
                this.velocity = this.velocity - canvasWidth/1000;
                this.x = this.x + this.velocity;
            }
            if (this.p.keyIsDown(39) || this.p.keyIsDown(68)){
                this.velocity = this.velocity + canvasWidth/1000;
                this.x = this.x + this.velocity;
                
            }

            
            //Smooth down velocity when not pressing buttons
            if (this.velocity != 0){
                if (Math.abs(this.velocity) < 0.1){
                    this.velocity = 0;
                }
                if (this.velocity > 0){
                    this.velocity = this.velocity - this.velocity/15;
                }
                if (this.velocity < 0){
                    this.velocity = this.velocity - this.velocity/15;
                }
            }
            this.x = this.x + this.velocity;

            //Check if platform collides with edges of canvas
            if (this.x < 0){
                this.x = 0;
                this.velocity = 0;
            }
            if (this.x + this.width > canvasWidth){
                this.x = canvasWidth - this.width;
                this.velocity = 0;
            }
        }
    }

    //****************************

    //** Obstacles Properties *****
    class Obstacle {
        constructor(posX,posY,width,height,p){
            this.x = posX;
            this.y = posY;
            this.width = width;
            this.height = height;
            this.color = [Math.random() * 80 + 100,Math.random() * 80 + 100,Math.random() * 150];
            this.p = p;
        }

        drawObstacle(){
            this.p.fill(this.color[0],this.color[1],this.color[2]);
            this.p.stroke(this.color[0]-10,this.color[1]-10,this.color[2]-10);
            this.p.rect(this.x,this.y,this.width,this.height);
        }

        animate(speed){
            this.x += Math.sin(this.x) * speed;
            this.y += Math.cos(this.x) * speed;
        }
    }


    //*** Clouds Properties ******
    let cloudsGenerated = false;
    class Cloud{
        constructor(x,y,ellipses,p){
            this.x = x;
            this.y = y;
            this.ellipses = ellipses;
            this.p = p;
        }

        drawCloud(){
            this.animateCloud();
            for (let i=0;i<CLOUD_DETAIL;i++){
                this.p.stroke(255,255,255);
                this.p.fill(255,255,255);
                this.p.ellipse(this.ellipses[i].x,this.ellipses[i].y,this.ellipses[i].width,this.ellipses[i].height);
                
            }

        }

        //Animate the clouds moving to the right slowly
        animateCloud(){
            
            //For each ellipse in the cloud
            for (let i=0;i<CLOUD_DETAIL;i++){
                this.ellipses[i].x += canvasWidth/1000;     //Move the ellipse slightly to the right
                
                //If the ellipse goes past the right border of the canvas, move it back to the left
                if (this.ellipses[i].x > canvasWidth + canvasWidth/CLOUD_COUNT){
                    this.ellipses[i].x -= canvasWidth + canvasWidth/(CLOUD_COUNT-1);
                }
            }
        }
    }

    //*****************************

    // Functions

    p.setup = function(){
      


        p.createCanvas(800,1000);
        p.frameRate(30);
        canvasWidth = 800;
        canvasHeight = 1000;
    
        let platform = new Platform(canvasWidth/2 + canvasWidth/10,canvasHeight/10 *9,canvasWidth/5,p);
        let ball = new Ball(canvasWidth/2,canvasHeight/10,p);
        gameLevel = new GameLevel(platform,[ball],2,p.color(173, 216, 230),p);
    }

    //******** Background Draw ****************************************

    //Generate randomly shaped clouds. "count" is the count of clouds to be generated





    // ***************************************************************************



    //*****************************************************************

    p.draw = function(){
        p.clear();
        gameLevel.update();
        gameLevel.draw();
    }



//THE FOLLOWING LINES ARE HELP FROM CHAT GBT//

function draw() {
    clear();
    gameLevel.update();
    gameLevel.draw();
 
    // Draw hearts representing remaining lives
    drawHearts(gameLevel.lives);
}

function drawHearts(lives) {
    // Define heart properties
    let heartSize = 30; // Size of each heart
    let heartPadding = 10; // Spacing between hearts
    let heartsX = 20; // X-coordinate to start drawing hearts
    let heartsY = 60; // Y-coordinate to draw hearts

    // Draw hearts based on remaining lives
    for (let i = 0; i < lives; i++) {
        // Calculate position for each heart
        let x = heartsX + (heartSize + heartPadding) * i;
        let y = heartsY;

        // Draw a heart shape
        drawHeart(x, y, heartSize);
    }
}

function drawHeart(x, y, size) {
    // Draw a heart shape at the specified position and size
    fill(255, 0, 0); // Red color
    stroke(255, 0, 0); // Red color for outline
    beginShape();
    vertex(x, y + size * 0.5);
    bezierVertex(x, y, x - size * 0.5, y - size * 0.5, x, y - size * 0.2);
    bezierVertex(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.5);
    endShape(CLOSE);
}

function checkBallLives()








