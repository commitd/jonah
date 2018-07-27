---
title: Installation
---

As we've seen in the [Quick start](setup.quickstart.html) *installing* Ketos can be as simple a extracting the release to directory and running. However there are some additional options open to you.

It is recommended in a production environment you install ketos into the `/opt/ketos` directory. This is a good convention for non-packaged files.

A typical Ketos deployment sits within a directory structure of:

```
/ketos
    # A simple runner script
    run.sh 
    # The Ketos application jar
    ketos.jar  
    # Ketos and Spring gonfiguration
    application.yaml
    #
    /ui
        # Directory of UI plugins
    /plugins
        # Directory of JAR server plugins
```

In addition to the [configuration](setup.configuration.html), one way to configure a Ketos deployment is to add or remove plugins from the `/ui` and `/plugins` directories. 

Removing `/ui` plugins will remove them from the application sidebar, on restart. As long as you retain the functionality you want in the application this is a safe operation. This means it will not cause other functionality to crash or the application to fail to load. However we aware that if you remove the DocumentReader then the user will not be able to access it at all - including links in another plugin. The link will simply not appear (or be disabled).

Removing server plugins should be safe, though will result in loss of major functionality - for example, prevening you from access to an algorithm. This might have a knock on impact on UI plugins. In the case of the release version of Ketos the only server pluigns can you reasonably remove is one of the Mongo or Elasticseach plugins. This will prevent you from configuring it as a data source though.

Adding UI and server plugins should also be a safe operation. However we are aware that on the server side the developer may not have intended for two plugins to co exist. If you have an 'Elasticsearch plugin' and a 'Better Elasticsearch Plugin' then the latter might be seen as a replacement. Refer to plugin documentation to see whether this is the case. 


## Running as a service

You can install Ketos as a service on Linux so that it will start on boot.

First create a user `ketosuser` which is the username that the service will run as. You should given this user ownership of `ketos.jar` and associated files:

```bash
sudo chown ketosuser -R /path/to/ketos  
```  

With init.d based system, simply use the commands:

```bash
# Setup the server
sudo ln -s /path/to/ketos.jar /etc/init.d/ketos

# Start the service
service ketos start

# Note commands to run on boot up are operating system dependent, for example on Debian/Ubuntu
update-rc.d ketos defaults
``` 

For a new systemd based system create a file, called `ketos.service` in `/etc/systemd/system`:

```ini
[Unit]
Description=Ketos
After=syslog.target

[Service]
User=ketosuser
ExecStart=/path/to/ketos/ketos.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

You should now we able to control the service with

```bash
# Start the service now
systemctl start ketos.server

# Start on the service on boot
systemctl stop ketos.server
```

To do this Ketos takes advantage of Spring's launcher, which you can [read more](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html) about, and how to configure aspects such as memory usage differently to the Java defaults.

**You should refer to this document regarding securing the service.**
