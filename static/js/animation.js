// jshint esversion: 6
var Fields = Object.freeze({TYPE: 0, TIME: 1, NODE: 2, X: 3, Y: 4});
var thisStart = 0;

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
    createPoints(data, dt);
  });
}

function getColor(experiment) {
  let cmap = {
    'star':   'blue',
    'phenix': 'red',
    'atlas': 'green',
    'shared': 'purple',
    'other': 'orange',
  };
  return cmap[experiment];
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



function StartJob(experiment, x, y, time) {
  [this.x, this.y] = getStartLocation(experiment);
  this.time = time + thisStart;
  this.end_x = x;
  this.end_y = y;
  this.vx = 0;
  this.vy = 0;
  this.radius = 3;
  this.color = getColor(experiment);
  this.started = false;
  this.finished = false;
}



var startJobs = [];

function createPoints(rawdata, timestep) {
  rawdata.forEach((itm) => {
    let time = parseFloat(itm[Fields.TIME]);
    startJobs.push(new StartJob(getExperiment(itm[Fields.NODE]), itm[Fields.X], itm[Fields.Y], time));
  });

}

$('#overlay').on('click', () => { getData(20); });
