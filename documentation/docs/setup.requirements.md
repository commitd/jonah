---
title: Requirements
---

Running Ketos requires:

* Java 8 or above (Oracle Java is strongly preferred).

Ketos is developed and tested on Mac OSX and Linux. 

In addition, you'll need installations of the supported databases: 

* Mongo (3.4.4 or above required)
* Elasticsearch (5.6 or above)

To load data into the databases into a format supported by Ketos, you'll need an installation of [Baleen](setup.baleen.html) minimum version 2.6.

## Installation of Java and databases

We recommend you install these dependencies using your operating systems package manager where possible, and using the guides on each vendors' website:

* Install [Mongo](https://docs.mongodb.com/manual/administration/install-community/)
* Install [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/install-elasticsearch.html)

For example, to install on Ubuntu with Oracle JDK 9:

```
# Install Java 9
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer

# Install Mongo 3.6
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo service mongod start

# Install Elasticsearch 5.6
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
sudo apt-get update 
sudo apt-get install elasticsearch
sudo service elasticsearch start
```

## Installation of Baleen
Final version of Baleen are available from [GitHub Releases](https://github.com/dstl/baleen/releases).

We recommend you install the latest version, and the minimum supported version is *2.6*.

See the [Baleen Wiki](https://github.com/dstl/baleen/wiki) for general Baleen documentation and configuration, but read more about [Ketos specific ingestion](setup.baleen.html).
