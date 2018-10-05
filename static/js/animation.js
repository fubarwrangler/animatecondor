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
  $.get($SCRIPT_ROOT + '/api/events/'+dt+'?adj=d', (data) => {
    thisStart = Date.now();
    console.log(thisStart, " Got ", data.length, " more");
    createStartPoints(data.filter(r => r[0] == 'start'));
    createExitPoints(data.filter(r => r[0] == 'exit'));
  });
}

function getTestData(dt) {
  $.get($SCRIPT_ROOT + '/api/events/fake/' + dt, (data) => {
    thisStart = Date.now();
    console.log(thisStart, "TEST Got ", data.length, " more");
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
    'star':   [0.2, 0.1],
    'phenix': [0.25, 0.1],
    'atlas':  [0.3, 0.1],
    'shared': [0.35, 0.1],
    'other':  [0.4, 0.1],
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
  getTestData(DT);
  setTimeout(update, DT * 1000);
}

// $('#overlay').on('click', () => { getData(10); });

update();
draw();
