
///BACKGROUND COLOR///¨
ackground(173, 216, 230);
let canvasWidth = 0;
let canvasHeight = 0;

//** Ball Properties *****
const Ball={
    x : 0,
    y : 0,
    radius : 30,
    velocityX : 0,
    velocityY : 0,
    gravity : 0.1,
    rotation : 0
};  

//** Platform Properties *****
const Platform = {
    x : 0,
    y : 0,
    velocity : 0,
    width : 0,
    height : 0
};
platform = Platform;

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
}


//*****************************


//*****************************

// Functions

function setup(){
    createCanvas(800,900);
    frameRate(30);
    canvasWidth = 800;
    canvasHeight = 900;
    platform.x = canvasWidth/2;
    platform.y = canvasHeight/10*8;
    platform.width = canvasWidth/6;
    platform.height = canvasHeight/30;
    ballPositionX = canvasWidth /2;
    ballPositionY = canvasHeight/10;
}

//************** */

//BACKGROUND DRAW///

function generateClouds(count){
    let clouds = [];
    for (let i=0;i<count;i++){
        
        let cloudX = Math.floor(Math.random() * canvasWidth /cloudCount  * (i+1));
        let cloudY = Math.floor(Math.random() * canvasWidth /6 + 30);

        if (i>0 && Math.abs(cloudX-clouds[i-1].x) < canvasWidth /cloudCount){
            cloudX += canvasWidth /(cloudCount+2);
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
    background(173, 216, 230);

    //CLOUDS//
  
    if (cloudsDrawn === false){
        
        clouds = generateClouds(cloudCount);
        cloudsDrawn = true;
        console.log(clouds);
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
        platform.velocity = b platform.velocity + platformBaseMovement/5;
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

    ball = Ball;
    drawBackground();
     drawPlatform();
     ballCollisions();
    
    ballMovement();
     drawBall();
    
}
