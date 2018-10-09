// jshint esversion: 6

var runningStarts = [];
var startTweens = new TWEEN.Group();

function getStartLocation(experiment) {
  return {
    'star':   [0.14, 0.09],
    'phenix': [0.22, 0.09],
    'shared': [0.58, 0.09],
    'atlas':  [0.65, 0.09],
    'other':  [0.52, 0.09],
  }[experiment];
}

class StartJob {
  constructor(experiment, x, y, time) {
    let dist;
    [this.x, this.y] = getStartLocation(experiment);
    this.begin = time + thisStart;
    this.t = 0;
    this.end_x = x;
    this.end_y = y;
    this.r = 1.7;
    this.alpha = 0.4;
    this.color = getColor(experiment);
    this.done = false;
    this.duration = 4.0 + (Math.random() * 2.0);
    dist = (Math.hypot((this.x-this.end_x), (this.y-this.end_y)));
    this.duration *= dist;
    this.tweens = [];
  }
  draw(ctx, dt)  {
    ctx.beginPath();
    this.color[3] = this.alpha;
    ctx.arc(this.x * CW, this.y * CH, this.r * CScale, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = colorStr.apply(null, this.color);
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
  flyover = new TWEEN.Tween(j, startTweens).to({x: j.end_x, y: j.end_y, alpha: 1.0, r: 2.7}, j.duration *1000);
  popradius = new TWEEN.Tween(j, startTweens).to({r: 5.1, alpha: 0.7}, 500);
  shrinkradius = new TWEEN.Tween(j, startTweens).to({r: 0.01, alpha: 0.1}, 300);
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
