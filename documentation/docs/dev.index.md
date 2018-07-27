---
id: dev.index
title: Developing Ketos
---

Ketos is built on [Invest](http://committed.bitbucket.io/invest). The Invest documentation itself contains a developer guide which covers many of the fundamental building blocks applicable to Ketos.

As noted in the Invest documentation, developers of Ketos plugins will need to understand React, Typescript, GraphQL on the UI side and Java and Spring on the server side. 

This document is a Ketos (ie text focused) view of the development under the Invest framework. 

Ketos is designed primarily to view the outputs of the Baleen framework, so it is good to have an understanding of what Baleen does and what it can output. Knowing how Baleen functions will help a developer understand some of the concepts in Ketos.

The key area to understand is the [data](use.data.html) which ketos exposes from Baleen. As a developer of visualisations or query functionality some important points to note are:

* Baleen processing is on a document by document basis. Thus the majority of basic pipelines will not *make connections* between documents.
* Baleen pipelines can process a variety of sources from databases, spreadsheet or documents. The plain text representation of these which is processed can be quite different to the originating document.
* Many of Baleen processors are model driven. These may miss annotations, produce incorrect annotations, or misclassify an annotation (eg Organisation as a Location). 

Our suggestion for Ketos is not use it to *work around* issues in Baleen's output. It is quite easy to start righting UI or server code in ketos which attempts to 'fix up' mistakes or misconfiguration of Baleen. The right place for such fixes is the Baleen codebase as this will improve the quality of extraction for all tools, such just Ketos. 
