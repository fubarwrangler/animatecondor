// jshint esversion: 6

var runningStarts = [];
var startTweens = new TWEEN.Group();

class StartJob {
  constructor(experiment, x, y, time) {
    let dist;
    [this.x, this.y] = getStartLocation(experiment);
    this.begin = time + thisStart;
    this.t = 0;
    this.end_x = x;
    this.end_y = y;
    this.r = 3;
    this.color = colorStr.apply(null, getColor(experiment));
    this.done = false;
    this.duration = (Math.random() * 3.0) + 1.8;
    dist = (Math.hypot((this.x-this.end_x), (this.y-this.end_y)) * 2);
    this.duration /= dist;
    this.tweens = [];
  }
  draw(ctx, dt)  {
    ctx.beginPath();
    ctx.arc(this.x * CW, this.y * CH, this.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}


function addNewStarts()  {
  now = Date.now();
  while(startJobs.length) {
    let j = startJobs.shift();
    if (j.begin <= now) {
      createStartAnimation(j);
      runningStarts.push(j);
    } else {
      startJobs.unshift(j);
      break;
    }
  }
}

function createStartAnimation(j) {
  flyover = new TWEEN.Tween(j, startTweens).to({x: j.end_x, y: j.end_y}, j.duration *1000);
  popradius = new TWEEN.Tween(j, startTweens).to({r: 5.1}, 500);
  shrinkradius = new TWEEN.Tween(j, startTweens).to({r: 0.01}, 300);
  shrinkradius.onComplete(jobCleanup(j));
  flyover.easing(TWEEN.Easing.Sinusoidal.InOut);
  // flyover.easing(TWEEN.Easing.Quadratic.InOut);
  flyover.chain(popradius);
  popradius.chain(shrinkradius);
  j.tweens.push(flyover, popradius, shrinkradius);
  flyover.start();
}


function removeFinishedStarts()  {
  runningStarts = runningStarts.filter(job => !job.done);
}


function animateStarts(ctx)  {
  addNewStarts();
  runningStarts.forEach(x => x.draw(ctx));
  startTweens.update();
  removeFinishedStarts();
}
