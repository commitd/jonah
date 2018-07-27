---
title: GraphQL Usage
---

The interface between UI and server is [GraphQL](http://graphql.org/).

Our use of GraphQL serves two purposes: 

* It allows us to extend functionality with server plugins adding additonal fields into the schema
* UI components can query for only the information they need which reduces the volume of data which could be provided as server side functionality increases 

The best way to understand Ketos' GraphQL is through the [GraphiQL](https://github.com/graphql/graphiql) developer view, which provides a live query interface.  

To illustrate Ketos' GraphQL features we include a number of example queries. These give a flavour of how to create queries and hence how to create UI plugins which take advantage of that data.

## Example of Ketos GraphQL

The schema root is at corpus level, a dataset. You can get information about a single corpus (by id):

```graphql
query {
  corpus(id:"news") {
    countDocuments
  }
}
```

Or for all corpora, which is useful for building tables or generally aggregated results and discovering what is available in Ketos:

```graphql
query {
  corpora {
   id
    name
    description
    countDocuments
  }
}
```

Whilst looking at GraphQL features you can rename your fields, which is useful if you want to return the same information multiple times:

```graphql
query {
  news_corpus: corpus(id:"news") {
    countDocuments
  }
  wiki_corpus: corpus(id:"wiki") {
    countDocuments
  }
}
```

From a specific corpus you can select a mention, document, entity, or relation by its id:

```graphql
query {
  corpus(id:"news") {
    entity(id:"1234"){
      id
      value
      type
    }
  }
}
```

Ketos attempts to standardised output from Baleen, so often you'll see commonality: for example mentions and relations both have `type`, `subtype`, `value`, `properties`, `begin`, `end`. Entities have `type`, `subtype`, `value`, `properties` too.

Whilst the database stores data in a denormalised way (entities have a docId field for example), Ketos normalises documents, and provides helper functions to some (or all) parts of each document. Therefore you can look up entities by document or documents by entity very easily:


```graphql
query {
  corpus(id:"news") {
    entity(id:"1234") {
        document {
            id
            info {
                title
            }
        }
    }

    document(id:"abcd") {
        entities {
            id
            type
            value
        }
    }
  }
}
```

You can query by probing for data, where `probe` is a subset of the fields. This is powerful for looking up say entities by type and value, or looking for say relations which have the a specific mention:

```graphql
query {
  corpus(id:"news") {
    entities(probe: {
        type: "Location"
        value: "United States"
    }) {
        id
        docId
    }
  }
}
```


There are search functions which provide more power than probe matches. For example, we can look up documents which have a specific entity within them, as well as by attributes of the document:

```graphql
{
  corpus(id: "news") {
    searchDocuments(query: {content: "poverty"}, entities: [{type: "Location"}]) {
      hits {
        total
        # This are document results
        results {
          id
          info {
            title
          }
        }
      }
    }
  }
}
```

We can also paginate through the results aboue, as the hits object supports offset and size:


```graphql
{
  corpus(id: "news") {
    searchDocuments(query: {content: "poverty"}, entities: [{type: "Location"}]) {
      # Page 2...
      hits(offset:10, size:10) {
        total
        # This are document results
        ... as before
      }
    }
  }
}
```

We can do more, for example using the same query to perform the same search but then counting the values of properties to see how documents are distributed:

```graphql
{
  corpus(id: "news") {
    searchDocuments(query: {content: "poverty"}, entities: [{type: "Location"}]) {
      countByField(field:"properties.classification") {
        bins {
          count
          term
        }
      }
    }
  }
}
```

We can also run similar aggregation counts over the entire corpus, without filtering:

```graphql
{
  corpus(id: "news") {
    countByMentionField(field:"properties.type") {
      bins {
        count
        term
      }
    }
  }
}
```

Through combinations of these we can build quite complex queries. For example, search for all documents containing "UK", take mentions of a Person called 'Prime Minister" within them and then find all the related entities where Prime Minister is the source of that relation.

```graphql
{
  corpus(id: "news") {
   	# Do search
    searchDocuments(query:{
      content:"UK"
    }) {
      hits {
        results {
          # Filter entities within the search
          entities(probe:{
            type:"Person",
            value:"Prime Minister"
          }) {
            mentions {
              # Find relations for which have a source at that entity
              sourceOf {
                # Find the target of that relation
                target {
                  type
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
```




## GraphQL SPQR and Java

[GraphQL SPQR](https://github.com/leangen/graphql-spqr) is the GraphQL framework used by Ketos to resolve queries.  

What appeals to to us about the SPQR framework is the ability to take an object returned fom another GraphQL function and extend it in a natural way. We'll use an example.

We return a `BaleenDocument` in many places in GraphQL, for example as a search result. The code might look like this:

```java
@GraphQlQuery(name='simpleSearch') 
public List<BaleenDocument> search(@GraphQlArgument(name="query") String query) {
    // ...
}  
```

A GraphQL query to get back matching content would look like:

```graphql
query {
    simpleSearch(query:"UK") {
        id
        content
    }
}
```

The BaleenDocument consists of a list of metadata, but perhaps a plugin does not need a list, but just a count. The plugin could request all the metadata and count itself: 

```graphql
query {
    simpleSearch(query:"UK") {
        id
        content
        metadata {
            key
            value
        }
    }
}
```

But this is wasteful. It would be better if the BaleenDocument has a `metadataSize` on it. With SPQR we can easily extend the document to include that, as a plugin that is only known at runtime:


```java
@GraphQLService 
public class ExtendDocumentWithMetadataCount {

    @GraphQlQuery(name='metadataSize') 
    public int metadataSize(@GraphQLContext BaleenDocument doc) {
        return doc.getMetadata().size();
    }  
}
```

Then, with a GraphQL query:

```graphql
query {
    simpleSearch(query:"UK") {
        id
        content
        metadataSize
    }
}
```

It is worth noting that this metadataSize is now available whenever we query for BaleenDocuments - not just our simpleSearch query.


With GraphQL we can grow this functionality over time without breaking backwards compatibility. Metadata keys can be duplicated, and perhaps we want to display the number of unique metdata keys, not the toal number. We can add an argument for that (with a default value which preserves the above query). 

```java
@GraphQLService 
public class ExtendDocumentWithMetadataCount {

    @GraphQlQuery(name='metadataSize') 
    public int metadataSize(@GraphQLContext BaleenDocument doc, 
            @GraphQLArgument(name="unique" defaultValue="false") boolean unique) {
        
        if(unique) {
            return doc.getMetadata().stream().map(BaleenDocumentMetadata::getKey).distinct().count();
        } else {
            return doc.getMetadata().size();
        }
    }  
}
```

This is a simple example, but we note that `@GraphQLService` classes are in fact full Spring Service beans which have complex autowired dependencies and perform general actions, such as calling out to a third party web service. This could be used to integrate machine translation for document content or address geocoding for Locations. GraphQL provides a natural place to fuse this type of disparate services. However from the UI's perspective it is dealing with a single consistent API.
