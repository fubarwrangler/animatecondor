var svgns = "http://www.w3.org/2000/svg";
var theMap = null;

function findMap() {
    if (theMap == null)
        theMap = document.getElementById("map").contentDocument.documentElement;
}

$.fn.exists = function () {
    return this.length !== 0;
};

function createCircle () {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', 50);
  circle.setAttributeNS(null, 'cy', 30);
  circle.setAttributeNS(null, 'r', 10);
  circle.setAttributeNS(null, 'class', 'job');
  circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 3px;' );
  theMap.appendChild(circle);
}

function animateCircle () {


    console.log(theMap);
    var circ = $(theMap).find('.job');


    // $(circ)
    //     .delay(500)
    //     .velocity({ x: "+=400", y: "+=600" })
    //     .velocity({ fillGreen: 255, strokeWidth: 2 })
    //     .velocity({ height: 50, width: 50 })
    //     .velocity({ rotateZ: 90, scaleX: 0.5 })
    //     .velocity("reverse", { delay: 250 });
}

$('#map').on('load', findMap);
$('#map').on('load', createCircle);
$('#map').hover(animateCircle);
