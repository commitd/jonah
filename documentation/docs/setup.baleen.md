---
title: Baleen 2.6
---

This section expands on the Quick Start section, with a more complex Baleen pipeline and some other instructions in the use of Baleen.

## Setup 

Download Baleen 2.6 from the [releases pages](https://github.com/dstl/baleen/releases) of GitHub. 

Before starting Baleen, you should already have installed and running Elasticsearch and Mongo. Elasticsearch in particularly is strict in its versioning: Baleen 2.6 supports Elasticsearch 5.6.



## Configuration

A more involved Baleen configuration, as compared to that in the Quick Start, is shown below. 

In the same directory your baleen.jar create a runner file, `baleen.yaml`:

```yaml
pipelines:
  - name: Ketos
    file: ketos-pipeline.yaml
    
logging:
  loggers:
    - name: console
      minLevel: INFO
```

Now create a Baleen pipeline file, called `ketos-pipeline.yaml`. An example Baleen pipeline, outputting to Elasticsearch and Mongo, would be:

```yaml
elasticsearch:
  cluster: elasticsearch
  host: localhost

mongo:
  host: localhost
  index: baleen

orderer: DependencyGraph

collectionreader:
  class: FolderReader
  # Change this to point to your data
  folders: ./input
  contentExtractor: StructureContentExtractor

history:
  class: uk.gov.dstl.baleen.core.history.noop.NoopBaleenHistory

annotators:
  # Optionally add specific file backed gazetteers for known entities:
  # - class: gazetteer.File
  #   type: Person
  #   fileName: data/person.txt        
  - cleaners.AddGenderToPerson
  - cleaners.AddTitleToPerson
  - cleaners.CleanPunctuation
  - cleaners.CleanTemporal
  - cleaners.CorefBrackets
  - cleaners.CorefCapitalisationAndApostrophe
  - cleaners.CurrencyDetection
  - cleaners.EntityInitials
  - cleaners.MergeAdjacent
  - cleaners.MergeAdjacentQuantities
  - cleaners.MergeNationalityIntoEntity
  - cleaners.NaiveMergeRelations
  - cleaners.NormalizeOSGB
  - cleaners.NormalizeTemporal
  - cleaners.NormalizeWhitespace
  - cleaners.ReferentToEntity
  - cleaners.RelationTypeFilter
  - cleaners.RemoveLowConfidenceEntities
  - cleaners.RemoveNestedEntities
  - cleaners.RemoveNestedLocations
  - cleaners.RemoveOverlappingEntities
  - cleaners.SplitBrackets
  - cleaners.Surname
  - coreference.SieveCoreference
  - gazetteer.Country
  - grammatical.NPAtCoordinate
  - grammatical.NPElement
  - grammatical.NPLocation
  - grammatical.NPOrganisation
  - grammatical.NPTitleEntity
  - grammatical.QuantityNPEntity
  - grammatical.TOLocationEntity
  - language.OpenNLP
  - misc.GenericMilitaryPlatform
  - misc.GenericVehicle
  - misc.GenericWeapon
  - misc.MentionedAgain
  - misc.NationalityToLocation
  - class: misc.OrganisationPersonRole
    type: organisationRole
  - misc.People
  # Having pronouns if goog 
  # misc.Pronouns
  - regex.Area
  - regex.BritishArmyUnits
  - regex.Callsign
  - regex.CasRegistryNumber
  - regex.Date
  - regex.DateTime
  - regex.Distance
  - regex.DocumentNumber
  - regex.Dtg
  - regex.Email
  - regex.FlightNumber
  - regex.Frequency
  - regex.Hms
  - regex.IpV4
  - regex.LatLon
  - regex.Mgrs
  - regex.Money
  - regex.Nationality
  - regex.Osgb
  - regex.Postcode
  - regex.RelativeDate
  - regex.SocialMediaUsername
  - regex.TaskForce
  - regex.Telephone
  - regex.Time
  - regex.TimeQuantity
  - regex.USTelephone
  - regex.UnqualifiedDate
  - regex.Url
  - regex.Volume
  - regex.Weight
  - stats.DocumentLanguage
  - class: stats.OpenNLP
    model: ../models/en-ner-location.bin
    type: Location
  - class: stats.OpenNLP
    model: ../models/en-ner-organization.bin
    type: Organisation
  - class: stats.OpenNLP
    model: ../models/en-ner-person.bin
    type: Person 
  - class: relations.DependencyRelationshipAnnotator
    type: dependencyRelationship
  - class: relations.NPVNP
    onlyExisting: true
    type: npvnp
  - class: relations.SimpleInteraction
    type: interaction
  - class: relations.RegExRelationshipAnnotator
    pattern: "(:Person:).*(visit\\w*|went to).*(:Location:)"
    sourceGroup: 1
    valueGroup: 2
    targetGroup: 3
    type: locatedAt
  - class: relations.RegExRelationshipAnnotator
    pattern: "(:Person:).*(:Person:)"
    type: associated
  - class: relations.RegExRelationshipAnnotator
    pattern: "(:Person:)\\s+<(:CommsIdentifier:)>"
    type: hasCommsIdentifier
  - class: relations.RegExRelationshipAnnotator
    pattern: "(:Person:)\\s+(:CommsIdentifier:)"
    type: hasCommsIdentifier
  - class: relations.RegExRelationshipAnnotator
    pattern: "(:Person:)\\s+:(:CommsIdentifier:)"
    type: hasCommsIdentifier
  - class: relations.PartOfSpeechRelationshipAnnotator
    pattern: "(NNP).*(VBD).*(NNP)"
    sourceGroup: 1
    valueGroup: 2
    targetGroup: 3
    type: pos
  - class: relations.PartOfSpeechRelationshipAnnotator
    pattern: "the (.+) of ((?:NNP ?)+) is ((?:NNP ?)+)"
    stopWords: 
      - the
      - of
      - is
    sourceGroup: 2
    valueGroup: 1
    targetGroup: 3
    type: pos
  - triage.RakeKeywords
  
consumers:
  - class: analysis.Elasticsearch
    index: baleen
  - analysis.Mongo

  ```

The above configuration uses `./input` as a source directory. Change this to the appropriate path (absolute or relative). Similarly the 

The above configuration refers to a OpenNLP models, which is available from [OpenNLP directly](http://opennlp.sourceforge.net/models-1.5/). Ensure you have downloaded this and change the path in the configuration to their location on disk.

The [Baleen WIki](https://github.com/dstl/baleen/wiki) contains further information on configuration. Baleen is extensively documented through Javadoc on the source code, which remains the authoritative source of information on its use.

## Running Baleen on the command line

Now run Baleen with:

```
java -jar baleen.jar runner.yaml
```

Baleen as a (developer focussed) UI which is available on http://localhost:6413/.

## Running Baleen in production

Running Baleen in production is beyond the scope of this guide, though we offer considerations.  

There are two likely use-cases for ingest into Ketos via Baleen:

* One of ingestion of a corpus for analysis
* Ongoing ingestion

Ketos is agnostic to these use cases, it merely queries the documents which are in the databases. Baleen has a focus on continual processing though obviously it can be stopped when data is exhausted.  For example, the FolderReader will monitor for changes or addition of new files in specified directories, continually processing information as new files become available.

Where care should be taken is when Baleen is restarted (either as a result of a crash or perhaps a machine reboot). In general Baleen is not stateful, therefore in the FolderReader case it will begin to reprocess the files with the folder. In a production server, vs a development context, this is likely to be undesirable, and often the FolderReader is combined with the MoveSourceFile consumer which moves the file, once processed, out of the 'input directory' and into another 'done directory'. More sophisticated implementions might use a message queue to feed Baleen with documents. 

Memory usage and monitoring are important with automated pipelines, including with Baleen. Large documents or complex documents, eg PDFs which span 100s of pages, can 'clog' the pipeline causing long pauses. It is often sensible to triage or prioritise documents so that the most important documents are processed first, leaving any large but unimportant documents until later. 

Baleen has, through its transport system, ways in which to vertically and horizontally scale pipelines. We'd also recommend that pipeline developers review the perfomance of the pipeline overall and the specific annotators on typical documents.     

In terms of improvements in output quality, a simple recommendation is to start to buid up file based gazetteers for entities which have been missed (see commented out File gazetteer above). These are very simple to achieve and often easy to build by reading a few documents. The process of entity extraction is iterative, and so processing a few file, reviewing the output in Ketos, before amending the pipeline and processing a new batch is a good way to improve overall results. The same is true for relation and event extraction algorithms.  

From a security perspective Baleen has an open HTTP API. Whilst it can be configured with basic security, it is designed to be run insite a protected network, for example behind a firewall.