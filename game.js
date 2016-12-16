// Debuging


// Select canvas
var canvas = document.getElementById ("gameCanvas");
var canvasHeight = canvas.height;
var canvasWidth = canvas.width;
var canvasBackgroundColor = "#9b9b9b";
console.log (canvasWidth + " x " + canvasHeight);

//helpme(canvas);
var ctx = canvas.getContext("2d");

// Load Image
var imagesReady=0;
var car1Img = new Image();
var car2Img = new Image();
var ballImg = new Image();
var brickImg = new Image();

//car1Img.src="car1.png";
//car2Img.src="car2.png";
car1Img.src="runner.jpg";
car2Img.src="runner.jpg";
ballImg.src="ball.png";
brickImg.src="brick.png";

car1Img.onload = function (){
  imagesReady++;
  if (imagesReady == 4 ) {
      imagesReady = true;
      console.log("Images Loaded");
  }
}

car2Img.onload = car1Img.onload ;
ballImg.onload = car1Img.onload ;
brickImg.onload = car1Img.onload ;

//Game Objects
var maxItem = 10;
var balls = new Array (10);
var bricks = new Array (10);
var ballsCount=0;
var bricksCount=0;

var objectMinDistance = 5;
var gameOverDialog=false;
var gameOverDialogDrawn = false;
var initialSpeed = 6;
// This speed is automatically computed
var speed = 1;
var points=0;

var gridX = 4;
var gridY = 20;
var gridXSize = 75 ;
var gridYSize = 25 ;

var car1 = {x : 1 , y : 19 , current : 1 , source : car1Img , width : 65 , height : 66 , total_frames : 8};
var car2 = {x : 4 , y : 19 , current : 4 , source : car2Img , width : 65 , height : 66 , total_frames : 8};

var stopRender = false;
var stopUpdate = false;

// Helper Functions
function gridToXY (x,y){
    return new Array ((x - 1 ) * gridXSize + 10 , y *gridYSize);
}

function drawSprite (spriteImg,sprite){
    pos = gridToXY(sprite.x,sprite.y);
//    console.log(pos);
    ctx.drawImage(spriteImg,pos[0],pos[1]);
}

function draw_anim(iobj,frameRate) {
    var pos = gridToXY (iobj.x ,iobj.y);
    var x = pos[0];
    var y = pos[1];
    var b = 2; // image buffer  (padding)
    
    if (iobj.source != null)
        ctx.drawImage(iobj.source, Math.floor(iobj.current) * iobj.width + b, 2,
                          iobj.width - 2*b, iobj.height - 4,
                          x, y, iobj.width - 2*b, iobj.height);
    iobj.current = (iobj.current + frameRate) % iobj.total_frames;
                   // incrementing the current frame and assuring animation loop
}

//ctx.drawImage (car1Img , 4*75 , 20*30);

// Give random lane number
function random4() {
    // Reduce the chance of number to 1 in 100
    if ( Math.floor (Math.random() * 50) == 25 ) {
        return Math.floor(Math.random() * 5);
    }
    else {
	return 0;
    }
    
}

function newBall(position){
    balls[ballsCount]={x :position, y: 1};
    ballsCount++;
}

function newBrick (position){
    bricks[bricksCount] = {x : position , y : 1};
    bricksCount++;
}

function helpme(obj){
    for (x in obj){
	console.log(x + " --> " + obj [x]);
    }
}

function sameGridPos(a ,b){
    if (Math.floor (a.x) == Math.floor (b.x) && ( Math.floor(a.y) == Math.floor (b.y) || Math.ceil(a.y) == Math.floor(b.y))) {
	return true;
    }
    else {
	return false;
    }
}

function outOfGrid (a) {
    if (a.y > gridYSize) {
	return true;
    }
    else {
	return false;
    }
}

function popNth (n , array){
    for (var i=n;i<(array.length -1 );i++){
	array[i]=array[i+1];
    }
    return array;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}



//helpme (ctx);

function clearCanvas(){
    ctx.fillStyle=canvasBackgroundColor;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);

}

function drawLine(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1 ,y1);
    ctx.lineTo(x2 ,y2);
    ctx.stroke();
}

// Render ( Drawing)
render = function (Modifier) {
    // Images
    clearCanvas ();
    if (imagesReady) {
	//drawSprite(car1Img,car1);
	//drawSprite(car2Img,car2);
	draw_anim (car1,Modifier);
	draw_anim (car2,Modifier);
	
	 for (i=0;i<ballsCount;i++){
	  drawSprite(ballImg,balls[i]);
	 }
	 for (i=0;i<bricksCount;i++){
	  drawSprite (brickImg,bricks[i]);
	 }
      
    }

    // Track
    ctx.strokeStyle = "rgb ( 0 , 0 ,250)";
    // Middle Line
    ctx.setLineDash([0,0]);
    drawLine (canvasWidth /2, 0 , canvasWidth/2 ,canvasHeight);
    // Side Line
    ctx.setLineDash([3,6]);
    drawLine (canvasWidth /4  , 0 , canvasWidth/4 ,canvasHeight);
    drawLine (canvasWidth * 3/4  , 0 , canvasWidth/4 * 3 ,canvasHeight);
    
  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Points " + points, 10, 05);
};

