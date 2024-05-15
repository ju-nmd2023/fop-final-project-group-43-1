
///BACKGROUND COLOR///¨
background(173, 216, 230);
let canvasWidth = 0;
let canvasHeight = 0;

//** Ball Properties *****
class Ball{
    constructor(posX,posY){
        this.x = posX;
        this.y = posY;
        this.radius = 30;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.2;
        this.rotation = 0;
        this.bounced = false;
    }
    
    move(){
        if (abs(this.velocityY) > 40){
            this.velocityY = this.velocityY/abs(this.velocityY) * 35;
            fill(0,0,0);
            text(this.velocityY,400,500);
        }
        this.velocityY = this.velocityY + this.gravity;
        
        this.y= this.y + this.velocityY;
        //console.log(this.velocityX);
        this.x = this.x + this.velocityX;

        
    }

    collisions(platform){

        let ballEdgeBottom = this.y + this.radius/2;
        let platformBottom = platform.y + platform.height;
        let YinBounds = ballEdgeBottom >= platform.y;
        let YwillBeInBounds = (ballEdgeBottom + this.velocityY >= platformBottom && this.y <= platform.y);
        
        let XinBounds = this.x + this.radius/2 >= platform.x &&
                    this.x <= platform.x + platform.width;

             
        if ((YinBounds || YwillBeInBounds) && XinBounds){

            
            this.y = platform.y - this.radius/2;
            this.velocityY = this.velocityY * (-1.5);
            let randomBounce = Math.random();
            this.velocityX = platform.velocity * (0.6) + (this.velocityX + 1)  * (randomBounce - 0.5)/abs(randomBounce-0.5)*0.4;

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

    }

    drawBall(platform){
        ball.move();
        ball.collisions(platform);
        
        stroke(255,0,0);
        fill(255,0,0);
        ball.rotation=PI/50+ball.rotation+ball.velocityY/20;
        for(let i=0;i<6;i++){
            let startangle=i*PI/3;
            if (i%2===0){
                //stroke(255,0,0);
                fill(255,0,0);    
            }
            else{
                //stroke(255,255,255);
                fill(255,255,255);
            }
            
            arc(ball.x,ball.y,ball.radius,ball.radius,startangle+ball.rotation,startangle+ball.rotation+PI/3);
        }
    }
}
let ball = new Ball(0,0);

//************************

//** Platform Properties *****
class Platform {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.velocity = 0;
        this.width = 0;
        this.height = 0;
    }

    drawPlatform(){
        this.platformMovement();
        stroke(0,0,0);
        fill(0,0,0);
        rect(this.x,this.y,this.width,this.height);
    }

