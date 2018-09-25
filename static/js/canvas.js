var canvas = $('#overlay')[0];
// canvas.height = canvas.height / 2;
function drawSample() {

  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = 70;

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
drawSample();
