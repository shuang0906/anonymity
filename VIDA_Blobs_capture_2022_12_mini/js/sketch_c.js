var counter = -1;

//-------VIDA
var myCapture,
    myVida;
    //myVideo, bg; 
var w = 320;
var h = 240;
var outputw = w*2;
var outputh = h*2;
var interactionStartedFlag = false;

//-------record file name
P5Capture.setDefaultOptions({
  format: "mp4",
  framerate: 31,
  quality: 1,
  width: outputw + w,
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

function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(320, 240);    
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  createCanvas(640, 480); // we need some space...
  initCaptureDevice(); // and access to the camera

  myVida = new Vida(this);
  myVida.progressiveBackgroundFlag = false;
  myVida.imageFilterThreshold = 0.2;
  myVida.handleBlobsFlag = true;
  myVida.normMinBlobMass = 0.0002;
  myVida.normMaxBlobMass = 0.5;
  myVida.trackBlobsFlag = true;
  myVida.approximateBlobPolygonsFlag = true;
  myVida.pointsPerApproximatedBlobPolygon = 10;

  frameRate(30);

}


function draw() {
  //if (myVideo !== null && myVideo !== undefined) {
  if(myCapture !== null && myCapture !== undefined) {
    /*
    if (!interactionStartedFlag) {
      background(0);
      push();
      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      text("click or tap to start video playback", width / 2, height / 2);
      pop();
      return;
    }*/
    background(0, 0, 255);
    //myVida.update(myVideo);
    myVida.update(myCapture);

    image(myVida.currentImage, 0, 0);
    image(myVida.backgroundImage, 320, 0);
    image(myVida.differenceImage, 0, 240);
    image(myVida.thresholdImage, 320, 240);
    
    
    // let's also describe the displayed images
    noStroke(); fill(255, 255, 255);
    text('camera', 20, 20);
    text('vida: static background image', 340, 20);
    text('vida: difference image', 20, 260);
    text('vida: threshold image', 340, 260);
  
    /*
      To manually get to the data describing detected blobs we call the
      [your vida object].getBlobs() function, which returns an array containing
      detected blobs. This function (although it does not make any
      time-consuming calculations) should be called at most once per draw()
      loop, because the parameters of the blobs do not change within one frame.
    */
    
    var temp_blobs = myVida.getBlobs();
    console.log(temp_blobs);
    
    // define size of the drawing
    var temp_w = width / 2; var temp_h = height / 2;
    
    // offset from the upper left corner
    var offset_x = 320; var offset_y = 240;
    
    // create local variabled for pixel-based blob coordinates:
    var temp_rect_x, temp_rect_y, temp_rect_w, temp_rect_h,
        temp_mass_center_x, temp_mass_center_y;
    
    
    
    push(); // store current drawing style and font
    
    translate(offset_x, offset_y); // translate coords
    
    // set text style and font
    textFont('Helvetica', 10); textAlign(LEFT, BOTTOM); textStyle(NORMAL);

    //myVida.drawBlobs(320, 240);


    for (var i = 0; i < temp_blobs.length; i++) {
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
      
      console.log("temp_blobs.length: " + temp_blobs.length);

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



      // draw approximated polygon (if available)
      
      strokeWeight(1);
      stroke(255, 0, 0);
      noFill();
      beginShape();

      for (var j = 0; j < temp_blobs[i].approximatedPolygon.length; j++) {
        vertex(
          temp_blobs[i].approximatedPolygon[j].normX * temp_w,
          temp_blobs[i].approximatedPolygon[j].normY * temp_h
        );
      }
      endShape(CLOSE);
    }

    pop(); 
  } else {
    background(255, 0, 0);
  }
}


function touchEnded() {
  if (myCapture !== null && myCapture !== undefined) {
    // safety first
    myVida.setBackgroundImage(myCapture);
    console.log("background set");
  }
}

/*playrecord*/

function playrecord() {
  //console.log("playrecord");
  counter = counter + 1;
  console.log("counter:" + counter);
  setTimeout(addText(counter), 2000);
}

function addText(order) {
  $("#recorded").append("<video class='recorded' autoplay loop ><source src='http://127.0.0.1:8887/video%20(" + order + ").mp4' type='video/mp4'>?</video>");
  //$("#recorded").append("<video class='recorded' autoplay loop poster='http://dummyimage.com/320x240/ffffff/fff'><source src='http://127.0.0.1:8887/video%20(" + order + ").mp4' type='video/mp4'>?</video>");
  //$(window).on('beforeunload', function() { $("video").hide(); });
  //$("#recorded").append("<video class='recorded' autoplay loop autoplay style='visibility:hidden;' onplay='var s=this;setTimeout(lol,100);'<source src='http://127.0.0.1:8887/video%20(" + order + ").mp4' type='video/mp4'>?</video>");
}
function lol(){s.style.visibility='visible';}

const video = document.getElementsByClassName('recorded');
video.addEventListener('ended', () => {
  video.currentTime = 1;
  video.play();
});