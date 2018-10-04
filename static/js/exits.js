// jshint esversion: 6

var runningExits = [];
var exitTweens = new TWEEN.Group();

class ExitJob {
  constructor(experiment, x, y, time) {
    let dist;
    this.x = x; this.y = y;
    this.begin = time + thisStart;
    this.r = 3;
    this.color = getColor(experiment);
    this.done = false;
    this.duration = (Math.random() * 3.0) + 1.8;
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



function addNewExits()  {
  now = Date.now();
  while(exitJobs.length) {
    let j = exitJobs.shift();
    if (j.begin <= now) {
      createStartAnimation(j);
      runningExits.push(j);
    } else {
      exitJobs.unshift(j);
      break;
    }
  }
}

function createExitAnimation(j) {
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


function removeFinishedExits()  {
  runningExits = runningExits.filter(job => !job.done);
}


function animateExits(ctx)  {
  addNewExits();
  runningExits.forEach(x => x.draw(ctx));
  startTweens.update();
  removeFinishedExits();
}
