// jshint esversion: 6
var canvas = $('#overlay')[0];
var CH, CW, CScale;
var scaleFactor = 1000;
// canvas.height = canvas.height / 2;
function drawSample() {

  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = CH / 6;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,0,0,0)';
  context.fill();
  context.lineWidth = 5;
  context.stroke();

  context.beginPath();
  context.strokeStyle = "blue";
  context.linewidth = 2;

  // context.fill();
  context.rect(0,0,canvas.width, canvas.height);
  context.stroke();
}


/* Resize the canvas to the current size of the image as displayed */
function sizeCanvas($obj) {
  CW = $obj.width();
  CH = $obj.height();
  CScale = CW / scaleFactor;
  canvas.width = CW;
  canvas.height = CH;
}

$('#map').on('load', function(ev) {
  sizeCanvas($('#map'));
  drawSample();
});

$(window).resize(()=>{
  sizeCanvas($('#map'));
  drawSample();
});
