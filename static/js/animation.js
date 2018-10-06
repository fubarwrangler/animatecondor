// jshint esversion: 6
var Fields = Object.freeze({TYPE: 0, TIME: 1, NODE: 2, X: 3, Y: 4});
var thisStart = 0;
var DT = 10;

function getExperiment(node) {
   if (node.search(/rc.s6/) == 0) { return 'star'; }
   else if(node.search(/rc.s2/) == 0) { return 'phenix'; }
   else if(node.search(/acas|spar/) == 0) { return 'atlas'; }
   else if(node.search(/spool/) == 0) { return 'shared'; }
   else { return 'other'; }
}

function getData(dt) {
  let urls = [
    '/api/events/fake/' + dt,
    '/api/events/'+dt+'?adj=d',
    '/api/events/' + dt
  ]; // index here is defined in template based on debug, last one is production
  $.get($SCRIPT_ROOT + urls[data_url_type], (data) => {
    thisStart = Date.now();
    console.log(thisStart, " Got ", data.length, " more");
    $('#rate').text(data.length)
    createStartPoints(data.filter(r => r[0] == 'start'));
    createExitPoints(data.filter(r => r[0] == 'exit'));
  });
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

function getStartLocation(experiment) {
  return {
    'star':   [0.14, 0.09],
    'phenix': [0.22, 0.09],
    'shared': [0.58, 0.09],
    'atlas':  [0.65, 0.09],
    'other':  [0.4, 0.09],
  }[experiment];
}


// Closure around j to allow callback from tween to reference parent obj
jobCleanup = (n) => { return () => { n.done = true; }; };

var startJobs = [];
var exitJobs = [];

function createStartPoints(rawdata) {
  rawdata.forEach((itm) => {
    let time = parseFloat(itm[Fields.TIME]);
    let exp = getExperiment(itm[Fields.NODE]);
    startJobs.push(new StartJob(exp, itm[Fields.X], itm[Fields.Y], time));
  });
}

function createExitPoints(rawdata) {
  rawdata.forEach((itm) => {
    let time = parseFloat(itm[Fields.TIME]);
    let exp = getExperiment(itm[Fields.NODE]);
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
