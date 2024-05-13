
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



let cloud={
    X : 0,
    Y : 0,
    ellipsesX : [],   
    ellipsesY : [],
    ellipsesW : [],
    ellipsesH : []
};
let clouds = [];

function setup(){
    createCanvas(900,800);
    frameRate(30);
    canvasHeight=800;
    canvasWidth=900;

}
function drawPlatform(){
    stroke(0,0,0);
    fill(0,0,0);
    rect(platformPosX,platformPosY,canvasWidth/8,canvasHeight/40);
}
function checkInput(){
    if (keyIsDown(37)){
        platformPosX--;
    }
    if (keyIsDown(39)){
        platformPosX++;
    }
}

function drawBackground(){
    ///BACKGROUND COLOR///¨
    background(173, 216, 230);

    //CLOUDS//
    
    if (cloudsDrawn === false){
        
        for(let i=0;i<3;i++){
            let cloud={
                X : 0,
                Y : 0,
                ellipsesX : [],
                ellipsesY : [],
                ellipsesW : [],
                ellipsesH : []
            };

            cloud.X = Math.floor(Math.random()) * 150 + i * 300 +50;
            cloud.Y = Math.floor(Math.random()) * 200 + 30;

            if (i>0 && Math.abs(cloud.X-clouds[i-1].X) < 150 ){
                cloud.X += 100;
            }
            if (i>0 && Math.abs(cloud.Y-clouds[i-1].Y) < 80 ){
                cloud.Y += 100;
            }
            for(let j=0;j<5;j++){
                cloud.ellipsesX[j] = cloud.X + Math.floor(Math.random()) * 50;
                cloud.ellipsesY[j] = cloud.Y + Math.floor(Math.random()) * 20;
                cloud.ellipsesW[j] = Math.random() * 80 + 100;
                cloud.ellipsesH[j] = Math.random() * 30 + 50;
                
            }
            clouds.push(cloud);
        }
        cloudsDrawn = true;
    }
    else{
        for (let i=0;i<3;i++){
            for (let j=0;j<5;j++){
                stroke(255,255,255);
                fill(255,255,255);
                ellipse(clouds[i].ellipsesX[j],clouds[i].ellipsesY[j],clouds[i].ellipsesW[j],clouds[i].ellipsesH[j]);
                
            }

        }  
    }
}

function ballMovement(){
    if(y<700){
        velocityY=velocityY + gravity;
        if (velocityY < -4){
            velocityY = -4;
        }
        y= y+velocityY;
    }
}

function drawBall(){
    stroke(255,0,0);
    fill(255,0,0);
    rotation=PI/50+rotation+velocityY/20;
    y=y+velocityY;
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
        
        arc(300,y,30,30,startangle+rotation,startangle+rotation+PI/3);
    }
}

function draw(){
    clear();
    checkInput();
    drawBackground();
    ballMovement();
    drawBall();
    drawPlatform();
}

//PADDLE//
stroke(150,75,0);
fill(150,75,0);
ellipse(250,400,110,20);








