var performSearch = function(kriterie, callback) {
  get("https://www.vegvesen.no/nvdb/api/sok?kriterie=" + encodeURIComponent(JSON.stringify(kriterie)), callback)
}

var createCriteria = function(objektTypeId, year, type, county) {
  return {
    lokasjon: {
      fylke: [county],
      srid:"wgs84"
   },
   objektTyper:[{
     id: objektTypeId,
     antall: "100000",
     filter:[
       {"type":type,"operator":">=","verdi":[type === "Skred dato" ? "1990-01-01" : "1990"]},
       {"type":type,"operator":"<=","verdi":[type === "Skred dato" ? year + "-01-01" : year]}
     ]
   }]};
}

var updateYear = function() {
  var county = parseInt(document.getElementById("county").value);
  var year = document.getElementById("timeline").value;

  document.getElementById("timelineText").textContent = year;
  performSearch(createCriteria(445, year, "Skred dato", county), function(features) {
    drawFeatures(features, skredLayers, "#009");
  });
  performSearch(createCriteria(67, year, "Åpningsår", county), function(features) {
    drawFeatures(features, tunnelLayers, "#B09");
  });
}

var timeLineUpdate = function(value) {
  updateYear();
}

var countyUpdate = function(value) {
  updateYear();
}
