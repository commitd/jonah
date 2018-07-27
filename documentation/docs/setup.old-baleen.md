---
title: Older Baleen outputs
---

Older Baleens versions (pre 2.6) do not contain the dedicated consumers to output to the required Ketos formats.

However you can convert the Baleen output to the new format through aggregations.

For example, this aggregation will convert from the `relations` collection output by the `Mongo` consumer of Baleen 2.4 to a `full_relations` collection compatiable version.

```js
db.relations.aggregate([
     { $match: { "externalId": "db7aeace0bf3c363ecd3f0c8a1f38419d714c34fa286f6e3e83f934d6fd6619f" } },

    {
      $lookup:
         {
           from: "entities",
           let: { doc_id: "$docId", mentionId: "$source" },
           as: "sourceMentions",
           pipeline: [
           // Join on entities which have the same document and matching mentionId
             { $match:
                 { $expr:
                    { $and:
                       [
                         { $eq: [ "$docId",  "$$doc_id" ] },
                         { $filter: { input: "$entities", cond: { $eq: ["$externalId",  "$$mentionId" ] } } },
                       ]
                    }
                 }
              },
              // Convert entities to mentions... could be just an entities.arrayEl
             { $unwind: "$entities" },
             { $project:
                 { 
                     "value": "$entities.value",
                     "type": "$entities.type"
                 }
              }
           ]
        }
    },
    //Exact copy of above look up with source->target and sourceMentions->targetMentions
        {
      $lookup:
         {
           from: "entities",
           let: { doc_id: "$docId", mentionId: "$target" },
           as: "targetMentions",
           pipeline: [
             { $match:
                 { $expr:
                    { $and:
                       [
                         { $eq: [ "$docId",  "$$doc_id" ] },
                         { $filter: { input: "$entities", cond: { $eq: ["$externalId",  "$$mentionId" ] } } },

                       ]
                    }
                 }
              },
             { $unwind: "$entities" },
              { $project:
                 { 
                     "value": "$entities.value",
                     "type": "$entities.type"
                 }
              }
           ]
        }
    },
    { $addFields:
         { 
              "sourceMention": { $arrayElemAt: ["$sourceMentions", 0] },
              "targetMention": { $arrayElemAt: ["$targetMentions", 0] },
         }
      },
      { $addFields:
         { 
              "sourceId": "$source",
              "targetId": "$target",
              "sourceValue": "$sourceMention.value",
              "sourceType": "$sourceMention.type",
              "targetValue": "$targetMention.value",
              "targetType": "$targetMention.type",
         }
      },
      { 
          $project: {
                "sourceMention": false,
                "source": false,
                "sourceMentions": false,
                "targetMention": false,
                "target": false,
                "targetMentions": false
          }
      },
    {$out: 'full_relations'}  
])
```