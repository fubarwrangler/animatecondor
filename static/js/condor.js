var svgns = "http://www.w3.org/2000/svg";
var theMap = null;

function findMap() {
    if (theMap == null)
        theMap = document.getElementById("map").contentDocument.documentElement;
}

$.fn.exists = function () {
    return this.length !== 0;
};

function createCircle (experiment, dx, dy) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', 50);
  circle.setAttributeNS(null, 'cy', 30);
  circle.setAttributeNS(null, 'r', 10);
  circle.setAttributeNS(null, 'class', 'job');
  circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 3px;' );
  theMap.appendChild(circle);
}

function animateCircle() {
    $.get('/api/revents', function(data) { doAnimation(data); });
}

function doAnimation(d) {
    console.log(d);
}
$('#map').on('load', findMap);

$('#map').on('load', createCircle);
$('#map').hover(animateCircle);
