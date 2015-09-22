# Overblikk over NVDB API

For å ta i bruk NVDB API, er det en fordel 

## Et NVDB-objekt

Et fagdata-objekt i NVDB består av følgende:
* Egenskaper med tilhørende verdier
* Stedfesting i form av tilknytning til vegnettets lenke-node-struktur. Et punktobjekt er enthydig stedfestet ved en veglenke-id + posisjon på lenka (mellom 0 og 1). Strekningsobjekter stedfestes ved en eller flere veglenkesegmenter, lenke-id + fra- og til-posisjon. Det kan også angis egenskaper for stedfestingen: Sideposisjon, kjørefelt og retning.
* Tilleggsstedfesting ved koordinater (egengeometri), som gjelder objekttyper der datakatalogen tillater det. Denne form for stedfesting har også støtte for kvalitetsparametere, som blant annet kan si noe om målekvalitet, jfr. SOSI-standarden.
* Unik NVDB objekt-id, en eller flere objektversjoner, gyldighetsperiode pr. objektversjon (start-/slutt-dato). Objekttyper osm er definert som ikke-tidsromrelevante (også kalt hendelser), har aldri mer enn én versjon, for eksempel trafikkulykke og skred. 
* Et objekt kan ha relasjon til andre objekter. Et objekt har en kobling til de objektene som er nedenfor objektet i objekthierarkiet, men ikke motsatt. I NVDB-sammenheng kalles relasjoner kalles ofte for mor-datter-koblinger. 


## Datakatalogen


* Alle objekttyper har en id, som benyttes i APIet. Navnene kan i teorien endres.
* Datakatalogen inneholder oversikt over alle vegobjekttyper, egenskapstyper, tillatte verdier osv.
* Bruk ider når dere spør APIet og leser responsen!

## Vegnett 

* Et objekt har også følgende: Tilknytning til vegnettet og assosiasjoner til andre objekter
* Kort om vegnett: Topologisk vegnettverk med veglenker, vegreferanse, utledet geometri og egengeometri
* 

## Historikk

Objekter i NVDB-databasen slettes som hovedregel ikke. De settes i stedet historiske, ved at det angis en sluttdato. Dersom et objekt får en ny verdi på en egenskap, slettes ikke den eksisterende egenskapsverdien fra databasen. Det opprettes i stedet en ny versjon av objektet. Den eksisterende versjonen får en sluttdato, mens den nye versjonen får en tilsvarende startdato. Denne oppførselen kan overstyres, ved å spesifisere at det skal skje en korreksjon (feilretting), i stedet for en endring.
