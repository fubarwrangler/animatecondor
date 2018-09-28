// jshint esversion: 6

var runningStarts = [];

function addNewStarts()  {
  now = Date.now();
  while(startJobs.length) {
    let j = startJobs.shift();
    if (j.begin <= now) {
      runningStarts.push(j);
    } else {
      startJobs.unshift(j);
      break;
    }
  }
}

function removeFinishedStarts()  {
  // now = Date.now();
  // runningStarts.forEach(job => {
  //   if (job.lifetime + job.begin < now) {
  //     job.done = true;
  //   }
  // });
  runningStarts = runningStarts.filter(job => !job.done);
}

function updateStart(j, ctx)  {
  if(j.t == 0)  {
    Vmag = ((Math.random() / 4.0) + 0.75) / 30.0;
    j.vx = (j.end_x - j.x) * Vmag;
    j.vy = (j.end_y - j.y) * Vmag;
  }
  j.t++;
  j.x += j.vx;
  j.y += j.vy;
  if(j.distance() < 0.01)  {
    j.done = true;
  }
  j.draw(ctx);
}



$('h1').click(()=>{
  addNewStarts();
  ctx = canvas.getContext('2d');
  updateStart(runningStarts[0], ctx);

  console.log(runningStarts[0]);
  console.log("Starts ", startJobs.length, startJobs);
  console.log("Runs ", runningStarts.length, runningStarts);
  removeFinishedStarts();
});
