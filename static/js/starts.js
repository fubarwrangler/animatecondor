// jshint esversion: 6

var runningStarts = [];
var startTweens = new TWEEN.Group();

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

  // Closure around j to allow callback from tween to reference parent obj
  cleanup = (n) => { return () => { n.done = true; }; };

  j.tweens.push(new TWEEN.Tween(j, startTweens)
    .to({x: j.end_x, y: j.end_y}, j.duration *1000)
    .onComplete(cleanup(j))
    .start()
  );
}


function removeFinishedStarts()  {
  runningStarts = runningStarts.filter(job => !job.done);
}


function animateStarts()  {
  addNewStarts();
  ctx = canvas.getContext('2d');
  ctx.clearRect(0,0, CW, CH);
  runningStarts.forEach(x => x.draw(ctx));
  startTweens.update();
  removeFinishedStarts();
}
