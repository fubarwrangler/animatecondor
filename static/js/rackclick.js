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

$('#map').on('load', function () {
  theMap = document.getElementById("map").contentDocument.documentElement;
  $(theMap).on('click', xy);
});
