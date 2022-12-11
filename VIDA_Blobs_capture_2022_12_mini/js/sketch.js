
var myCapture, // camera
    myVida;    // VIDA

var counter = -1;

var interactionStartedFlag = false;

//-------record file name
P5Capture.setDefaultOptions({
  format: "mp4",
  framerate: 31,
  quality: 1,
  width: 320,
  //height: 100,
  baseFilename,
});

function baseFilename() {
  const zeroPadding = (n) => n.toString().padStart(2, "0");
  return `${"video"}`;
}

function mousePressed() {
  const capture = P5Capture.getInstance();
  if (capture.state === "idle") {
    capture.start();
  } else {
    capture.stop();
  }
}

function setup() {
  createCanvas(640, 480); // we need some space...
  myCapture = createCapture(VIDEO);
  myCapture.size(320, 240);
  myCapture.elt.setAttribute('playsinline', '');
  myCapture.hide();

  myVida = new Vida(this); // create the object
  myVida.progressiveBackgroundFlag = false;
  myVida.imageFilterThreshold = 0.1;
  myVida.handleBlobsFlag = true;
  myVida.trackBlobsFlag = true;
  myVida.approximateBlobPolygonsFlag = true;
  myVida.pointsPerApproximatedBlobPolygon = 20;
  myVida.normMinBlobMass = 0.002;  
  myVida.normMaxBlobMass = 0.5; 
  frameRate(30); // set framerate
}

function draw() { 
  if(myCapture !== null && myCapture !== undefined) { // safety first
    background(0, 0, 255);
    myVida.update(myCapture);
    image(myVida.currentImage, 0, 0);
    image(myVida.backgroundImage, 320, 0);
    image(myVida.differenceImage, 0, 240);
    push();
    //blendMode(LIGHTEST);
    image(myVida.thresholdImage, 320, 240);
    filter(INVERT);
    pop();

    noStroke(); fill(255, 255, 255);
    text('camera', 20, 20);
    text('vida: static background image', 340, 20);
    text('vida: difference image', 20, 260);
    text('vida: threshold image', 340, 260);

    var temp_blobs = myVida.getBlobs();
    
    // define size of the drawing
    var temp_w = width / 2; var temp_h = height / 2;
    
    // offset from the upper left corner
    var offset_x = 320; var offset_y = 240;
    
    // create local variabled for pixel-based blob coordinates:
    var temp_rect_x, temp_rect_y, temp_rect_w, temp_rect_h,
        temp_mass_center_x, temp_mass_center_y;

    push(); // store current drawing style and font
    translate(offset_x, offset_y); // translate coords
    textFont('Helvetica', 10); textAlign(LEFT, BOTTOM); textStyle(NORMAL);// set text style and font
    
    for(var i = 0; i < temp_blobs.length; i++) {
      // convert norm coords to pixel-based
      temp_rect_x = Math.floor(temp_blobs[i].normRectX * temp_w);
      temp_rect_y = Math.floor(temp_blobs[i].normRectY * temp_h);
      temp_rect_w = Math.floor(temp_blobs[i].normRectW * temp_w);
      temp_rect_h = Math.floor(temp_blobs[i].normRectH * temp_h);
      temp_mass_center_x = Math.floor(temp_blobs[i].normMassCenterX * temp_w);
      temp_mass_center_y = Math.floor(temp_blobs[i].normMassCenterY * temp_h);
     
      // draw bounding box
      strokeWeight(1); stroke(255, 255, 0); noFill();
      rect(temp_rect_x, temp_rect_y, temp_rect_w, temp_rect_h);
      
      // Print the coordinates of one blob:
      print("X: " + temp_rect_x);
      print("Y: " + temp_rect_y);
      
      
      // draw mass center
      noStroke(); fill(255, 0 , 0); ellipseMode(CENTER);
      ellipse(temp_mass_center_x, temp_mass_center_y, 3, 3);
      
      
      // print id
      noStroke(); fill(255, 255 , 0);
      text(temp_blobs[i].id, temp_rect_x, temp_rect_y - 1);
       
      // draw approximated polygon (if available)
      strokeWeight(1); stroke(255, 0, 0); noFill();
      beginShape();

      /*capture*/
      if (temp_blobs.length > 1) {
        const capture = P5Capture.getInstance();
        if (capture.state === "idle") {
          capture.start();
        }
      } else
      if (temp_blobs.length == 1) {
        const capture = P5Capture.getInstance();
        if (capture.state === "capturing") {
          capture.stop();
          setTimeout(playrecord, 2000);
        }
      }

      /*capture*/
      if (temp_blobs.length > 1) {
        const capture = P5Capture.getInstance();
        if (capture.state === "idle") {
          capture.start();
        }
      } else
      if (temp_blobs.length == 1) {
        const capture = P5Capture.getInstance();
        if (capture.state === "capturing") {
          capture.stop();
          setTimeout(playrecord, 2000);
        }
      }
      
      for(var j = 0; j < temp_blobs[i].approximatedPolygon.length; j++) {
        vertex(
          temp_blobs[i].approximatedPolygon[j].normX * temp_w,
          temp_blobs[i].approximatedPolygon[j].normY * temp_h,
        );
      }
      endShape(CLOSE);
    }
    pop(); // restore memorized drawing style and font
  }
  else {
    background(255, 0, 0);
  }
}

/*
  Capture current video frame and put it into the VIDA's background buffer.
*/
function touchEnded() {
  if(myCapture !== null && myCapture !== undefined) { // safety first
    myVida.setBackgroundImage(myCapture);
    console.log('background set');
  }
}

function playrecord() {
  //console.log("playrecord");
  counter = counter + 1;
  console.log("counter:" + counter);
  setTimeout(addText(counter), 2000);
  var audio = new Audio('error.mp3');
  audio.play();
}
  
function addText(order) {
  $("#recorded").append("<video class='recorded' autoplay loop ><source src='http://127.0.0.1:8887/video%20(" + order + ").mp4' type='video/mp4'>?</video>")
  if (order>=10){
      order = 0;
      setTimeout(addReset(), 2000);
  };
}

function addReset() {
  element = document.querySelector('.reset');
  element.style.visibility = 'visible';
  setTimeout(hidden(element), 5000);
}

function hidden(obj){obj.style.visibility = 'hidden';}

const video = document.getElementsByClassName('recorded');
video.addEventListener('ended', () => {
  video.currentTime = 1;
  video.play();
});