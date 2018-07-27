---
title: Troubleshooting
---

# Start point


When Ketos starts successfully, a message in the console will be displayed after about 15 seconds, saying it is `Running on http://0.0.0.0:8080`

If you do not see this message, or you see a Java exception or other error  before that message, it is likely your configuration or installation is not correct.
 
The estimation of 15 seconds is based on running on a reasonable development laptop or server. If you have a lot of plugins, datasets or generally less performant hardware this may be longer (possibly in the order of minutes).

## Port already in use

Error about port 8080 already in use? Check if running another web site on port 8080, or another version of ketos. To configure the port add the following to your ketos configuration file:

```yaml
server:
  port: 8090
```

# If the server has no errors... 

Open a web browser an navigate to http://localhost:8080.

Try visiting Corpus List to see the document has documents. Then click Corpus Summary to see if there is other information. Then try Document Search (note in the demo this is backed by Mongo and query syntax which is very limited).

## Mongo errors

Ensure that Mongo is running on the specified server and port, which defaults to port `27107`. 

Ensure that the verison of Mongo is at least `3.4.4`.

Ensure you can connect and log into the server using the `mongo` command from the same server.

## Elasticsearch errors

Check that Elasticsearch is running, and its cluster name is as per the Ketos configuration.

If you have any issues with mapping, this could be because some automatic mapping generation has incorrectly decided the type. This probably requires manually resetting the mapping and reindexing. 
