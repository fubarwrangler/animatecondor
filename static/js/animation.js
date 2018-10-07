// jshint esversion: 6
var Fields = Object.freeze({TYPE: 0, EXP: 1, TIME: 2, NODE: 3, X: 4, Y: 5});
var thisStart = 0;
var DT = 20;

function getData(dt) {
  let urls = [
    '/api/events/fake/' + dt,
    '/api/events/'+dt+'?adj=d',
    '/api/events/' + dt
  ]; // index here is defined in template based on debug, last one is production
  $.get($SCRIPT_ROOT + urls[data_url_type], (data) => {
    thisStart = Date.now();
    console.log(thisStart, " Got ", data.length, " more");
    $('#rate').text(data.length);
    createStartPoints(data.filter(r => r[0] == 'start'));
    createExitPoints(data.filter(r => r[0] == 'exit'));
  });
}

function getExperiment(experiment) {

  let data = { 'star': 'star',
               'phenix': 'phenix',
               'atlas': 'atlas',
               'sdcc': 'shared',
             };

  if (experiment in data) {
    return data[experiment];
  }

  return 'other';
}

function getColor(experiment) {
  let cmap = {
    'star':   [0,0,255,1.0],    // blue
    'phenix': [255,0,0,1.0],    // red
    'atlas':  [0,128,0,1.0],    // green
    'shared': [128,0,128,1.0],  // purple
    'other':  [255,165,0,1.0],  // orange
  };
  return cmap[experiment];
}

function colorStr(r,g,b,a) {
  return 'rgba('+r+','+g+','+b+','+a+')';
}

// Closure around j to allow callback from tween to reference parent obj
jobCleanup = (n) => { return () => { n.done = true; }; };

var startJobs = [];
var exitJobs = [];

function createStartPoints(rawdata) {
  rawdata.forEach((itm) => {
    let time = parseFloat(itm[Fields.TIME]);
    let exp = getExperiment(itm[Fields.EXP]);
    startJobs.push(new StartJob(exp, itm[Fields.X], itm[Fields.Y], time));
  });
}

function createExitPoints(rawdata) {
  rawdata.forEach((itm) => {
    let time = parseFloat(itm[Fields.TIME]);
    let exp = getExperiment(itm[Fields.EXP]);
    exitJobs.push(new ExitJob(exp, itm[Fields.X], itm[Fields.Y], time));
  });
}


function draw() {
  ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,CW,CH);
  animateStarts(ctx);
  animateExits(ctx);
  requestAnimationFrame(draw);
}

function update() {
  getData(DT);
  setTimeout(update, DT * 1000);
}

// $('#overlay').on('click', () => { getData(10); });

update();
draw();
