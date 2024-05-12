
///BACKGROUND COLOR///¨
background(173, 216, 230);
let y=150;
let velocityY=0;
let gravity=0.1;
let cloudsDrawn = false;
let rotation=0;
let platformPosX= 450;
let platformPosY= 600;
let canvasHeight= -1;
let canvasWidth= -1;

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








