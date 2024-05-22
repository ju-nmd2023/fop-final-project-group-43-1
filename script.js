const MAX_VELOCITY = 30;
const CLOUD_COUNT = 5;
const CLOUD_DETAIL = 4;
const SCORE_INCREMENT = 1000;
const LIVES = 4;
const canvas = document.getElementById('gameCanvas');
const score = document.getElementById('scoreValue');
const lives = document.getElementById('livesCount');
let canvasWidth = canvas.clientWidth;
let canvasHeight;
let scoreValue = 0;



document.getElementById('startGameButton').addEventListener('click', function() {
    // Hide the start button
    this.style.display = 'none';
    document.getElementById('')
    const mainContainer = document.getElementById('gameCanvas');
    mainContainer.style.display = 'block';

    let startScreenElements = document.getElementsByClassName('startScreen');
    for (let i=0; i<startScreenElements.length;i++){
        startScreenElements[i].style.display = 'none';
    }

    let scoreTexts = document.getElementsByClassName('scoreText');
    for (let i=0; i<scoreTexts.length;i++){
        scoreTexts[i].style.display = 'inline-block';
    }

    
    // Show the game canvas
    //document.getElementById('mainContainer').style.display = 'none';
    canvas.style.display = 'block';
    
    // Start the game
    let game = new p5(myp5,mainContainer);
    
});

