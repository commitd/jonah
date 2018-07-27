---
title: Setup a development environment

---


## Software 

Ketos combines server and web development. Realistically you should setup both environments, even if you intend to develop for only one.

For the server components you should install: 

* Java 8 or above. We'd recommend the [Oracle Java Development 9 or above](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 
* [Maven 3](http://maven.apache.org)

Maven requires access to a Maven repository which could be local cache or public Maven central.

You will want to install a Java IDE. We'd recommend [Spring Tool Suite 4](https://spring.io/tools4), or [IntelliK IDEA Community edition](https://www.jetbrains.com/idea). If you are mainly undertaking web development we've found Visual Studio Code combined with its Java plugins provide a reasonable level of support.

For Web development you should install:

* [yarn](http://yarnpkg.io)
* [lerna](https://lernajs.io/) which can be installed with `yarn global add lerna`  
* [Typedoc](http://typedoc.org/) to generate Typescript documentation (if required)

We'd recommend [Visual Studio Code](https://code.visualstudio.com/) as a TypeScript IDE.

You will also need a Git source control client. This is built into the various IDEs above, or you can use the commandline, or dedicated GUI such as [Sourcetree](https://www.sourcetreeapp.com/)  or [GitKraken](https://www.gitkraken.com/).

Finally you will want to install [Docusaurus](https://docusaurus.io) to create, edit and generate this guide. If you want to create a new docusaurus project follow the installation guide on their site, otherwise the script below is sufficient to install the docusaurus to maintain this site.  

## Cloning the source code

Clone the source code for Ketos using 

```
git clone git@bitbucket.org:committed/ketos.git
```

This will create a new directory with called `ketos`.

At this stage, assuming you have a fast internet connection, we'd recommend you pull all dependencies for the Web and Java code. To do this run

```
./setup-dev-env.sh
``` 

This may take a while to complete, depending on your connection speed. 

Once complete, if you are using a local version of Invest to development against run 

```
yarn link:invest
```

(if you don't know what Invest is, or you can't get a copy the Invest source on your system you can ignore this step!)


 You should be able to import this into your Web and Java IDEs.


## Building

It's probably worth performing a full build at this point, see [Building](dev.build.html) for more information. Once built, Ketos can be run from the build directory:
```
cd build
./run.sh
```

