# NVDB Lese API

APIet inneholder i grove trekk følgende.

* Vegobjekter på XML/JSON-format
* Vegnettet på GML/GeoJSON-format
* Datakatalogen på XML/JSON-format
* Søk-endepunkt for avanserte søk
* Område-endepunkt for enkelt å hente ut områder

## Hovedprinsipper

* Basert på REST-prinsipper
* Leverer ut JSON og XML
* Tilstandsløst
* Helt åpent (ingen autentisering)

## Vegobjekter:

Et vegobjekt er et objekt av en gitt objekttype. F.eks kan et vegobjekt være en konkret bomstasjon eller trafikkulykke. Et vegobjekt er stedfestet på vegnettet og har dermed utledet en geometri for hvor objektet er plassert. I tillegg så inneholder et vegobjekt et sett med egenskaper med verdier for hver egenskap for det objektet. Beskrivelse av egenskapene finnes i datakatalogen som har metadata om vegobjektets type.

Et vegobjekt har også et sett lokasjonsattributter. Disse attributtene beskriver hvor objektet er stedfestet, både på vegnettet, men også innenfor hvilket fylke og kommune.

Flere detaljer finnes i [dokumentasjonen](https://www.vegvesen.no/nvdb/api/dokumentasjon) til APIet.

 Eksempel på vegobjekt respons (responsen er kortet ned for å være mer lesbar.):

 ```json
 {
    "objektId":305811794,
    "objektTypeId":45,
    "versjonsId":1,
    "startDato":"2011-09-29",
    "sluttDato":"2016-09-01",
    "egenskaper":[
       {
          "id":1078,
          "navn":"Navn bomstasjon",
          "verdi":"Ryaforbindelsen"
       },
       {
          "id":1819,
          "navn":"Takst stor bil",
          "verdi":"100.0",
          "enhet":{
             "id":19,
             "navn":"Kroner",
             "kortNavn":"Kr"
          }
       },
       {
          "id":1820,
          "navn":"Takst liten bil",
          "verdi":"100.0",
          "enhet":{
             "id":19,
             "navn":"Kroner",
             "kortNavn":"Kr"
          }
       },
       {
          "id":4752,
          "navn":"Geometri, punkt",
          "verdi":"POINT (647298.723999023 7723127.29101563)"
       }
    ],
    "modifisert":"2015-04-26T22:57:03+02:00",
    "lokasjon":{
       "egengeometri":true,
       "geometriUtm33":"POINT (647298.723999023 7723127.29101563)",
       "geometriWgs84":"POINT (18.784201492479962 69.57578317632489)",
       "geometriForenkletUtm33":"POINT (647298.723999023 7723127.29101563)",
       "geometriForenkletWgs84":"POINT (18.784201492479962 69.57578317632489)",
       "kommune":{
          "nummer":1902,
          "navn":"TROMSØ"
       },
       "fylke":{
          "nummer":19,
          "navn":"TROMS"
       },
       "region":{
          "nummer":5,
          "navn":"NORD"
       },
       "vegAvdeling":{
          "nummer":19,
          "navn":"Troms vegavdeling"
       },
       "politiDistrikt":{
          "nummer":25,
          "navn":"Troms"
       },
       "kontraktsOmrade":[
          {
             "nummer":1905,
             "navn":"1905 TROMSØ 2011-2016"
          },
          {
             "nummer":5005,
             "navn":"5005 Troms 2011-2016"
          }
       ],
       "veglenker":[
          {
             "id":2057937,
             "fra":0.841971,
             "til":0.841971,
             "direction":"WITH",
             "felt":"2",
             "sidepos":"NULL"
          }
       ],
       "vegReferanser":[
          {
             "fylke":19,
             "kommune":0,
             "kategori":"F",
             "status":"V",
             "nummer":858,
             "hp":6,
             "fraMeter":2893
          }
       ]
    }
 }
 ```

## Vegnett

Vegnettet i NVDB er bygd opp av et sett med veglenker som tilsammen utgjør hele norges vegnett. For veldig mange detaljer se [Håndbok V830 Nasjonalt Vegreferansesystem](http://www.vegvesen.no/_attachment/61505/binary/1000471?fast_title=H%C3%A5ndbok+V830+Nasjonalt+vegreferansesystem.pdf).

Vegnett-endepunktet er et beta-endepunkt, så det kan endre seg, for å hente ut disse veglenkene. Eksempel på en veglenke er nedenfor, legg merke til at de følger GeoJSON-formatet

Her er en enkel veglenke med en linje mellom to punkter. I tillegg er det en del metadata om veglenken i "properties"-feltet.

```json
{
   "type":"Feature",
   "geometry":{
      "type":"LineString",
      "coordinates":[
         [
            896514.112548828,
            7913661.56152344
         ],
         [
            896522.871459961,
            7913662.14953613
         ]
      ]
   },
   "properties":{
      "lokalId":925921,
      "delId":1,
      "veglenkeFraDato":"1950-01-01",
      "veglenkeTilDato":null,
      "datafangstdato":"1998-09-07",
      "fylke":20,
      "kommune":2019,
      "typeVeg":"Enkel bilveg",
      "detaljNivå":"Vegtrase",
      "medium":null,
      "startnode":{
         "Identifikator":{
            "lokalId":"940203",
            "navnerom":"http://www.vegvesen.no/nvdb/referansenoder/so"
         }
      },
      "startVerdi":"0",
      "sluttnode":{
         "Identifikator":{
            "lokalId":"1818975",
            "navnerom":"http://www.vegvesen.no/nvdb/referansenoder/so"
         }
      },
      "sluttVerdi":"0.0580551043538345",
      "kvalitet":{
         "målemetode":22,
         "nøyaktighet":200,
         "målemetodeHøyde":null,
         "nøyaktighetHøyde":-1
      }
   }
}
```

## Datakatalogen

Datakatalogen inneholder beskrivelse av vegobjekttypene som finnes i NVDB. Eksempel på beskrivelse av bomstasjon objekttype. Merk at responsen er kortet ned for å være mer lesbar.

```json
{
   "id":45,
   "navn":"Bomstasjon",
   "self":{
      "rel":"self",
      "uri":"/datakatalog/objekttyper/45"
   },
   "egenskapsTyper":[
      {
         "id":100045,
         "navn":"PunktTilknytning",
         "self":{
            "rel":"self",
            "uri":"/datakatalog/egenskapstype/100045"
         },
         "geometriType":"Punkt",
         "sorteringsnummer":0,
         "viktighet":"IKKE_SATT"
      },
      {
         "id":9390,
         "navn":"Bomstasjonstype",
         "beskrivelse":"Angir hvilken type bomstasjon det er tale om",
         "type":"ENUM",
         "self":{
            "rel":"self",
            "uri":"/datakatalog/egenskapstype/9390"
         },
         "enumVerdier":{
            "13133":{
               "id":13133,
               "kortVerdi":"AA",
               "verdi":"AutoPASS + automatisk",
               "beskrivelse":"Bomstasjon har autopass og automatisk betaling",
               "sorteringsnummer":2
            },
            "13132":{
               "id":13132,
               "kortVerdi":"AM",
               "verdi":"AutoPASS + manuell",
               "beskrivelse":"Bomstasjon har Autopass og manuell betaling",
               "sorteringsnummer":1
            },
            "13134":{
               "id":13134,
               "kortVerdi":"M",
               "verdi":"Kun manuell",
               "beskrivelse":"Bomstasjon har kun manuell innkreving",
               "sorteringsnummer":3
            }
         },
         "sorteringsnummer":1,
         "viktighet":"PÅKREVD",
         "sosiNavn":"Bomstasjonstype_9390"
      },

      {
         "id":1819,
         "navn":"Takst stor bil",
         "beskrivelse":"Angir ordinær takst for å passere bomstasjon med stor bil.   Det skal angis første takst etter midnatt som er har en kostnad over kr 0 på ukedag mandag. .",
         "type":"Tall",
         "self":{
            "rel":"self",
            "uri":"/datakatalog/egenskapstype/1819"
         },
         "enhet":{
            "id":19,
            "navn":"Kroner",
            "kortNavn":"Kr"
         },
         "sorteringsnummer":11,
         "viktighet":"PÅKREVD",
         "merknadRegistrering":"Informasjon blir automatisk overført fra CS-Norge, og skal derfor ikke angis direkte (Gjelder fra høst 2015).",
         "sosiNavn":"TakstStorBil_1819",
         "defaultVerdi":"0.0",
         "minVerdi":"5.0",
         "maxVerdi":"2000.0",
         "absoluttMinVerdi":"0.0",
         "absoluttMaxVerdi":"5000.0"
      }
   ],
   "beskrivelse":"Et punkt i vegnettet hvor det kreves betaling for å kunne kjøre videre.  Kan gjelde i en eller begge retninger.",
   "geometriType":"PUNKT",
   "styringsParametre":{
      "tidsromRelevant":true,
      "sekType2Ok":false,
      "abstraktObjektType":false,
      "filtrering":false,
      "avledet":false,
      "kreverMorObjekt":false,
      "erDataserie":false,
      "dekningsgrad":"",
      "overlapp":true,
      "kjorefeltRelevant":"KAN",
      "sidePosisjonRelevant":"NEI",
      "hoydeRelevant":false,
      "retningRelevant":false,
      "flyttbar":true,
      "ajourholdI":"OVERLEVER",
      "ajourholdSplitt":"KAN_IKKE_SPLITTES"
   },
   "assosiasjoner":[
      {
         "relasjonsId":1900,
         "vegObjektType":794,
         "kardinalitet":"EN_TIL_MANGE",
         "relasjon":"BESTAR_AV",
         "assosiasjon":{
            "rel":"BESTAR_AV",
            "kardinalitet":"EN_TIL_MANGE",
            "uri":"/datakatalog/objekttyper/794",
            "typeId":794,
            "typeNavn":"Systemobjekt"
         },
         "innenforMor":"Ja",
         "relasjonsType":"Komposisjon"
      },
      {
         "relasjonsId":1416,
         "vegObjektType":446,
         "kardinalitet":"EN_TIL_MANGE",
         "relasjon":"BESTAR_AV",
         "assosiasjon":{
            "rel":"BESTAR_AV",
            "kardinalitet":"EN_TIL_MANGE",
            "uri":"/datakatalog/objekttyper/446",
            "typeId":446,
            "typeNavn":"Dokumentasjon"
         },
         "innenforMor":"Ja",
         "relasjonsType":"Komposisjon"
      }
   ],
   "startDato":"2012-05-08"
}
```

## Områder

Leseapiet har et eget områdeendepunkt for å enkelt hente ut de interessante områdene i NVDB-sammenheng. Disse områdene er også lagret som vegobjekter og kan hentes ut på samme måte som andre vegobjekter. Dette endepunktet er mest for å enkelt kunne hente ut områder til bruk i f.eks søk-endepunktet.

Eksempel på henting av regioner:

```json
{
   "regioner":[
      {
         "navn":"ØST",
         "nummer":1
      },
      {
         "navn":"SØR",
         "nummer":2
      },
      {
         "navn":"VEST",
         "nummer":3
      },
      {
         "navn":"MIDT",
         "nummer":4
      },
      {
         "navn":"NORD",
         "nummer":5
      }
   ]
}
```