const myp5 = p => {
    class GameLevel{
        constructor(platform,ball,obstaclesCount, bckgndColor,p){
            this.p = p;
            this.platform = platform;
            this.balls = [ball];
            this.ballsCount = 1;
            this.obstCount = obstaclesCount;
            this.obstSpeed = 0;
            this.score = 0;
            this.lives = LIVES;
            this.obstacles = this.generateObstacles();
            this.background = new Background(bckgndColor,p);
            this.playing = true;
            this.level = 0;
        }

        update(){
            score.innerText = Math.floor(this.score);
            lives.innerText = this.lives;
            if (this.playing){
                //Pass Levels based on Score:
                if (this.level != Math.floor(this.score/1000)){
                    this.level = Math.floor(this.score/1000);
                    if (this.level <= 2){
                        this.obstCount = this.level*2;
                        this.obstacles = this.generateObstacles();
                    }
                }
                
                if (this.level >= 3){
                    if (this.ballsCount == 1){
                        this.ballsCount = 2;
                        this.platform.width *= 2;
                        let newBall = new Ball(4.5 * canvasWidth/10 ,canvasHeight/10,this.p);
                        this.balls[1] = newBall;
                    }
                    this.obstSpeed = Math.floor(this.score/800);
                    for (let i=0; i< this.obstCount; i++){
                        this.obstacles[i].animate(this.obstSpeed);
                    }
                }
                this.platform.platformMovement();
                
                //Evaluation is a struct {ScoreChange,LivesCountChange}
                for (let i=0; i<this.balls.length; i++){
                    let evaluation = this.balls[i].collisions(this.platform,this.obstacles,this.balls);
                
                    this.balls[i].move();
                    this.score += evaluation.scoreChange;
                    this.lives += evaluation.livesChange;
                }
                

                if (this.lives == 0){
                    this.gameOver = true;
                    this.playing = false;
                }

                
            }
            
        }

        draw(){

            this.background.color = this.p.color((Math.min(LIVES-this.lives,1))*30+100,200 - (LIVES-this.lives)*50,230 - (LIVES-this.lives)*70);
            this.background.draw();
            this.platform.drawPlatform();
            for (let i=0; i<this.ballsCount; i++){
                this.balls[i].drawBall();
            }
            
            
            for (let i=0; i<this.obstacles.length; i++){
                this.obstacles[i].drawObstacle();
            }
            this.p.noStroke();
            this.p.fill(50,200,200);
            this.p.textSize(50);
            this.p.text("Level "+this.level,canvasWidth/100,canvasHeight/20);
            this.drawHearts();
        }

        drawHearts() {
            // Define heart properties
            let heartSize = 70 * (1 + (Math.sin(this.p.frameCount * this.p.PI /60)+0.8)/4 * Math.floor(1/this.lives)); // Size of each heart
            let heartPadding = 10; // Spacing between hearts
            let heartsX = canvasWidth*0.95; // X-coordinate to start drawing hearts
            let heartsY = canvasHeight/20; // Y-coordinate to draw hearts
        
            // Draw hearts based on remaining lives
            for (let i = 0; i < this.lives; i++) {
                // Calculate position for each heart
                let x = heartsX - (heartSize + heartPadding) * i;
                let y = heartsY;
        
                // Draw a heart shape
                this.drawHeart(x, y, heartSize);
            }
        }
        
        drawHeart(x, y, size) {
            // Draw a heart shape at the specified position and size
            this.p.fill(255, 0, 0); // Red color
            this.p.stroke(255, 0, 0); // Red color for outline
            this.p.beginShape();
            this.p.vertex(x, y + size * 0.5);
            this.p.bezierVertex(x, y, x - size * 0.5, y - size * 0.5, x, y - size * 0.2);
            this.p.bezierVertex(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.5);
            this.p.endShape(this.p.CLOSE);
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
                
                // Define the obstacle's width and height with a random size
                width = Math.random() * (canvasWidth / 6) + canvasWidth / 16; // Minimum width of canvasWidth / 16
                height = Math.random() * (canvasHeight / 5) + canvasHeight / 16; // Minimum height of canvasWidth / 16
    
                // Random position within the canvas bounds, accounting for the obstacle's size
                x = i*minDistance + Math.random() * (minDistance - width) ;
                y = Math.random() * (2* canvasHeight/3 - height );
                
                for (let i=0; i<this.balls.length; i++){
                    if (x <= this.balls[i].x){
                        x = this.p.constrain(x,20,this.balls[i].x - this.balls[i].radius/2 - width)
                    }
                    else{
                        x = this.p.constrain(x,this.balls[i].x + this.balls[i].radius/2 + width,canvasWidth);
                    }
                }
                
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
                let cloudY = Math.floor(Math.random() * canvasWidth /4 + 30);
        
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
            this.radius = canvasHeight/15;
            this.velocityX = 0;
            this.velocityY = 0;
            this.gravity = 0.2;
            this.rotation = 0;
            this.bounced = false;
            this.p = p;
        }
        
        move(){
            if (Math.abs(this.velocityY) > MAX_VELOCITY){
                //If velocity exceeds 40 reduce it
                const velocityReductionFactor = 0.95;
                this.velocityY *= velocityReductionFactor;
            }
            this.velocityY = this.velocityY + this.gravity;
            
            this.y= this.y + this.velocityY;
            this.x = this.x + this.velocityX ;

            
        }

        collisions(platform,obstacles,balls){
            //******* Check for platform collision **********
            let scoreChange = 0;
            let livesChange = 0;
            let ballEdgeBottom = this.y + this.radius;
            let ballLeftEdge = this.x - this.radius;
            let ballRightEdge = this.x + this.radius;

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
                scoreChange += (this.velocityY + this.velocityX)/2 + SCORE_INCREMENT;
                this.y = platform.y - this.radius;
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
                    this.x = collisionInfo.collisionPoint.x + (this.radius) * collisionInfo.normal.x;
                    this.y = collisionInfo.collisionPoint.y + (this.radius) * collisionInfo.normal.y;
                }

            }
            
            for (let i=0; i<balls.length; i++){
                if (this != balls[i]){
                    let collisionInfo = this.calculateCollisionPointAndNormal(balls[i]);
                    if (collisionInfo != null){
                        this.adjustTrajectory(collisionInfo.normal.x,collisionInfo.normal.y);
                        this.x = collisionInfo.collisionPoint.x + (this.radius) * collisionInfo.normal.x;
                        this.y = collisionInfo.collisionPoint.y + (this.radius) * collisionInfo.normal.y;
                        balls[i].x = this.x + (-1) * this.radius * collisionInfo.normal.x;
                        balls[i].y = this.y + (-1) * this.radius * collisionInfo.normal.y;
                }
                }
            }
            //if ball drops below canvas
            if(this.y>canvasHeight){
                this.x = canvasWidth /2;
                this.y = canvasHeight/10;
                this.velocityY = 0;
                livesChange--;
                
            }
            //if ball hits the ceiling
            else if (this.y < this.radius){
                this.y = this.radius;
                this.velocityY = this.velocityY * (-1);
            }
            else if (this.x < this.radius){
                this.x = this.radius;
                this.velocityX = this.velocityX *(-1);
            }
            else if (this.x > canvasWidth - this.radius){
                this.x = canvasWidth - this.radius;
                this.velocityX = this.velocityX * (-1);
            }

            //Return updated scoreValue;
            return {scoreChange,livesChange}

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
            let collisionPoint;
            let obstacleWidth;
            let obstacleHeight;
            let closestX;
            let closestY;
            console.log(this);
            if (obstacle instanceof Ball){
                let ballDistX = Math.abs(this.x - obstacle.x);
                let ballDistY = Math.abs(this.y - obstacle.y);
                if (ballDistX*ballDistX + ballDistY*ballDistY <= this.radius * this.radius){
                    collisionPoint = {x: Math.min(this.x,obstacle.x) + (this.x)}
                }
                
                
            }
            else{
                obstacleHeight = obstacle.height;
                obstacleWidth = obstacle.width;

                closestX = this.p.constrain(this.x, obstacle.x, obstacle.x + obstacleWidth);
                closestY = this.p.constrain(this.y, obstacle.y, obstacle.y + obstacleHeight);

                // Calculate the distance from the ball's center to the closest point
                let distanceX = this.x - closestX;
                let distanceY = this.y - closestY;

                // Check if the ball is colliding with the obstacle
                if (distanceX * distanceX + distanceY * distanceY < this.radius * this.radius) {
                    // Collision detected
                    collisionPoint = { x: closestX, y: closestY };

                    // Calculate the normal at the collision point
                    let normal = { x: 0, y: 0 };
                    if (closestX === obstacle.x) {
                        normal.x = -1; // Left edge
                    } else if (closestX === obstacle.x + obstacleWidth) {
                        normal.x = 1; // Right edge
                    }
                    if (closestY === obstacle.y) {
                        normal.y = -1; // Top edge
                    } else if (closestY === obstacle.y + obstacleHeight) {
                        normal.y = 1; // Bottom edge
                    }
                
            
                
                    // Normalize the normal vector if it's a corner collision
                    if (normal.x !== 0 && normal.y !== 0) {
                        let magnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                        normal.x /= magnitude;
                        normal.y /= magnitude;
                    }
                    
                    return { collisionPoint, normal }
                    
                }

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
                    this.p.fill(255,0,0);    
                }
                else{
                    this.p.fill(255,255,255);
                }
                
                this.p.arc(this.x, this.y, this.radius/2, this.radius/2, startangle + this.rotation, startangle + this.rotation+this.p.PI/3);
            }
        }
    }

    //************************

