---
title: Docker
---

Though we do not offer a Docker container yet for Ketos

However it is trivial to create a custom variant by creating `Dockerfile` such as:

```dockerfile
FROM openjdk:8-jdk-alpine
VOLUME /tmp
COPY ketos/ /ketos/
WORKDIR /ketos
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","ketos.jar"]
```

Place the ketos release, including the required `application.yaml` in a subdirectory called `ketos` and then use the command:

```bash
docker image build -t ketos .
```


This will create a new Docker image called `ketos` which can be started using

```bash
docker run  -d --restart=always -p 8080:8080 ketos
```


Our reasoning behind not provide a Dockerfile at present is that:

* Ease of configuration (e.g. changing the branding), it is easier to package this yourself into a docker image and work with volumes for a single `application.yml`
* Plugins can be selected and packaged into a docker image
* Ketos has very few dependencies itself other than operating system and Java, which negates some benefits of containerisation if you are happy to run `bare metal`
* Ketos can be run as a service on the operating system with a single command
* Ketos has little state itself

## Docker compose

It is possible to run Baleen, Mongo, Elasticsearch and Ketos in a Docker compose environment. Again, this is reasonably straightforward, but will require configuration of both Baleen and Ketos for specific deployments. 




