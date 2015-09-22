# Overblikk over NVDB API

For å kunne ta i bruyk NVDB API på en effektiv måte, er det en fordel å ha kunnskap om hvordan NVDBs datamodell er bygd opp. 

Denne presentasjonen går gjennom følgende tema:

* Innhold i NVDB
* Datakatalogen


## Innhold i NVDB

NVDB inneholder Norges offisielle digitale vegnett, med både geometri og topologi. Vi vet hvor en veg befinner seg, og hvordan den henger sammen. 

I tillegg inneholder NVDB mellom 300 og 400 typer vegobjekter, som er stedfestet til vegnettet. 

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

* Punktobjekttyper – Fagdata som normalt er koblet til vegnettet gjennom ett punkt
*	Strekningsobjekttyper – Fagdata som er koblet til vegnettet over en strekning


## Datakatalogen

Innholdet i NVDB defineres i en egen metadatabase, som kalles Datakatalogen. 

Datakatalogen inneholder  vegobjekttyper, med tilhørende egenskapstyper, tillatte verdier og assosiasjoner. Det finnes også styringsparametere, med et regelverk som enda mer detaljert beskriver hvordan et objekt kan, eller ikke kan registreres. 

Alle vegobjekttyper, egenskapstuyper og tillatte verdier har en unik id. Vegobjekttypen Bomstasjon har for eksempel id lik 45. 

I NVDB API skal det brukes id, og ikke navn, når det hentes en spesifikk vegobjekttype. 

Mer informasjon:

* http://tfprod1.sintef.no/datakatalog/ – Tekst
* http://labs.vegdata.no/nvdb-datakatalog/ – Tekst


## Eksempel på vegobjekt

Et vegobjekt har en unik id, og er av en bestemt vegobjekttype.

    {
        objektId: 487458621,
        objektTypeId: 45,
    }

Et vegobjekt har egenskaper med tilhørende verdier. Egenskapstypen er angitt ved navn og id. 

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


Et fagdata-objekt i NVDB består av følgende:
* Egenskaper med tilhørende verdier
* Stedfesting i form av tilknytning til vegnettets lenke-node-struktur. Et punktobjekt er enthydig stedfestet ved en veglenke-id + posisjon på lenka (mellom 0 og 1). Strekningsobjekter stedfestes ved en eller flere veglenkesegmenter, lenke-id + fra- og til-posisjon. Det kan også angis egenskaper for stedfestingen: Sideposisjon, kjørefelt og retning.
* Tilleggsstedfesting ved koordinater (egengeometri), som gjelder objekttyper der datakatalogen tillater det. Denne form for stedfesting har også støtte for kvalitetsparametere, som blant annet kan si noe om målekvalitet, jfr. SOSI-standarden.
* Unik NVDB objekt-id, en eller flere objektversjoner, gyldighetsperiode pr. objektversjon (start-/slutt-dato). Objekttyper osm er definert som ikke-tidsromrelevante (også kalt hendelser), har aldri mer enn én versjon, for eksempel trafikkulykke og skred. 
* Et objekt kan ha relasjon til andre objekter. Et objekt har en kobling til de objektene som er nedenfor objektet i objekthierarkiet, men ikke motsatt. I NVDB-sammenheng kalles relasjoner kalles ofte for mor-datter-koblinger. 

* Et objekt har også følgende: Tilknytning til vegnettet og assosiasjoner til andre objekter
* Kort om vegnett: Topologisk vegnettverk med veglenker, vegreferanse, utledet geometri og egengeometri
* 

## Områder

Indirekte stedfestet gjennom vegnettet. 

## Historikk

Objekter i NVDB-databasen slettes som hovedregel ikke. De settes i stedet historiske, ved at det angis en sluttdato. Dersom et objekt får en ny verdi på en egenskap, slettes ikke den eksisterende egenskapsverdien fra databasen. Det opprettes i stedet en ny versjon av objektet. Den eksisterende versjonen får en sluttdato, mens den nye versjonen får en tilsvarende startdato. Denne oppførselen kan overstyres, ved å spesifisere at det skal skje en korreksjon (feilretting), i stedet for en endring.

## Vegnett


## Under panseret

Arkitekturskisse. 
