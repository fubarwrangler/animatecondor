var svgns = "http://www.w3.org/2000/svg";


function createCircle (event) {
  var svg = this.getSVGDocument().documentElement;
  console.log(svg);
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', 50);
  circle.setAttributeNS(null, 'cy', 30);
  circle.setAttributeNS(null, 'r', 10);
  circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 3px;' );
  svg.appendChild(circle);
}

$('#map').hover(createCircle);
