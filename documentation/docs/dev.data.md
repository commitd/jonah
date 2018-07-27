---
title: Data types in Ketos
---

As noted in section on [data within Ketos](use.data.html) we have four categories of data:

* Documents
* Entities
* Mentions
* Relations

The structure of these is defined by the Baleen consumers, specifically the `uk.gov.dstl.baleen.consumers.analysis.*` consumers which output the format read by Ketos. 

To work with Baleen's output databases, Ketos maps these directly to a set of POJO classes which can be found in the `io.committed.ketos.common.baleenconsumer` package of `ketos-common`.      

To transfer to the client via GraphQL, and for general use within Ketos, these are mapped to other POJOs under the `io.committed.ketos.common` package of `ketos-common`. The content of these is largely the same in structure and naming to the Baleen outputs but they have additional annotations which support the GraphQL schema generation. 

## Ketos Data Providers

As the name suggests, Data providers offer a means to access data held in databases outside Ketos. 


Ketos has a number of DataProvider interfaces which map to the common types, defined in `io.committed.ketos.common.providers.baleen`:

* DocumentDataProvider
* EntityDataProvider
* RelationDataProvider
* MentionDataProvider
* MetadataDataProvider

These are implemented from Elasticsearch and Mongo backed Baleen databases, outputs from Baleen. 

Note there is no issue in creating new DataProviders for other data sources or queries, or indeed different implementations of existing DataProviders. 

## Using data providers in GraphQL server plugins 

DataProviders are accessed through the `DataProviders` registry. This is a Spring service that can be injected in your code. 

Your Java code can be find the relevant DataProvider(s) using methods such as `DataProviders.find(providerClass)`.

From these functions you will be returned zero, one or more DataProviders which match your request. How you deal with this depends on the query. Typically you'll want to query all data providers and fuse their results together. This is vary naturally catered for by the the Reactive Flux class which is now supported with Spring Boot 2. 

```java
// providers may be empty or not
Flux<DocumentDataProvider> providers = dataProvidesr.get(DocumentDataProviders.class ,... );

// Flat map will call doSomething on each, and then join the results into a single 'stream'
Flux<Result> combined = providers.flatMap(provider -> {
    // Call doSomething on each provider
    
    return provider.doSomething()
});

// Just take the first 10
return combined.take(10);
```


