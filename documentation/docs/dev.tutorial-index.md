---
title: Basic tutorial
---

In this tutorial we'll work through the addition of some UI and server side functionality to Ketos through the creation of two plugins.

We'll build a toy plugin which attempts to guess the age of a person based on the name, inspired by the work at https://rhiever.github.io/name-age-calculator. We'll skip some of the implementation as its non Ketos specific. 

We'll need to build:

* A UI plugin which declares an entity.view action. Other plugins will be able to pass an entity to this plugin and it will display the age (if the entity is a person).
* A server component which will perform the calculation.

Since we want the server component to be reusable, we suggest in general you start with the GraphQL server aspect and then move on to the UI. 

