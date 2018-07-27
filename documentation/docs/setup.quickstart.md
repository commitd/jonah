---
title: Quick start
---

Having downloaded the Ketos application, getting started is easy. If you don't already have them, you should install [Java](https://www.java.com/en/), [MongoDB](https://www.mongodb.com/) and [Baleen](https://github.com/dstl/baleen). We'll assume these are all installed on the local machine and that MongoDB is already running.   

We also assume you have the following subdirectories:

* `data` some files (documents, HTML, text files). We'd recommend you start with less than 100, simply so it can be run through Baleen quickly.
* `ketos` the ketos applications (i.e. with ketos.jar in this directory)
* `baleen` the release version Baleen (i.e. with baleen.jar in this directory)

## Ingestion

We need to start by running Baleen over the data directory to process the files and output them to the Mongo database.

For this we need a Baleen pipeline file, which determines how files will be processed. Create a file in the `baleen` directory called `pipeline.yaml` as below:

```yaml
mongo:
  host: localhost
  index: baleen

orderer: DependencyGraph

collectionreader:
  class: FolderReader
  # Change this to point to your data if its not in ../data
  folders: ../data
  contentExtractor: StructureContentExtractor

annotators:
  - gazetteer.Country
  - misc.MentionedAgain
  - language.OpenNLP
  - misc.People
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
  - class: relations.NPVNP
    onlyExisting: true
    type: npvnp


consumers:
  - analysis.Mongo
 # If elasticsearch is also available locally
 #  - class: analysis.Elasticsearch
 #    index: baleen
``` 

This is a reasonably simple Balene pipeline which will use  pattern matching techniques to find items such as emails, URL, phones, countries, etc. It won't find people, organisations, etc which requires a more sophisticated languauge approaches. You can read more about Baleen configuration on the [Wiki](https://github.com/dstl/baleen/wiki) and in the [ingestion](setup.baleen.html) section. 

Ensuring that Mongo is running (on localhost) and the files to be processed in the the `data` directory, we are ready to run Baleen:

```
java -jar baleen.jar -p pipeline.yml
```

You should watch the console for errors, but after around 1 minute of setup Baleen should begin to process files.

If you want to quickly check that Baleen is outputting to Mongo, you can do so with a Mongo GUI, such as [RoboMongo Robo 3T](https://robomongo.org/) or using the Mongo CLI e.g.:

```json
> mongo
MongoDB shell version v3.4.0
connecting to: mongodb://127.0.0.1:27017
...
> show databases;
baleen          0.538GB
> use baleen;
switched to db baleen
> db.documents.count()
2867
> db.entities.count()
132823
> db.entitiies.findOne()
{
	"_id" : ObjectId("5a9e83a9aecd5525b11667ea"),
	"docId" : "36abfe285d2167867686fef2c515e67f54aaa22ccf7cc428a4135171af79b402",
	"externalId" : "5fdfb1e435ca4f396185ff84934c57dd607fc70787886f3268246f1b2dd7b081",
	"type" : "Location",
	"subType" : null,
	"value" : "1 Smith Street",
	"properties" : {
		"geoJson" : null,
		"isNormalised" : true,
		"confidence" : 0,
		"subType" : null,
		"type" : "Location",
		"value" : "1 Smith Street"
	},
	"mentionIds" : [
		"00ead898ad8f84c99233d289e1ef764ae53905b9ef012d611e7e89cc461c6b12"
	]
}

```

Press Ctrl+D to exit `mongo`. In the above 2867 is the number of Baleen documents in the database, and 132823 is the number of entities extracted from those documents. 

# Configuring Ketos

We can now configure ketos to use the Mongo database we have just created. Create a new, or edit an existing, `application.yaml` file in the `ketos` directory:


```yaml   
ketos:
  core:
    mongo: 
      - id: quickstart_mongo
        datasource: example
        name: Quick Start
        description: Quick Start Example 
        db: baleen 
```

# Running Ketos

Like Baleen, Ketos is run through Java from the `ketos` directory:

```
java -jar ketos.jar
```

After around 10-15 seconds the  Ketos UI should be available in your browser at `http://localhost:8080`.