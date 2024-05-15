
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
            this.velocityY = this.velocityY * (-1.05);
            let randomBounce = Math.random();
            this.velocityX = platform.velocity * (0.8) + (this.velocityX + 2)  * (randomBounce - 0.5)/abs(randomBounce-0.5)*0.2;

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

//** Obstacles Properties *****
class Obstacle {
    constructor(posX,posY,width,height){
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.height = height;
        this.color = [Math.random() * 100 + 100,Math.random() * 100 + 100,Math.random() * 100 + 100];
    }

    drawObstacle(){
        fill(this.color[0],this.color[1],this.color[2]);
        rect(this.x,this.y,this.width,this.height);
    }

}


//*** Clouds Properties ******
let cloudsGenerated = false;
let cloudCount = 4;
let cloudDetail = 5;
class Cloud{
    constructor(x,y,ellipses){
        this.x = x;
        this.y = y;
        this.ellipses = ellipses;
    }

    drawCloud(){
        this.animateCloud();
        for (let i=0;i<cloudDetail;i++){
            stroke(255,255,255);
            fill(255,255,255);
            ellipse(this.ellipses[i].x,this.ellipses[i].y,this.ellipses[i].width,this.ellipses[i].height);
            
        }

    }

    //Animate the clouds moving to the right slowly
    animateCloud(){
        
        //For each ellipse in the cloud
        for (let i=0;i<cloudDetail;i++){
            this.ellipses[i].x += canvasWidth/1000;     //Move the ellipse slightly to the right
            
            //If the ellipse goes past the right border of the canvas, move it back to the left
            if (this.ellipses[i].x > canvasWidth + canvasWidth/cloudCount){
                this.ellipses[i].x -= canvasWidth + canvasWidth/(cloudCount-1);
            }
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

//Generate randomly shaped clouds. "count" is the count of clouds to be generated

function generateClouds(count){
    let clouds = [];
    
    //For each cloud
    for (let i=0;i<count;i++){
        
        //Set X and Y to approximately fill the width of the canvas with all the clouds
        let cloudX = Math.floor(Math.random() * canvasWidth /(cloudCount+1) );
        let cloudY = Math.floor(Math.random() * canvasWidth /6 + 30);

        cloudX += canvasWidth /(cloudCount) * i;    //Move the cloud to the right as many times as already created clouds
        
        //If current cloud is too close to previous cloud, increase distance
        if (i>0 && Math.abs(cloudX-clouds[i-1].x) < canvasWidth /cloudCount + 100){
            cloudX += canvasWidth /(cloudCount+1);
        }
        if (i>0 && Math.abs(cloudY-clouds[i-1].y) < canvasWidth /(cloudCount+1) ){
            cloudY += canvasWidth /(cloudCount+4);
        }

        //Create Random Ellipses for the Cloud
        randomEllipses = [];
        for(let j=0;j<cloudDetail;j++){
            
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
        cloud = new Cloud(cloudX,cloudY,randomEllipses);
        //Place the current cloud in the clouds array
        clouds.push(cloud);
        
    }
    return clouds;
}


function drawBackground(){
    ///BACKGROUND COLOR///¨
    background(170, 215, 230);

    //CLOUDS//
    //If Clouds are not yet generated, generate them
    if (cloudsGenerated === false){
        
        clouds = generateClouds(cloudCount);
        cloudsGenerated = true;
    }
    //Else, clouds are already generated so draw them
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
    ball.drawBall(platform);
    fill(0,0,0);
    text(ball.velocityX, 200,300);
    text(ball.velocityY,200,320);
    text(ball.y,200,350);
    text(ball.x,200,370);
}









