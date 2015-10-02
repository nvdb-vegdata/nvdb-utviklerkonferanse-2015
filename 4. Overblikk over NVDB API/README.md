# Overblikk over NVDB API

For å kunne ta i bruk NVDB API på en effektiv måte, er det en fordel å ha kunnskap om hvordan NVDBs datamodell er bygd opp. 

Denne presentasjonen går gjennom et de byggesteinene et typisk vegobjekt i NVDB er bygd opp av. 


## Innhold i NVDB

NVDB inneholder Norges offisielle digitale vegnett, med både *geometri* og *topologi*. Vegen kan plasseres på kart, og det er mulig å finne en rute mellom to punkter på vegnettet. 

Vegobjekter, som stedfestes til vegnettet, er den andre viktige delen av NVDB. Det finnes mellom 300 og 400 ulike typer vegobjekter, som inneholder verdifull informasjon om vegen. 


Eksempel på vegobjekttyper:

* Fartsgrense
* Trafikkmengde
* Trafikkulykke
* Skiltplate
* Rekkverk
* Belysningspunkt
* Tunnel
* Bomstasjon

Vegobjekttypene kan deles inn i to kategorier:

* *Punktobjekttyper* – Fagdata som normalt er koblet til vegnettet gjennom ett punkt
* *Strekningsobjekttyper* – Fagdata som er koblet til vegnettet over en strekning


## Datakatalogen

Hvilke typer vegobjekter som kan registreres i NVDB, defineres i en egen metadatabase, som kalles *datakatalogen*. 

Datakatalogen inneholder *vegobjekttyper*, med tilhørende *egenskapstyper*, *tillatte verdier* og *relasjoner*. Det finnes også *styringsparametere*, som detaljert angir hvordan et objekt kan, eller ikke kan, registreres. 

Alle vegobjekttyper, egenskapstyper og tillatte verdier har en unik id. Vegobjekttypen _Bomstasjon_ har for eksempel id lik _45_. 

I NVDB API skal det brukes id, og ikke navn, når det skal angis en spesifikk vegobjekttype. 

Mer informasjon:

* http://labs.vegdata.no/nvdb-datakatalog/ – Nettsted som inneholder de viktigste detaljene fra datakatalogen
* http://tfprod1.sintef.no/datakatalog/ – Nedlastbar javaklient for komplett innsyn i datakatalogen


## Eksempel på vegobjekt

Et vegobjekt har en unik id, og er av en bestemt vegobjekttype. 

    {
        objektId: 487458621,
        objektTypeId: 45,
    }

### Egenskaper

Et vegobjekt har egenskaper med tilhørende verdier. Hver egenskapstype er angitt med navn og id. 

    {   
        egenskaper: [
            {
                id: 1078,
                navn: "Navn bomstasjon",
                verdi: "Torbjørns Brattsveg"
            },
            {
                id: 1819,
                navn: "Takst stor bil",
                verdi: "24.0"
            },
            {
                id: 1820,
                navn: "Takst liten bil",
                verdi: "8.0"
            },
            {
                id: 9390,
                navn: "Bomstasjonstype",
                verdi: "AutoPASS + automatisk"
            },
            {
                id: 9391,
                navn: "Navn bompengeanlegg",
                verdi: "Miljøpakke Trondheim"
            }
        ]
    }

Datakatalogen inneholder informasjon om blant annet egenskapstypene datatype, for eksempel *tekst*, *tall* eller *enum*. For egenskapstyper av type enum er det definert et sett av tillatte verdier. 


### Koordinater

Et vegobjekt er koordinatfestet, som gjør at det kan vises på kart. Enten punkt-, linje- eller flategeometri. Koordinatene er lagret i projeksjonen UTM33 i NVDB-databasen, men det er også mulig å hente WGS84-koordinater gjennom NVDB API. 

