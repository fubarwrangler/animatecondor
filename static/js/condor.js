var svgns = "http://www.w3.org/2000/svg";
var theMap = null;

function setupMap() {
    if (theMap == null)
        theMap = document.getElementById("map").contentDocument.documentElement;
        //$(theMap).on('click', xy);
        animateCircle();
}

function randInt(min, max)  {
    return Math.floor((Math.random() * max) + min);
}

function createCircle (color, x, y, dx, dy, dt) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', 4);
  circle.setAttributeNS(null, 'to_x', dx);
  circle.setAttributeNS(null, 'to_y', dy);
  circle.setAttributeNS(null, 'wait', dt);
  circle.setAttributeNS(null, 'class', "job " + color);
  circle.setAttributeNS(null, 'fill', color );
  theMap.appendChild(circle);
  return circle;
}

function animateCircle() {
    $.get($SCRIPT_ROOT + '/api/events/20', function(data) { doAnimation(data); });
    setTimeout(animateCircle, 20000);
}

function doAnimation(d) {
    var circs = [];
    function mkTime(time)   {
        return time * 1;
    }
    console.log("Events: " + d);
    //createCircle('star', randInt(10, 50), randInt(10, 80));
    function getExperiment(node) {
       if (node.search(/rc.s6/) == 0) { return 'star'; }
       else if(node.search(/rc.s2/) == 0) { return 'phenix'; }
       else if(node.search(/acas|spar/) == 0) { return 'atlas'; }
       else { return 'other'; }
    }
    jQuery.each(d, function(time, data) {
        var Tx = theMap.width.baseVal.value;
        var Ty = theMap.height.baseVal.value;
        var ed = {'star': ['blue', 100, 80],
                  'phenix' : ['red', 150, 80],
                  'atlas' : ['green', 200, 80],
                  'other' : ['orange', 250, 80],
                  };
        console.log("Data" + data[1]);
        var params = ed[getExperiment(data[1])];

        circs.push($(createCircle(params[0], params[1], params[2],
                                  data[2]*Tx, data[3]*Ty,
                                  mkTime(time))));
    });
    jQuery.each(circs, function (idx, $obj) {
        $obj.velocity({
                translateX: $obj.attr('to_x')-$obj.attr('cx'),
                translateY: $obj.attr('to_y')-$obj.attr('cy'),
              }, { delay: $obj.attr('wait'), duration: randInt(200,2000) } )
            .velocity({r: 9}, {duration: 1200})
            .velocity({r: 1}, {complete: function(e) { $(e).remove(); }});
    });
}

function xy(e) {
    var dim = e.currentTarget.getBoundingClientRect();
    var pctX = e.clientX / dim.width;
    var pctY = e.clientY / dim.height;
    var rack = prompt("Enter Rack Name", "11-1");
    if (rack != null) {
      var data = {x: pctX, y: pctY, rack: rack};
      $.ajax($SCRIPT_ROOT + '/racks/update', {
  		url: JSON.stringify(data),
  		contentType: 'application/json',
  		type: 'POST',
  		data: JSON.stringify(data),
  	  }).fail(function(result)    {
          alert("Invalid rack name");
      }).done(function(data)    {
          alert("Updated OK");
      });
    }
}

$('#map').on('load', setupMap);
