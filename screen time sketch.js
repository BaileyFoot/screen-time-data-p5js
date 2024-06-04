//these are all values used to compute the spiral (log) visual.
let c, r, g, b, x, y, w, a, l, o, size;

//---FOR SCREENTIME DATA---
//holds the screentime csv.
let myScreentime;
//is used to hold daily screentime while the getting average.
let dailyScreentime;
//used to count through the rows in the dataset.
let screentimeRowCount;
let allDailyScreentime = 0;
//average of all the daily screentimes.
let avgDailyScreentime;
//approx screntime for a whole year.
let avgYearlyScreentime;
//approx screentime over my whole life.
let lifetimeScreentime;
//used to change the size of the spiral/ring.
let ringMultiplier;


let logCurrentLine;
let logCounter = 0;

//---FOR STEPS DATA---
let allDailySteps = 0;
//is used to hold daily steps while the getting average.
let dailySteps;
//average daily steps. 
let avgSteps;
//approx time it takes to do that many steps.
//my daily walking time.
let avgStepTime;
//used to count through the rows in the dataset.
let stepsRowCount;

//--- FOR TREE VISUAL---
//size of the screentime tree.
let screentimeTreeSize;
//size of the walking time tree.
let stepTimeTreeSize;
//keeps trakc of the current line being drawn to the screen.
let treeCurrentLine;
let treeCounter = 0;





function preload() {
  //load my screentime dataset
  myScreentime = loadTable("my screentime.csv","csv","header");

  //load my monthly steps dataset
  mySteps = loadTable("my monthly steps.csv","csv","header");

  //read in the tree 
  asciiTree = loadStrings('ascii tree.txt');
  //read in the log 
  asciiLog = loadStrings("ascii tree log.txt");

}

function setup() {
  //make the canvas and set the background white.
  createCanvas(windowWidth-20, windowHeight-20);
  background(255);

  //get the ammount of rows in each dataset.
  screentimeRowCount = myScreentime.getRowCount();
  stepsRowCount = mySteps.getRowCount()


  //get the screentime stats and walking time stat.
  getScreentimeYears();
  getWalkingTime();

  //calculate the size of the trees based off of these stats.
  getTreeSizes();

  //write the descriptions underneath the visual.
  logDescription();
  treeDescription();
    
  treeCurrentLine = asciiTree.length;
  logCurrentLine = asciiLog.length;
  
}

function getScreentimeYears() {

  //get all the screentimes in a list
  //filter through them, adding them to one variable
  for(i=1;i<screentimeRowCount;i++) {
    //the screentime for that day
    dailyScreentime = int(myScreentime.get(i,"Screentime"));

    //the screentime for all the days combined.
    allDailyScreentime = allDailyScreentime + dailyScreentime;

    
  }
  //then divide by how many there are to get an average.
  avgDailyScreentime = allDailyScreentime / screentimeRowCount;

  //times that by 365 to get that for the year
  avgYearlyScreentime = avgDailyScreentime * 365;

  //get my lifetime screentime
  lifetimeScreentime = avgYearlyScreentime*81;
  //get that in hours
  lifetimeScreentime = lifetimeScreentime/60;
  //get it in days
  lifetimeScreentime = lifetimeScreentime/24;
  //get it in years
  lifetimeScreentime = lifetimeScreentime/365;
}

function getWalkingTime() {
  //add all of them together and divide by number of rows
  //times that number by the walking time stats from gungersen health

  //for the number of rows in the data.
  for(i=1;i<stepsRowCount;i++) {
    //get that days step count.
    dailySteps = int(mySteps.get(i,"Steps"));

    //add it to running total.
    allDailySteps = allDailySteps + dailySteps;
  }
  //get the average
  avgSteps = allDailySteps / stepsRowCount;
  //get the approx time to do that many steps.
  avgStepTime = (avgSteps * .75)/60; //mins
  
  //MAP THIS TO HEIGHT AND SIZE OF A TREE


}

//this draws a description for the log data visual.
function logDescription(){
  textFont('Helvetica')
  textSize(16)
  //text for log visual
  text("using my own screentime data, ill spend approximately " + lifetimeScreentime + " years of my life on my phone. (visualisd as rings in a log)",windowWidth/22,windowHeight/1.2,windowWidth/2.5);
  //text("(visualisd as rings in a log)", windowWidth/5.5,windowHeight/1.15)


}

