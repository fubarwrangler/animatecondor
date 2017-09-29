var svgns = "http://www.w3.org/2000/svg";
var theMap = null;

function findMap() {
    if (theMap == null)
        theMap = document.getElementById("map").contentDocument.documentElement;
}

function randInt(min, max)  {
    return Math.floor((Math.random() * max) + min);
}

$.fn.exists = function () {
    return this.length !== 0;
};

function createCircle (experiment, x, y, dx, dy, dt) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', 8);
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

        circs.push($(createCircle('star', 40, 30, data[1], data[2], mkTime(time))));
    });
    jQuery.each(circs, function (idx, $obj) {
        $obj.velocity(
            {translateX: "+="+$obj.attr('to_x'), translateY: "+="+$obj.attr('to_y') },
            {delay: $obj.attr('wait')}
        );
        console.log($obj.attr('wait'));
    });

}
$('#map').on('load', findMap);
$('#map').hover(animateCircle);
