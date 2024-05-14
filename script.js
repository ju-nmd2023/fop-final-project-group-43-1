
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
        this.velocityY = 1;
        this.gravity = 0.1;
        this.rotation = 0;
        this.bounced = false;
    }
    
    move(){
        ball.velocityY = ball.velocityY + ball.gravity;
        ball.y= ball.y+ball.velocityY;
    }

    collisions(){
        let YinBounds = ball.y + ball.radius/2 >= platform.y && 
                    ball.y <= platform.y + platform.height;
        text(ball.velocityY,200,100);
        
        if (YinBounds && ball.bounced === false){
            //ball.gravity = 0;
            
            if (abs(ball.velocityY) > 1){
                ball.velocityY = ball.velocityY * (-0.5) ;
            }
            else{
                ball.velocityY = ball.velocityY * (-1) ;
            }
            text(ball.velocityY,300,100);
            ball.bounced = true;
            
        }
        else{
            ball.bounced = false;
        }
    
    
        // if(ball.y<canvasHeight){
        //     ball.y = canvasHeight;
        //     ball.velocityY = ball.velocityY * (-0.6);
        //     // if (ball.velocityY < -4){
        //     //     ball.velocityY = -4;
        //     // }
        //     // if (ball.velocityY > 4){
        //     //     ball.velocityY = 4;
        //     // }
        //     if (abs(ball.velocityY) < 0.1){
        //         ball.velocityY = 0;
        //     }
            
        // }
    }
}
let ball = new Ball(0,0);

//************************

//** Platform Properties *****
const Platform = {
    x : 0,
    y : 0,
    velocity : 0,
    width : 0,
    height : 0
};
platform = Platform;
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
        console.log(clouds);
    }
    else{
        for (let i=0;i<cloudCount;i++){
            clouds[i].drawCloud();

        }  
    }
}
// ***************************************************************************


//************** Platform Movement and Draw ***********************
function drawPlatform(){
    platformMovement();
    stroke(0,0,0);
    fill(0,0,0);
    rect(platform.x,platform.y,platform.width,platform.height);
}

function platformMovement(){
    if (keyIsDown(37)){
        platform.velocity = platform.velocity - 2;
        platform.x = platform.x + platform.velocity;
    }
    if (keyIsDown(39)){
        platform.velocity = platform.velocity + 2;
        platform.x = platform.x + platform.velocity;
        
    }   
    
    //platform.x = platform.x + platform.velocity;
    if (platform.velocity != 0){
        if (abs(platform.velocity) < ball.gravity/2){
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


//******** Ball Draw and Behaviour *******************
function ballMovement(){
    
    
}

function drawBall(){
    ball.collisions();
    ball.move();
    stroke(255,0,0);
    fill(255,0,0);
    ball.rotation=PI/50+ball.rotation+ball.velocityY/20;
    //ball.y = ball.y + abs(ball.velocityY);
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
        
        arc(ball.x,ball.y,ball.radius,ball.radius,startangle+ball.rotation,startangle+ball.rotation+PI/3);
    }
}

function ballCollisions(){
    
    
}
//*****************************************************************

function draw(){
    clear();

    drawBackground();
    drawPlatform();
    ballCollisions();
    
    //ballMovement();
    drawBall();
    
}