    platformMovement(){
        if (keyIsDown(37) || keyIsDown(65)){
            this.velocity = this.velocity - 2;
            this.x = this.x + this.velocity;
        }
        if (keyIsDown(39) || keyIsDown(68)){
            this.velocity = this.velocity + 2;
            this.x = this.x + this.velocity;
            
        }

        
        //Smooth down velocity when not pressing buttons
        if (this.velocity != 0){
            if (abs(this.velocity) < 0.1){
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
let platform = new Platform();
//****************************


//*** Clouds Properties ******
let cloudsDrawn = false;
let cloudCount = 3;
let cloudDetail = 10;
class Cloud{
    constructor(x,y,ellipses){
        this.x = x;
        this.y = y;
        this.ellipses = ellipses;
    }

    drawCloud(){
        for (let j=0;j<cloudDetail;j++){
            stroke(255,255,255);
            fill(255,255,255);
            ellipse(this.ellipses[j].x,this.ellipses[j].y,this.ellipses[j].width,this.ellipses[j].height);
            
        }
    }

}

//*****************************

// Functions

function setup(){
    createCanvas(800,1000);
    frameRate(30);
    canvasWidth = 800;
    canvasHeight = 1000;
    
    platform.width = canvasWidth/6;
    platform.height = canvasHeight/30;
    platform.x = canvasWidth/2;
    platform.y = canvasHeight/10*8;

    ball.x = canvasWidth /2;
    ball.y = canvasHeight/10;
}

//******** Background Draw ****************************************
function generateClouds(count){
    let clouds = [];
    for (let i=0;i<count;i++){
        
        let cloudX = Math.floor(Math.random() * canvasWidth /(cloudCount+1) );
        let cloudY = Math.floor(Math.random() * canvasWidth /6 + 30);

        cloudX += canvasWidth /(cloudCount) * i;
        if (i>0 && Math.abs(cloudX-clouds[i-1].x) < canvasWidth /cloudCount + 100){
            cloudX += canvasWidth /(cloudCount+1);
        }
        if (i>0 && Math.abs(cloudY-clouds[i-1].y) < canvasWidth /(cloudCount+1) ){
            cloudY += canvasWidth /(cloudCount+4);
        }

        //Create Random Ellipses for the Cloud
        randomEllipses = [];
        for(let j=0;j<cloudDetail;j++){
            const ellipse = {
                x: cloudX + Math.floor(Math.random() * canvasWidth /10),
                y: cloudY + Math.floor(Math.random() * canvasWidth /15),
                width: Math.random() * canvasWidth /10 + canvasWidth/10,
                height: Math.random() * canvasWidth /20 + canvasWidth/15
            };
            
            randomEllipses.push(ellipse);
        }

        cloud = new Cloud(cloudX,cloudY,randomEllipses);
        clouds.push(cloud);
        
    }
    return clouds;
}

function drawBackground(){
    ///BACKGROUND COLOR///¨
    background(170, 215, 230);

    //CLOUDS//
  
    if (cloudsDrawn === false){
        
        clouds = generateClouds(cloudCount);
        cloudsDrawn = true;
        //console.log(clouds);
    }
    else{
        for (let i=0;i<cloudCount;i++){
            for (let j=0;j<cloudDetail;j++){
                stroke(255,255,255);
                fill(255,255,255);
                ellipse(clouds[i].ellipses[j].x,clouds[i].ellipses[j].y,clouds[i].ellipses[j].width,clouds[i].ellipses[j].height);
                
            }



            //************** Platform Movement and Draw ***********************
function drawPlatform(){
    platformMovement();
    stroke(0,0,0);
    fill(0,0,0);
    rect(platform.x,platform.y,platform.y,platform.height);
}

function platformMovement(){
    if (keyIsDown(37)){
        platform.velocity = platform.velocity - platformBaseMovement/5;
        platform.x = platform.x + platform.velocity;
    }
    if (keyIsDown(39)){
        platform.velocity = platform.velocity + platformBaseMovement/5;
        platform.x = platform.x + platform.velocity;
        
    }   
    
    //platform.x = platform.x + platform.velocity;
    if (platform.velocity != 0){
        if (abs(platform.velocity) < 0.5){
            platform.velocity = 0;
        }
        if (platform.velocity > 0){
            platform.velocity = platform.velocity - platform.velocity/10;
        }
        if (platform.velocity < 0){
            platform.velocity = platform.velocity - platform.velocity/10;
        }
    }
    platform.x = platform.x + platform.velocity;
}
//*****************************************************************

// Ball Draw and Behaviour//

function ballMovement(){
    if(ballPositionY<canvasHeight){
        if (force > 0.3){
            force = force - 0.1;
        }
        else {
            force = 0;
        }
        ballVelocityY = ballVelocityY + gravity - force;
        if (ballVelocityY < -4){
            ballVelocityY = -4;
        }
        if (ballVelocityY > 4){
            ballVelocityY = 4;
        }
        if (abs(ballVelocityY) < 0.1){
            ballVelocityY = 0;
        }
        ballPositionY= ballPositionY+ballVelocityY;
    }
}

function drawBall(){
    stroke(255,0,0);
    fill(255,0,0);
    ballRotation=PI/50+ballRotation+ballVelocityY/20;
    ballPositionY = ballPositionY + abs(ballVelocityY);
    for(let i=0;i<6;i++){
        startangle=i*PI/3;
        if (i%2===0){
            //stroke(255,0,0);
            fill(255,0,0);    
        }
        else{
            //stroke(255,255,255);
            fill(255,255,255);
        }
        
        arc(ballPositionX,ballPositionY,ballRadius,ballRadius,startangle+ballRotation,startangle+ballRotation+PI/3);
    }
}

function ballCollisions(){
    collision = false;
    YinBounds = ballPositionY + ballRadius/2 >= platform.y && 
                ballPositionY <= platform.y + platform.height;
    text(force,200,100);
    
    if (YinBounds){
        gravity = 0;
        ballVelocityY = ballVelocityY * (-2) ;
        text(ballVelocityY,300,100);
        
    }
    else{
        gravity = 0.1;
    }
}

function draw(){
    clear();

    drawBackground();
    platform.drawPlatform();
    //ballCollisions();
    
    //ballMovement();
    ball.drawBall(platform);
    fill(0,0,0);
    text(ball.velocityX, 200,300);
    text(ball.velocityY,200,320);
    text(ball.y,200,350);
    text(ball.x,200,370);
}









