function drawRacks(data) {

  var ctx = canvas.getContext('2d');
  var radius = 2;

  ctx.clearRect(0,0,CW,CH);

  for(let d in data)  {
    let [x, y] = data[d];
    ctx.beginPath();
    ctx.arc(x * CW, y * CH, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

$.get($SCRIPT_ROOT + '/api/racks', (data) => {

  drawRacks(data);
});
