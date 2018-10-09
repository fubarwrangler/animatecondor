// jshint esversion: 6
var Fields = Object.freeze({TYPE: 0, EXP: 1, TIME: 2, NODE: 3, X: 4, Y: 5});
var JTypes = Object.freeze({START: 0, EXIT: 1, EVICT: 2});
var thisStart = 0;
var DT = 15;

function getData(dt) {
  let urls = [
    '/api/events/fake/' + dt,
    '/api/events/'+dt+'?adj=d',
    '/api/events/' + dt
  ]; // index here is defined in template based on debug, last one is production
  $.get($SCRIPT_ROOT + urls[data_url_type], (data) => {
    thisStart = Date.now();
    // console.log(thisStart, " Got ", data.length, " more");
    createStartPoints(data.filter(r => r[0] == JTypes.START));
    createExitPoints(data.filter(r => r[0] == JTypes.EXIT));
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

var current_frame = null;
var current_refresh = null;
var nf = 0;

function draw() {
  ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,CW,CH);
  animateStarts(ctx);
  animateExits(ctx);
  nf++;
  current_frame = requestAnimationFrame(draw);
}

function update() {
  if(!document.hidden)  {
    getData(DT);
    current_refresh = setTimeout(update, DT * 1000);
  }
}

$(document).on('visibilitychange', () => {
  if(document.hidden) {
    if(current_frame) {
      cancelAnimationFrame(current_frame);
    }
    if(current_refresh) {
      clearTimeout(current_refresh);
    }
  } else {
    clearStarts();
    clearExits();
    update();
    draw();
  }
});


function counterHz(poll) {
  let now = Date.now();
  ago = now - (poll * 1000);
  let starts = startJobs.filter(x => (ago < x.begin < now)).length +
  runningStarts.filter(x => (ago < x.begin < now)).length;
  $('#srate').text(starts/poll);
  let ends = exitJobs.filter(x => (ago < x.begin < now)).length +
  runningExits.filter(x => (ago < x.begin < now)).length;
  $('#erate').text(ends/poll);
}

function counter() {
  counterHz(5);
  setTimeout(counter, 1000);
}

$('#overlay').on('click', () => { console.log(nf); });

$(document).ready(() => {
  update();
  draw();
});
// counter();
