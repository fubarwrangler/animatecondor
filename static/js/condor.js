var svgns = "http://www.w3.org/2000/svg";
var theMap = null;

function findMap() {
    if (theMap == null)
        theMap = document.getElementById("map").contentDocument.documentElement;
        $(theMap).on('click', xy);
}

function randInt(min, max)  {
    return Math.floor((Math.random() * max) + min);
}

function createCircle (experiment, x, y, dx, dy, dt) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', 4);
  circle.setAttributeNS(null, 'to_x', dx);
  circle.setAttributeNS(null, 'to_y', dy);
  circle.setAttributeNS(null, 'wait', dt);
  circle.setAttributeNS(null, 'class', "job " + experiment);
  circle.setAttributeNS(null, 'fill', 'blue' );
  theMap.appendChild(circle);
  return circle;
}

function animateCircle() {
    $.get('/api/revents', function(data) { doAnimation(data); });
}

function doAnimation(d) {
    var circs = [];
    function mkTime(time)   {
        return time * 10;
    }
    //createCircle('star', randInt(10, 50), randInt(10, 80));
    jQuery.each(d, function(time, data) {

        circs.push($(createCircle('star', 500, 300, data[1], data[2], mkTime(time))));
    });
    jQuery.each(circs, function (idx, $obj) {
        $obj.velocity({
                translateX: "+="+$obj.attr('to_x'),
                translateY: "+="+$obj.attr('to_y'),
                }, { delay: $obj.attr('wait'), } )
            .velocity({r: 9}, {duration: 1200})
            .velocity({r: 1}, {complete: function(e) { $(e).remove(); }});
    });
}

function xy(e) {
    var dim = e.currentTarget.getBoundingClientRect();
    var pctX = e.clientX / dim.width;
    var pctY = e.clientY / dim.height;
    var rack = prompt("Enter Rack Name", "11-1");
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

$('#map').on('load', findMap);
//$('#map').hover(animateCircle);
