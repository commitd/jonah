---
title: Audit
---

To provide some insight into the use of the system, Ketos records API usage as an audit.

There are three audit implementations:

* `audit-none`: Do not output any audit information
* `audit-slf4j`: Output audit information via the logging framework. 

The `audit-slf4j` supports use-cases where a log aggregator is used to pull logging and transform the audit information, for example using the ELK stack. 

## Extension

The basic audit implementation is illustration of functionality. When pulling into a specific audit requirement a new logging implementation can be created and installed under its own profile.  
 