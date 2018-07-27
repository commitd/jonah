---
title: Advanced
---

There are several ways to extend this tutorial now you have basic functionality in place.

An obvious direction is to write a complete implemention for `AgeGuesser`.

The second direction would be to improve the look, feel and function of the user interface application. An example of a functionality improvement would be to gather all people mentioned in the top 100 documents for a search term, and then plot their ages in order to produce some form of visualisation.

The other types of entity, eg location, could benefit from the additional of fields. For example, the area of a Location's GeoJson property.

You could turn the AgeGuesser into an Invest Service, which had multiple implementations. This would allow others to provide better implementations of your plugin. 

You could also encode the age estimation into a Baleen annotator. This would create a relation between a Person entity and a new Temporal entity type.

If you have an extensive amount of census data, you could expose this through Ketos by creating a data provider to access the database holding the information. The AgeGuesser service could call out to this in order to get information it needs. 
  