//this draws a description for the tree data visual.
function treeDescription() {
  textFont('Helvetica')
  textSize(16)
  //text for tree visual
  text("A",windowWidth/1.74,windowHeight/1.35)
  text("B",windowWidth/1.275,windowHeight/1.35)

  text("Tree A shows the ammount of physical exercise I get on average each day (approximated through my apple health data. Tree B shows the ammount of time I spend on my phone on average a day (from my apple screentime data).",windowWidth/1.95,windowHeight/1.2,660)
}

//this draws the spiral (log) that visualises the number of screen time years.
function drawSpiral(sizeMultiple,xPosition,yPosition){
  fill(50);
  s = millis()/1000;
  t = s*0.02;

  for (let i = 0; i < 5; i++) {
  w = fract(s*0.8+random()*0.05);
  c = random()*0.2+t+w*0.3;

  //turn the ammount of screentime years into rings of the log.
  ringMultiplier = lifetimeScreentime * 6.864;

  a = w * ringMultiplier; //(THE NUMBER CAN BE USED TO CHANGE THE AMMOUNT OF RINGS DRAWN)
  l = w * width/sizeMultiple*1.2;
  o = 2;
  x = cos(a) * l + random(-o, 1);
  y = sin(a) * l + random(-o, o);
  size = 80 * w + random(30) + 5;
  textSize(12);
  text("#",x + xPosition, y + yPosition, size);
  }
}

//the maps the screentime and walking time to the size of two trees.
function getTreeSizes() {
  //This will get the sizes of each tree from screentime and step time.

  stepTimeTreeSize = avgStepTime/18;;
  screentimeTreeSize = avgDailyScreentime/18;

  stepTimeTreeSize = round(stepTimeTreeSize,2);
  screentimeTreeSize = round(screentimeTreeSize,2);

  // console.log("STEP TIME TREE SIZE " + stepTimeTreeSize);
  // console.log("SCREEN TIME TREE SIZE " + screentimeTreeSize);

}

//this draws a ascii tree to the screen.
function drawTree(treeSize, treeLength, x, y){
  fill(0)
  textFont('Courier New');
  textSize(treeSize);
  //console.log(treeCurrentLine);
  
    text(asciiTree[treeCounter],x,y+(treeCounter*treeLength));
    //console.log(asciiTree[treeCurrentLine]);
    treeCurrentLine--;
    treeCounter++;

    if(treeCurrentLine<1) {
      treeCurrentLine = asciiTree.length;
      treeCounter=0;
    } 
}

//this draws an ascii stump/log to the screen
function drawLog(logSize, logLength, x, y){
  textFont('Courier New');
  textSize(logSize);
  //console.log(treeCurrentLine);
  
    text(asciiLog[logCounter],x,y+(logCounter*logLength));
    //console.log(asciiTree[treeCurrentLine]);
    logCurrentLine--;
    logCounter++;

    if(logCurrentLine<1) {
      //erase()
      logCurrentLine = asciiLog.length;
      logCounter=0;
    } 
}

function draw() {
  //draw the spiral drawSprial(size,x,y);
  drawSpiral(9,width/2.8,height/2.3);

  //clear the visuals once they've been drawn enough
  if(frameCount%850==0) {
    clear()
    logDescription();
    treeDescription();
    
  }
  //the tree visuals need clearing more often, 
  //randomly refresh them every 100-1000 frames.
  let x = random(100,1000)
  x = round(x)
  console.log(x)
  if(frameCount%x==0) {
    //this just erases that area so the other elements will not be effected.
    erase()
    rect(windowWidth/1.9,0,(windowWidth/1.9)+300,windowHeight)
    noErase()
    treeDescription();
  }

  //avgStepTime and daily screentime need to be reduced down to single digit number 
  //to be used to control the height of the trees.

  //draw tree to show step time
  drawTree(stepTimeTreeSize,stepTimeTreeSize, windowWidth/1.9,windowHeight/1.9);
  //draw tree to show screen time
  drawTree(screentimeTreeSize,screentimeTreeSize,windowWidth/1.7,windowHeight/14)

  //draw the stump/log image next to the data visual.
  drawLog(3.5,5.5,-10,windowHeight/5.5);

  }