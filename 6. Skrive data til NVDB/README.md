# Overblikk over NVDB API Skriv

Denne presentasjonen krever kjennskap til NVDBs datamodell inkludert metadata som beskrevet i datakatalogen.

## Hovedprinsipper

NVDB API Skriv har følgende kjennetegn:

* Basert på REST-prinsipper
* Støtter både XML og JSON
* Asynkront, status innhentes ved polling
* Tilbyr CRUD-operasjoner på vegobjekter i NVDB via endringssett

## Endringssett
 
Den sentrale adresserbare ressursen i APIet er endringssett. All registrering, oppdatering, sletting og korrigering av vegobjekter skjer via et endringssett som POSTes til <host>/nvdb/apiskriv/v2/endringssett.

```xml
<endringssett datakatalogversjon="2.04" effektDato="2015-09-25">
   <registrer>
      ...
   </registrer>
   <oppdater>
      ...
   </oppdater>
   <slett>
      ...
   </slett>
   <korriger>
      ...
   </korriger>
</endringssett>
```

Et endringssett kan inneholde alle CRUD-elementene om ønskelig. På rotelementet må følgende attributter angis:
 
* **datakatalogversjon** - Angir datakatalogversjonen klienten har benyttet. Det gis advarsel dersom denne ikke gjeldende versjon i NVDB. 
* **effektDato** - Angir hvilken dato endringene gjelder fra. Denne tolkes ulikt avhengig av operasjon:
  * Registrer: Brukes som startdato for nye vegobjekter
  * Oppdater: Brukes som sluttdato for forrige versjon og startdato for ny versjon
  * Slett: Brukes som sluttdato for gjeldende versjon
  * Korriger: Ingen betydning
  
### Endringssett - Registrer

```xml
...
<registrer>
   <vegObjekter>
      <vegObjekt typeId="581" tempId="tunnel1">
         <assosiasjoner>
            ...
         </assosiasjoner>
         <egenskaper>
            ...
         </egenskaper>
         <lokasjon>
            ...
         </lokasjon>
      </vegObjekt>
      ...
   </vegObjekter>
</registrer>
...
```

Registrer-elementet definerer en eller flere ny vegobjekter for registrering i NVDB. Et nytt vegobjekt får en unik id i NVDB og gis versjonsnummer 1. Et vegObjekt består av:

* **assosiasjoner** - Sammenkoblinger av mor- og datterobjekter, dersom det er relevant.
* **egenskaper** - Et sett av egenskapsverdier for objektet.
* **lokasjon** - Stedfesting av objektet på vegnettet.

For hvert vegObjekt må følgende attributter angis:
 
* **typeId** - Vegobjekttypens identifikator i datakatalogen.
* **tempId** - En unik, egendefinert objektreferanse. Benyttes bl.a. i responser for å indikere hvilke vegobjekter som har valideringsfeil.

#### Egenskaper

```xml
...
<egenskaper>
   <egenskap typeId="5225">
      <verdi>Grevlingtunnelen</verdi>
   </egenskap>
   <egenskap typeId="9507">
      <verdi>2013-01-17</verdi>
   </egenskap>
   <egenskap typeId="6891">
      <verdi>srid=32633;POINT(265847 7044797)</verdi>
   </egenskap>
   ...
</egenskaper>
...
```

Egenskaper angir detaljerte opplysninger om vegobjektet. Ulike egenskaper forventer verdier av forskjellige datatyper: Streng, heltall, desimaltall,
dato, klokkeslett m.fl. De to siste godtar verdier formatert som i NVDB Klient-API eller i tråd med ISO8601-standarden. Egengeometri er en egenskap
på lik linje med andre og verdien her angis som en EWKT-streng.

For hver egenskap må følgende attributter angis:
 
* **typeId** - Egenskapstypens identifikator i datakatalogen.

#### Lokasjon

Vegobjekter stedfestes på NVDBs lenke-/nodestruktur, vegnettet (topologien), ikke via vegreferanser som i Klient-APIet. Datakatalogen avgjør om en
vegobjekttype har punkt eller strekningstilknytning til vegnettet. En tredje stedfestingsvariant, sving, benyttes kun unntaksvis.

Punkttilknytning angis slik:

```xml
...
<lokasjon>
   <punkt lenkeId="1125766" posisjon="0.3"/>
</lokasjon>
...
```

Strekningstilknytning angis slik:

```xml
...
<lokasjon>
   <linje lenkeId="676776" fra="0.0" til="0.34"/>
</lokasjon>
...
```

Dersom et objekt dekker flere lenker, kan punkt/linje repeteres innenfor lokasjon. Både punkt- og linje-elementer kan ha
ytterligere attributter (om datakatalogen krever det):

* **sidePosisjon** - Angir plassering av objektet på tvers av vegen.
* **felt** - Angir plassering i kjørefelt.
* **retning** - Angir om objektet er vendt mot en bestemt retning (i forhold til metreringsretning).

#### Assosiasjoner

Assosiasjoner kobler sammen mor- og datterobjekter i hierarkier. Morobjektet angir sine datterobjekter, ikke omvendt.