function displayHighScore(){
    var highscore = getCookie("highscore");
    document.getElementById("highscore").innerHTML="Highscore : "+highscore;
}


function gameOver (){
    var highscore=getCookie("highscore");
    if (highscore == "" || Number(highscore) < points){
	setCookie("highscore",points,365);
	displayHighScore();
    }
    stopRender= true;
    stopUpdate=true;
    gameOverDialog=true;
}

// Update (Events)
update = function (speedModifier) {
    // Check for collisions  & misses
    var check;
    for (var i=0; i<ballsCount;i++){
	if (sameGridPos(balls[i],car1) || sameGridPos (balls[i],car2) ){
	    balls = popNth(i,balls);
	    ballsCount--;
	    points++;
	}
	else if (outOfGrid(balls[i])){
	    console.log ("GameOver");
	    console.log ("Missed a point");
	    console.log ("Points = " +points);
	    gameOver();
	}
    }
    
    for (var i=0; i<bricksCount; i++){
	if (sameGridPos (bricks[i],car1) || sameGridPos (bricks[i],car2) ){
	    console.log("GameOver");
	    console.log("Collided with a wall");
	    console.log("Points =" +points);
	    gameOver();
	}
	else if (outOfGrid (bricks[i])) {
	    bricks = popNth (i,bricks);
	    bricksCount--;
	}
    }

    
    // Move Balls & Bricks 
    for (var i=0;i<ballsCount;i++){
	balls[i].y += speed*speedModifier;
    }

    for (var i=0;i<bricksCount;i++){
	bricks[i].y += speed*speedModifier;
    }

    
    var randomX;
    var lane1Allowed = true;
    var lane2Allowed = true;

    for (var i=0;i<ballsCount;i++){
	var y = balls[i].y;
	if (y  < objectMinDistance) {
	    if (balls[i].x == 1 || balls[i].x == 2){
		lane1Allowed = false;
	    }
	    else {
		lane2Allowed = false;
	    }
	}
    }

    for (var i=0;i<bricksCount;i++){
	var y = bricks[i].y;
	if (y  < objectMinDistance) {
	    if (bricks[i].x == 1 || bricks[i].x == 2){
		lane1Allowed = false;
	    }
	    else {
		lane2Allowed = false;
	    }
	}
    }
    
    // Spawn balls
    if (ballsCount < maxItem) {
	randomX = random4();
	if (randomX > 0 && ( (randomX < 3 && lane1Allowed) || (randomX > 2 && lane2Allowed) )) {
	    newBall(randomX) ;
	}
    }
    
    // Spawn bricks
    if (bricksCount < maxItem) {
	randomX = random4();
	if (randomX > 0 && ( (randomX < 3 && lane1Allowed) || (randomX > 2 && lane2Allowed) )) {
	    newBrick(randomX) ;
	}
    }
    
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Main loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    //	console.log(delta);
    if (delta > 90) console.log(delta);
    speed = Math.floor (2 * points / 10) + initialSpeed;
    if (! stopUpdate ) { update(delta / 1000);}
    if (! stopRender ) { render(speed * 3 * delta / 1000); }
    if (gameOverDialog && !gameOverDialogDrawn) {
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	pos=gridToXY((gridX -1 ) / 2  , gridY / 2);
	//	console.log(pos);
	ctx.fillText("    Gameover   " + points,pos[0],pos[1]);
	ctx.fillText("Press Space to continue" ,pos[0] - 20 ,pos[1]+50);
	gameOverDialogDrawn = true;
    }
    then = now;

    // Set timeout for this function to recall every 75 milisecond
   // setTimeout(main,75);


  // Testing
  //points ++;
  
  // Request to do this again ASAP
      requestAnimationFrame(main);
    
};

// Listen to key strokes
addEventListener("keydown", function (e) {
    // 37  is left 39 is right 
    if (e.keyCode == 37 ){
	// Change car 1
	if (car1.x == 1)  car1.x = 2 ;
	else car1.x = 1;
    }
    else if (e.keyCode == 39) {
	// Change car 2
	if (car2.x == 3) car2.x = 4;
	else car2.x = 3;
    }
    else if (e.keyCode == 32 ){
	console.log ("Space Key ");
	if (gameOverDialog){
	    console.log ("Continuing Running");
	    // Clear points
	    points = 0;
	    // Clear objects
	    bricks = new Array (maxItem);
	    bricksCount =0;
	    balls = new Array (maxItem);
	    ballsCount =0;
	    // Start render & update
	    stopRender = false;
	    stopUpdate = false;	    
	    gameOverDialog = false;
	    gameOverDialogDrawn = false;

	}
    }
}, false);



// Let's play this game!
var then = Date.now();
//reset();
main();





	

