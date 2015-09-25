/**

Vi bruker leaflet til å tegne vegobjekter i kartet. Bakgrunnskartet er hentet fra NVDB og Geodata.

**/

// Utfører en get-request til NVDB API og kaller callback-funksjonen med responsen i json-format.
var performSearch = function(kriterie, callback) {
  get("https://www.vegvesen.no/nvdb/api/sok?kriterie=" + encodeURIComponent(JSON.stringify(kriterie)), callback)
}

var updateYear = function(year) {
  // Funksjonen tar ikke hensyn til årstallet nå.
  // Objekttype 67 - tunnelløp
  var searchCriteria = createCriteria(67, null, null, null);
  performSearch(searchCriteria, function(features) {
    // Funksjon for å tegne tunneler i kartet. Den har en søsterfunksjon, drawSkred som tegner snøskred.
    drawTunnels(features);
  });
}

var timeLineUpdate = function(value) {
  // value er et tall mellom 1990 and 2015
  updateYear(value);
}

var countyUpdate = function(value) {
  // Value is a number between 1 and 20, except 13 which is not a county in norway ;)
}

// lager et kriterie som brukes til søk-endepunktet til NVDB-leseapi
var createCriteria = function(objektTypeId, year, filterType, county) {
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
