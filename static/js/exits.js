// jshint esversion: 6

var runningExits = [];
var exitTweens = new TWEEN.Group();

class ExitJob {
  constructor(experiment, x, y, time) {
    this.x = x; this.y = y;
    this.begin = time + thisStart;
    this.r = 3;
    this.color = getColor(experiment);
    this.done = false;
    this.duration = (Math.random() * 2.0) + 1.0;
    this.tweens = [];
  }
  draw(ctx, dt)  {
    ctx.beginPath();
    ctx.arc(this.x * CW, this.y * CH, this.r, 0, Math.PI * 2);
    ctx.closePath();
    // ctx.fillStyle = this.color;
    // ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}



function addNewExits()  {
  now = Date.now();
  while(exitJobs.length) {
    let j = exitJobs.shift();
    if (j.begin <= now) {
      createExitAnimation(j);
      runningExits.push(j);
    } else {
      exitJobs.unshift(j);
      break;
    }
  }
}

function createExitAnimation(j) {
  slide = new TWEEN.Tween(j, exitTweens).to({y: j.y + 0.05, r: 0.1}, j.duration *1000);
  slide.onComplete(jobCleanup(j));
  slide.easing(TWEEN.Easing.Cubic.In);
  j.tweens.push(slide);
  slide.start();
}


function removeFinishedExits()  {
  runningExits = runningExits.filter(job => !job.done);
}


function animateExits(ctx)  {
  addNewExits();
  runningExits.forEach(x => x.draw(ctx));
  exitTweens.update();
  removeFinishedExits();
}