De fleste vegobjekter har en geometri som er utledet fra vegnettet, og er derfor plassert langs vegens senterlinje. Egengeometri blir mer og mer utbredt. Om et objekt har egengeometri eller ikke, er eksplisitt angitt i API-responsen. 


    {
        geometriUtm33: "POINT (271441.3500267718 7039309.464531345)",
        geometriWgs84: "POINT (10.420684407973214 63.40878189800789)"
    }


### Stedfesting til vegnettet

Et vegobjekt er stedfestet til vegnettets lenke-node-struktur. Et punktobjekt er enthydig stedfestet ved en veglenke-id + en relativ posisjon på veglenkenlenken mellom 0 og 1. Strekningsobjekter stedfestes ved en eller flere veglenkesegmenter, ved  lenke-id og fra- og til-posisjon. Det kan også angis egenskaper for stedfestingen: Sideposisjon, kjørefelt og retning.

Veglenkeposisjonen er først og fremst nyttig for de som har bruk for objektets posisjon på det topologiske vegnettet. 

    {
        veglenker: [
            {
                id: 42636,
                fra: 0.822016,
                til: 0.822016,
                direction: "WITH",
                felt: null,
                sidepos: "NULL"
            }
        ]
    }


### Vegreferanse

Et vegobjekt har vegreferanse, for eksempel *Europaveg 6*, *E6*, som er en administrativ betegnelse på vegen. 

    {
        vegReferanser: [
            {
                fylke: 16,
                kommune: 0,
                kategori: "F",
                status: "V",
                nummer: 860,
                hp: 1,
                fraMeter: 688
            }
        ]
    }

### Områder

Et vegobjekt har beliggenhet innenfor administrative områder. 

    {
        kommune: {
            nummer: 1601,
            navn: "TRONDHEIM"
        },
        fylke: {
            nummer: 16,
            navn: "SØR-TRØNDELAG"
        },
        region: {
            nummer: 4,
            navn: "MIDT"
        },
        vegAvdeling: {
            nummer: 16,
            navn: "Sør-Trøndelag"
        }
        kontraktsOmrade: [
            {
            navn: "1610 Trondheim Indre 2015-2020"
            },
            {
            navn: "1609 TrondheimBydrift 2011-2015"
            }
        ]
    }


### Relasjoner

Et objekt kan ha en assosiasjon til andre objekter, oftest i form av en komposisjon. Et ordinært vegskilt består for eksempel av ett skiltpunkt, som er komponert av flere skiltplater. I NVDB kalles denne type relasjoner ofte for *mor-datter-koblinger*. 

![Vegskilt](https://raw.githubusercontent.com/nvdb-vegdata/nvdb-utviklerkonferanse-2015/master/4.%20Overblikk%20over%20NVDB%20API/vegskilt.jpg)


### Historikk

Objekter i NVDB-databasen slettes som hovedregel ikke. De settes i stedet historiske, ved at det angis en sluttdato. Dersom et objekt får en ny verdi på en egenskap, slettes ikke den eksisterende egenskapsverdien fra databasen. Det opprettes i stedet en ny versjon av objektet. Den eksisterende versjonen får en sluttdato, mens den nye versjonen får en tilsvarende startdato.

    {
        "objektId":89248612,
        "objektTypeId":22,
        "versjonsId":3,
        "startDato":"2015-09-01",
        "sluttDato":"2019-09-01"
    }


Per dagens dato er det kun gyldige objektversjoner som eksponeres i NVDB API. I 2016 vil det utvikles støtte for historiske data.

## Vegnett

For mer informasjon, les [Håndbok V830 Nasjonalt vegreferansesystem](http://www.vegvesen.no/_attachment/61505/binary/1000471?fast_title=H%C3%A5ndbok+V830+Nasjonalt+vegreferansesystem.pdf).

## Arkitekturskisse

![Arkitektur](https://raw.githubusercontent.com/nvdb-vegdata/nvdb-utviklerkonferanse-2015/master/4.%20Overblikk%20over%20NVDB%20API/arkitektur.jpg)