```xml
...
<assosiasjoner>
   <assosiasjon typeId="220711">
      <tempId>tunnelløp1</tempId>
   </assosiasjon>
</assosiasjoner>
...
```

Subelementet tempId indikerer at et annet vegobjekt i samme endringssett skal kobles til som datterobjekt. Dersom man ønsker å koble til
et allerede eksisterende vegobjekt i NVDB, angis dennes id med subelementet nvdbId.

For hver assosiasjon må følgende attributter angis:
 
* **typeId** - Sammenkoblingstypens identifikator i datakatalogen.

### Endringssett - Oppdater

```xml
...
<oppdater>
   <vegObjekter>
      <vegObjekt typeId="581" nvdbId="551800127" versjon="1">
         ...
      </vegObjekt>
      ...
   </vegObjekter>
</oppdater>
...
```

En oppdatering endrer et eksisterende vegobjekt i NVDB, og etablerer en ny versjon av objektet med endringene. Det er kun gjeldende versjon
av et vegobjekt som kan oppdateres, ikke tidligere versjoner. Oppdatering av en versjon som ikke er gjeldende blir avvist.

For hvert vegobjekt som skal oppdaters må følgende attributter angis:

* **typeId** - Vegobjekttypens identifikator i datakatalogen.
* **nvdbId** - Vegobjektets id i NVDB.
* **versjon** - Antatt gjeldende versjon av vegobjektet.

### Endringssett - Slett

```xml
...
<slett>
   <vegObjekter>
      <vegObjekt typeId="234" nvdbId="91610862" versjon="1" kaskadeSletting="ja"/>
      ...
   </vegObjekter>
</slett>
...
```

Sletting innebærer at gjeldende versjon av et vegobjekt lukkes, det vil si at sluttdato settes. Det er kun gjeldende versjon
av et vegobjekt som kan slettes. Sletting av en versjon som ikke er gjeldende blir avvist.

For hvert vegobjekt som skal oppdaters må følgende attributter angis:

* **typeId** - Vegobjekttypens identifikator i datakatalogen.
* **nvdbId** - Vegobjektets id i NVDB.
* **versjon** - Antatt gjeldende versjon av vegobjektet.
* **kaskadeSletting** - Angir om underordnede datterobjekter automatisk skal slettes.

Dersom kaskadeSletting settes til "nei" blir endringssettet avvist hvis det finnes datterobjekter i en komposisjonssammenheng (sterk binding),
fordi slike objekter alltid må et morobjekt.

### Endringssett - Korriger

```xml
...
<korriger>
   <vegObjekter>
      <vegObjekt typeId="581" nvdbId="551800127" versjon="1">
         ...
      </vegObjekt>
      ...
   </vegObjekter>
</korriger>
...
```

Korrigering innebærer at man endrer et eksisterende vegobjekt uten å lage en ny versjon. Denne varianten krever at bruker har
system-admin-rollen og er derfor ikke for "folk flest". Det er kun gjeldende versjon av et vegobjekt som kan korrigeres. Korrigering av en versjon som ikke er gjeldende blir avvist.

Utforming av korriger-elementet er ellers identisk med oppdater-elementet.

## Arbeidsflyt for en klient

Sekvensdiagrammer under angir hvordan en klient kommuniserer med APIet for å registrere, starte og innhente status for et endringssett:

![Sekvensdiagram](https://github.com/nvdb-vegdata/nvdb-utviklerkonferanse-2015/blob/master/6.%20Skrive%20data%20til%20NVDB/Sekvenser.png)

Når endringssettet er registrert (første anrop i diagrammet over), tildeles det en unik id (UUID) som inngår i URI'ene man benytter for videre samhandling om dette endringssettet.
Polling på fremdrift kan opphøre når endringssettet har nådd en terminaltilstand. 

## Behandlingstilstander

Et endringssett under behandling vil ha ulike tilstander eller fremdriftsstatuser underveis. Det er denne fremdriftsstatusen man får som respons ved anrop til /nvdb/apiskriv/v2/{id}/fremdrift.

![Tilstandsdiagram](https://github.com/nvdb-vegdata/nvdb-utviklerkonferanse-2015/blob/master/6.%20Skrive%20data%20til%20NVDB/Tilstander.png)

| Tilstand      | Trigger        | Kommentar      |
|---------------|----------------|----------------|
| IKKE_STARTET  | Mottak av endringssett | Endringssettet er mottatt, men ikke behandlingen er ikke startet. Det kan fortsatt endres. |
| KANSELLERT    | /kanseller anropt | Endringssettet er mottatt, men behandlingen ble kansellert av eier. |
| BEHANDLES     | /start eller /restart anropt | Behandlingen av endringssettet er startet. Endringssettet kontrolleres mot datakatalogen og eksisterende objekter i NVDB. |
| VENTER        | Låsekonflikt/datakatalogoppdatering | Behandlingen av endringssettet er stanset og venter på å kunne starte igjen. |
| AVVIST        | Valideringsfeil eller manglende autoriasjon | Endringssettet er avvist. Det vil ikke bli fullført. |
| UTFØRT        | Fullført behandling uten feil eller konflikter | Endringssettet er ferdig behandlet og alle vegobjekter er lagret i NVDB. |
