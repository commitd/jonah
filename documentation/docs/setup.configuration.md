---
title: Configuration
---

There are numerous configuration properties which tailor the application to the environment. 

## External URL

If you are hosting the Ketos application on a domain such as `ketos.example.com` you should set the `serverUrl` configuration field:

```
invest:
  config:
    serverUrl: http://ketos.example.com
```

## Configuration of data and major functionality

You can enable and disable certain plugins, specifically authentication and audit, using Spring profiles. These are discussed in [Authentication](setup.authentication.html) and [Audit](setup.audit.html).

## Branding and general UI configuration

You can control the branding on the UI, eg the title bar, using: 

```
ketos:
    config:
        title: My title
```

You can also override the text banner on the server using standard Spring Boot configuration settings discussed below.

Where you have application wide settings  provide these using the `invest.config.settings`. These are typically used only by reuseable components, such as the map view: 

```yaml
invest:
  config:
    settings: 
       ketos_map_url:  "http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
       ketos_map_attribution: "@copy; OpenCycleMap, OSM contributors"
```


If you have additional UI plugins, outside the `/ui` directory you can configure this directly:

```yaml
invest:
  ui:
    host: 
      roots: 
        - ../another-plugin/
        - ../in-development-plugin/build 
```

If you wish to control the order of plugins in the UI, then do so by listing the order under `invest.ui.plugins`. Any plugins which are configured, but not listed will appear at the bottom.


```yaml
invest:
  ui:
   plugins:
   - ketos-ui-documentsearch
```

Normally the outer application is bundled as part of the JAR, but you can override this if you have a newer build:

```yaml
invest:
  app:
    directory: ../vessel-js/apps/invest-app/build
```

If you have additional plugins which are not located in the `/ui` subdirectory (for example you are working on a development pluing) you can import it direct from its development build directory using the `invest.ui.hosts.roots`:

```
invest:
  ui:
    host: 
      roots: 
        - ../ketos-js/packages/ketos-ui-corpuslist/build/
        - ../ketos-js/packages/ketos-ui-corpussummary/build/
        - ../ketos-js/packages/ketos-ui-metadataexplorer/build/
```
This is an excellent way of including a set of in-development plugins which you can rebuild, but still access in the application as if they were release plugins.


## Plugin configuration

A plugin might have its own specific configuration. These will be documented along with the plugin as part of a README or within the source code (for example Javadoc).

In the case of UI plugins the default configuration is derived from the `invest.json` file, which will be stored alongside the plugin itself. 

If you wish to override the invest.json you can edit it directly (though you risk accidently overwriting this when you upgrade the plugin) using the `application.yaml`:

```yaml
invest:
  ui:
    host:    
      override: 
        - id: ketos-ui-corpuslist
          settings:
            # Example only - this settings does not exist! 
            maxPerPage: 10
```
 


## Spring configuration

The `application.yaml` is a consolidated configuration file from Spring, so it not only allows configuration of Ketos functionality but also also the underpinning Spring Boot framework.

**Use the data configuration above, rather than any Spring data configuration - it is not used by Ketos and thus any Spring Data settings will likely be have no effect .** 

Common Spring Boot settings are listed in the [reference documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html).

The majority of these settings are very low level but a few important settings are:


```yaml
# Use server.port to change the port from the default 8080 
server:
    port: 9090

# Port for management information 
management:
    server.port: 10080

# Enable debug logging
debug: true

# Logging
lgging:
    local:
        # Enable debug logging for a specific Java package tree,
        # such as Spring
        org.springframework: DEBUG
        # or ketos
        io.committed.ketos: DEBUG
        # or invest
        io.committed.invest: DEBUG
```