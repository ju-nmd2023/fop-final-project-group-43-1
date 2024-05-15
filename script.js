
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
        this.velocityY = this.velocityY + this.gravity;
        this.y= this.y+this.velocityY;
    }

    collisions(platform){
        let YinBounds = this.y + this.radius/2 >= platform.y && 
                    this.y <= platform.y + platform.height;
        
        let XinBounds = this.x + this.radius/2 >= platform.x &&
                    this.x <= platform.x + platform.width;

             
        if (YinBounds && XinBounds){

            
            this.y = platform.y - this.radius/2;
            this.velocityY = this.velocityY * (-0.6);

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
    }

    drawBall(platform){
        ball.move();
        ball.collisions(platform);
        
        stroke(255,0,0);
        fill(255,0,0);
        ball.rotation=PI/50+ball.rotation+ball.velocityY/20;
        //ball.y = ball.y + abs(ball.velocityY);
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
        if (keyIsDown(37)){
            this.velocity = this.velocity - 2;
            this.x = this.x + this.velocity;
        }
        if (keyIsDown(39)){
            this.velocity = this.velocity + 2;
            this.x = this.x + this.velocity;
            
        }   
        
        //this.x = this.x + this.velocity;
        if (this.velocity != 0){
            if (abs(this.velocity) < ball.gravity/2){
                this.velocity = 0;
            }
            if (this.velocity > 0){
                this.velocity = this.velocity - this.velocity/10;
            }
            if (this.velocity < 0){
                this.velocity = this.velocity - this.velocity/10;
            }
        }
        this.x = this.x + this.velocity;
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
        console.log(clouds);
    }
    else{
        for (let i=0;i<cloudCount;i++){
            clouds[i].drawCloud();

        }  
    }
}
// ***************************************************************************



//*****************************************************************

function draw(){
    clear();

    drawBackground();
    platform.drawPlatform();
    //ballCollisions();
    
    //ballMovement();
    ball.drawBall(platform);
    
}









