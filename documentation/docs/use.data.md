---
title: Data types
---

It is important to understand the types of data available in Ketos. 

These are derived from the types that Baleen generates.

Broadly there are four types of data:

* Documents - typically a file, email or other textual data item
* Mention - a span of text within a document which refers to something considered important within the domain (eg an email address or date)
* Entity - one or more mentions which baleen has deemed to be the same item (eg Mr J Smith, John Smith, John, Him)
* Relation - an association between two mentions (John - went to - London).

Documents contain:

* Metadata - a list of keys and their values (title: "A Great Escape"). The key may appear several times for example Author: Chris, Author: Stuart. These are derived from the content of the document and are very freeform. It is possible, and likely, one document has a key that another does not. Different foramts (Word, PDF, etc) will have different metadata. 
* Properties - a set of key values pairs about the document. Typically this is information such as its source URL, timestampe, etc. These are fairly standardised as they are manage by Baleen's Document Annotation. 
 

The mentions, entity and relation have types and subtypes. For mention and entity types this is one of:

* Person
* Temporal (date, time, or range)
* Location
* Coordinate
* Vehicle
* MilitaryPlatform (in effect a vehicle such as a submarine)
* Weapon
* CommsIdentifier (phone, email)
* Buzzword (in effect a keyword or domain specific term)
* Organisation

All subtypes of these entity types are freeform. They can take any value or nor and are used to clarify the meaning further. All relation types are freeform.

Mentions, entities and relations also have properties. For mentions and entities these vary greatly depending on the type of mention or entity. For example, a Person entity has a gender and title (mr/mrs/dr). 

An entity's properties can be thought of, and indeed are, a merge of all the mention's properties that it groups. For a person, if one mention has a gender and another doesn't, the entity will be given a gender. It is up to Baleen how to allocate properties and values to entities, given each entities mentions and surrounding context.