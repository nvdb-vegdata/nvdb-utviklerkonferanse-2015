/**
Vi bruker leaflet til å tegne vegobjekter i kartet. Bakgrunnskartet er hentet fra NVDB og Geodata.
**/

var year = 0;
var county = 2; // 2 - akershus

var options = {
  objektTypeId: 67,
  year: null,
  filterType: null,
  county: 2
};

// Utfører en get-request til NVDB API og kaller callback-funksjonen med responsen i json-format.
var performSearch = function(kriterie, callback) {
  get("https://www.vegvesen.no/nvdb/api/sok?kriterie=" + encodeURIComponent(JSON.stringify(kriterie)), callback)
}

var update = function() {
  // Funksjonen tar ikke hensyn til årstallet eller fylke nå nå.
  var searchCriteria = createCriteria(options);

  performSearch(searchCriteria, function(features) {
    // Funksjon for å tegne tunneler i kartet. Den har en søsterfunksjon, drawSkred som tegner snøskred.
    drawTunnels(features);
  });
}


/* Events
------------------------------------------------------------------------------*/

// kalles ved slider update
var timeLineUpdate = function(value) {
  // value er et tall mellom 1990 and 2015
  update();
}

// kalles ved endring av fylke
var countyUpdate = function(value) {
  // Value is a number between 1 and 20, except 13 which is not a county in norway ;)
  update();
}


/*
------------------------------------------------------------------------------*/
// lager et kriterie som brukes til søk-endepunktet til NVDB-leseapi
// var createCriteria = function(objektTypeId, year, filterType, county) {
var createCriteria = function (options) {
  var objektTypeId  = options.objektTypeId
  , year            = null
  , filterTYpe      = null
  , county          = null;

  return {
    lokasjon: {
      // fylke: [county],
      srid:"wgs84"
   },
   objektTyper:[{
     id: objektTypeId,
     antall: "10",
     filter:[
       // Eksempel på filter etter tunneler som er lengre enn 200-meter
       //{"type":"Lengde","operator":">=","verdi":["200"]}
     ]
   }]};
}
