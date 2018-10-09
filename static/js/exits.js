// jshint esversion: 6

var runningExits = [];
var exitTweens = new TWEEN.Group();

class ExitJob {
  constructor(experiment, x, y, time) {
    this.x = x; this.y = y;
    this.begin = time + thisStart;
    this.r = 0.1;
    this.color = getColor(experiment);
    this.alpha = 1.0;
    this.done = false;
    this.width = 0.8;
    this.duration = (Math.random() * 1.0) + 2.0;
    this.tweens = [];
  }
  draw(ctx, dt)  {
    ctx.beginPath();
    ctx.arc(this.x * CW, this.y * CH, this.r * CScale, 0, Math.PI * 2);
    ctx.closePath();
    this.color[3] = this.alpha;
    ctx.strokeStyle = colorStr.apply(null, this.color);
    ctx.lineWidth = this.width * CScale;
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
  slide = new TWEEN.Tween(j, exitTweens).to({y: j.y + 0.005, r: 10, alpha: 0.1, width: 2.2}, j.duration*1000);
  slide.onComplete(jobCleanup(j));
  slide.easing(TWEEN.Easing.Quadratic.In);
  j.tweens.push(slide);
  slide.start();
}


function removeFinishedExits()  {
  runningExits = runningExits.filter(job => !job.done);
}

function clearExits()  {
  // runningExits = [];
  exitJobs = [];
}


function animateExits(ctx)  {
  addNewExits();
  runningExits.forEach(x => x.draw(ctx));
  exitTweens.update();
  removeFinishedExits();
}