<<<<<<< Updated upstream
    //** Platform Properties *****
    class Platform {
        constructor(posX,posY,width,p){
            this.x = posX;
            this.y = posY;
            this.velocity = 0;
            this.width = width;
            this.height = width/5;
            this.p = p;
=======
//** Platform Properties *****
class Platform {
    constructor(posX,posY,width){
        this.x = posX;
        this.y = posY;
        this.velocity = 0;
        this.width = width;
        this.height = width/5;
    }

    drawPlatform(){
        this.platformMovement();
        stroke(20,20,20);
        fill(150,75,0);
        rect(this.x,this.y,this.width,this.height);
    }

    platformMovement(){
        if (keyIsDown(37) || keyIsDown(65)){
            this.velocity = this.velocity - 2;
            this.x = this.x + this.velocity;
>>>>>>> Stashed changes
        }

        drawPlatform(){
            this.p.stroke(20,20,20);
            this.p.fill(0,0,0);
            this.p.rect(this.x,this.y,this.width,this.height);
        }

        platformMovement(){
            if (this.p.keyIsDown(37) || this.p.keyIsDown(65)){
                this.velocity = this.velocity - canvasWidth/500;
                this.x = this.x + this.velocity * this.p.deltaTime /100;
            }
            if (this.p.keyIsDown(39) || this.p.keyIsDown(68)){
                this.velocity = this.velocity + canvasWidth/500;
                this.x = this.x + this.velocity * this.p.deltaTime /100;
                
            }

            
            //Smooth down velocity when not pressing buttons
            if (this.velocity != 0){
                if (Math.abs(this.velocity) < 0.1){
                    this.velocity = 0;
                }
                this.velocity *= 0.8;


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
            speed = this.p.constrain(speed,0,6);
            this.x += Math.sin(this.p.frameCount * this.p.PI/64) * Math.sin(this.p.frameCount * this.p.PI/32) * speed;
            this.y += Math.cos(this.p.frameCount* this.p.PI/64) * Math.sin(this.p.frameCount * this.p.PI/32) *speed;
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
                const cloudSpeed = 0.01; // Adjust as needed
                this.ellipses[i].x += Math.abs(Math.sin(this.x * cloudSpeed)) +0.5 ;     //Move the ellipse slightly to the right
                
                //If the ellipse goes past the right border of the canvas, move it back to the left
                if (this.ellipses[i].x > canvasWidth + canvasWidth/CLOUD_COUNT){
                    this.ellipses[i].x -= canvasWidth + canvasWidth/(CLOUD_COUNT-1);
                }
            }
        }
    }

<<<<<<< Updated upstream
    //*****************************
=======
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

function checkBallLives() {
    if (gameLevel.lives == 0) {
        console.log("you lose");
    }
}




>>>>>>> Stashed changes

    // Functions

    p.setup = function(){

        canvasHeight = p.windowHeight*0.8;


        const myCanvas = p.createCanvas(canvasWidth, canvasHeight);
        p.frameRate(30);
        myCanvas.parent(canvas);
        let platform = new Platform(canvasWidth/2 + canvasWidth/10,canvasHeight/10 *9,canvasWidth/15,p);
        let ball = new Ball(canvasWidth/2,canvasHeight/10,p);
        gameLevel = new GameLevel(platform,ball,0,p.color(150, 200, 230),p);
    }

    //*****************************************************************

    p.draw = function(){
        p.clear();
        gameLevel.update();
        gameLevel.draw();

    }

}