---
title: Setting up data
---

Primary reason for changing the configuration in Ketos is to specify data sources. An example configuration is shown below:

```yaml
ketos:
  core:
    mongo: 
      - id: news_mongo
        datasource: rss
        name: News Mongo
        description: News dataset in Mongo
        edittable: true
        db: baleen_news
      - id: enron_mongo
        datasource: enron
        name: Enron emails
        description: An example email dataset in Mongo 
        edittable: true
        db: baleen_enron        
    elasticsearch: 
      - id: news_es
        datasource: rss
        name: News ES
        description: News dataset in ES
        edittable: false
        host: localhost
        index: baleen_news
    feedback:
      id: feedback
```

Breaking this up, we have `ketos.core` under which are `mongo`, `elasticsearch` and `feedback` nodes. 

The Mongo and Elasticsearch sections define the datasets available to Ketos. They take the same generic form:

Field | Default | Description
--- | --- | --- 
id | | A unique name within the application for this dataset.  
name | | A friendly name to display the user within the UI
description | empty | A short description (sentence or so) which helps the under understand the content of the dataset
datasource | | A identifier for the originating source of the data. This is used by Ketos to limit results to a single datasource but also to avoid returning results in multiple datasets which are from the same original datasource. See comment below. 
edittable | false | Should the content in this dataset be open to modification by Ketos users (delete / edit) 

Mongo has the following additionally configuration items:


Field | Default | Description
--- | --- | --- 
host | localhost | The host server or IP to connect to 
port | 27017 | The port on which to connect
db | baleen | The name of the database in which Baleen output is to be found
documents | documents | The Mongo collection within the database containing documents 
entities | entities |   The Mongo collection within the database containing entities 
relations | relations |  The Mongo collection within the database containing relations 
mentions | mentions |  The Mongo collection within the database containing mentions 

Elasticsearch has the following additional configuration items: 

Field | Default | Description
--- | --- | --- 
host | localhost | The host server or IP to connect to 
port | 9300 | The port on which to connect
cluster | elasticsearch | The ES cluster to join
index | baleen | The name of the index in which Baleen output is to be found
documents | documents | The type within the index for documents 
entities | entities |   The type within the index for  entities 
relations | relations |  The type within the index for  relations 
mentions | mentions |  The type within the index for  mentions 


In order to 'do something' a Ketos application will require at least one Mongo or Elasticsearch dataset. It is permissible to have multiple datasets, being a all Mongo, all Elasticsearch or a mix of both. The use of `datasource` is described in more detail [Developer guide](dev.data.html) but in summary it is important to understand what happens when you have multiple datasets.

Actual behaviour with datasets is determined by individual plugins, however the following generally applies:

* Each dataset is offered to the user to be queried separately. The user will normally specify which dataset they wish a query to target.
* If we have mulitple datasets which are stated as having the same datasource then, normally, only one is selected to run a query against. This is because if we have two datasets which contain the same data, searching both of them would return the same results. More over it is very difficult to determine the ordering of results between different database types.
* As noted, the plugin can select to override these or even to request a particular type of database run a query. 

Feedback defines a place for recording user comments (bug reports, feature requests) in the tool. It has limited configuration but as it is a Mongo backed dataset you can set its server and post information.

Field | Default | Description
--- | --- | --- 
host | localhost | The host server or IP to connect to 
port | 27017 | The port on which to connect
db | ketos_feedback | The name of the database in which a 'feedback' collection will be created

