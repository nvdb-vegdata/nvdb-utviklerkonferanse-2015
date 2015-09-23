# Overblikk over NVDB API Skriv

Denne presentasjonen krever kjennskap til NVDBs datamodell inkludert metadata som beskrevet i datakatalogen.

## Hovedprinsipper

NVDB API Skriv har følgende kjennetegn:

* Basert på REST-prinsipper
* Støtter både XML og JSON
* Asynkront, status innhentes ved polling
* Tilbyr CRUD-operasjoner på vegobjekter via endringssett

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
  * Registrer: startdato
  * Oppdater: sluttdato/startdato
  * Slett: sluttdato
  * Korriger: n/a
  
  