var runningStarts = []


function iterateStarts()  {
  now = Date.now();
  while(startJobs.length) {
    let j = startJobs.shift();
    if (j.time <= now) {
      runningStarts.push(j);
    } else {
      startJobs.unshift(j);
      break;
    }
  }
}


$('h1').click(()=>{
  iterateStarts();
  console.log("Starts ", startJobs.length);
  console.log("Runs ", runningStarts.length, runningStarts);
});
