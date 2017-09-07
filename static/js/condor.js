var svgns = "http://www.w3.org/2000/svg";

$.fn.exists = function () {
    return this.length !== 0;
};

function createCircle () {
  var svg = this.getSVGDocument().documentElement;
  console.log(svg);
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', 50);
  circle.setAttributeNS(null, 'cy', 30);
  circle.setAttributeNS(null, 'r', 10);
  circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 3px;' );
  svg.appendChild(circle);
}

function animateCircle () {
  var svg = this.getSVGDocument().documentElement;
  if ($(svg).find('circle').exists()) {
    var $circ = $(svg).find('circle.job');
    console.log("Found Circle");
    console.log($circ);
  } else {
    console.log("Create Circle");
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', 150);
    circle.setAttributeNS(null, 'cy', 90);
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 3px;' );
    circle.setAttributeNS(null, 'class', 'job' );
    svg.appendChild(circle);
  }
}

//$('#map').on('load', createCircle);
$('#map').hover(animateCircle);
