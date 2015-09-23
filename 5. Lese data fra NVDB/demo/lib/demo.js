// Map projection
var crs = new L.Proj.CRS('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs ',
 {
   origin: [-2500000.0, 9045984.0],
   resolutions: [
     21674.7100160867,
     10837.35500804335,
     5418.677504021675,
     2709.3387520108377,
     1354.6693760054188,
     677.3346880027094,
     338.6673440013547,
     169.33367200067735,
     84.66683600033868,
     42.33341800016934,
     21.16670900008467,
     10.583354500042335,
     5.291677250021167,
     2.6458386250105836,
     1.3229193125052918,
     0.6614596562526459,
     0.33072982812632296,
     0.1653649140631615
   ]
 });

var kartcache = 'http://m{s}.nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}';
var map = L.map('map', {crs: crs}).setView([63.43, 10.40], 3);

// Initialize map
new L.tileLayer(kartcache, {
    maxZoom: 17,
    maxNativeZoom: 16,
    minZoom: 3,
    subdomains: '123456789',
    continuousWorld: true,
    attribution: 'NVDB Utviklerkonferanse'
  }).addTo(map);

var skredLayers = L.layerGroup().addTo(map);
var tunnelLayers = L.layerGroup().addTo(map);

var drawTunnels = function(sokeResponse) {
  drawFeatures(sokeResponse, tunnelLayers, "#B09");
}

var drawSkred = function(sokeResponse) {
  drawFeatures(sokeResponse, skredLayers, "#009");
}

var drawFeatures = function(sokeResponse, layerGroup, color) {
  layerGroup.clearLayers();
  var features  = sokeResponse.resultater[0].vegObjekter;
  if (Array.isArray(features)) {
    features.forEach(function(feature) {
      var leafletFeature = omnivore.wkt.parse(feature.lokasjon.geometriWgs84)
      leafletFeature.setStyle({color: color});
      leafletFeature.vegdata = feature.objektId;
      leafletFeature.on("click", function(e) {
        var objektid = e.target.vegdata;
        listDetails(objektid, function(vegobjekt) {
          writeObject(vegobjekt)
        });
      });
      layerGroup.addLayer(leafletFeature);
    });
  }
}

var clearNode = function(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

var writeObject = function(vegobjekt) {
  var appendTo = document.getElementById("objektdetaljer");
  clearNode(appendTo);

  var dl = document.createElement("dl");

  dl.appendChild(createNodeWithText("dt", "ObjektId"));
  dl.appendChild(createNodeWithText("dd", vegobjekt.objektId));
  dl.appendChild(createNodeWithText("dt", "ObjektTypeId"));
  dl.appendChild(createNodeWithText("dd", vegobjekt.objektTypeId));

  for(var i = 0; i < vegobjekt.egenskaper.length; i = i + 1) {
    dl.appendChild(createNodeWithText("dt", vegobjekt.egenskaper[i].navn));
    dl.appendChild(createNodeWithText("dd", vegobjekt.egenskaper[i].verdi));
  }

  appendTo.appendChild(dl);
}

var createNodeWithText = function(nodeName, nodeText) {
  var node = document.createElement(nodeName);
  var textNode = document.createTextNode(nodeText);
  node.appendChild(textNode);
  return node;
}

var prettyPrint = function(json) {
  var element = document.getElementById("jsonoutput");
  clearNode(element);
  var output = createNodeWithText("pre", JSON.stringify(json, null, 2));
  element.appendChild(output);
}


var listDetails = function(objektId, callback) {
  get("https://www.vegvesen.no/nvdb/api/vegobjekter/objekt/" + objektId, callback);
}

var get = function(url, callback) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url);
  oReq.onreadystatechange = function (aEvt) {
  if (oReq.readyState == 4) {
     if(oReq.status == 200) {
       prettyPrint(JSON.parse(oReq.responseText));
       var sokeResponse = JSON.parse(oReq.responseText);
       callback(sokeResponse);
     } else {
       console.log("ERROR loading from API");
     }
    }
  };
  oReq.send();
}

document.getElementById("timeline").addEventListener("change", function(e) {
  timeLineUpdate(e.target.value);
});

document.getElementById("county").addEventListener("change", function(e) {
  countyUpdate(e.target.value)
});
