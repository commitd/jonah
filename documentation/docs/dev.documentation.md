---
title: Updating documentation
---

This project documentation can be found under the `/documentation` directory in the repository. 

The documentation is written in Markdown using the Facebook's open source documentation site generator [Docusaurus](https://docusaurus.io/).

To build and host the documentation with the ability live-edit:

```
cd documentation/website
yarn start
```

The HTML generated site can be viewed in your browser at http://localhost:4010. Changes to the documentation are reflected when you refresh the browser. 

Docusaurus, at time of writing, only supports a flat folder structure for input files. These are held within `documentation/docs`. They are prefixed by `use.`, `dev.`, or `setup.` depending to which aspect of the site they relate.

The sidebar's are not automatically generated in Docusaurus, you must change the `sidebar.json` file in the `documentation/website` folder. Note the sidebar will not be updated until you stop and then rerun the `yarn start` command as above. 

To build the documentation either use the `build-documentation.sh` script in the root of the repository, or from the `documentation/website` folder run: 

```
yarn build
```

## Javadoc 

From the root of the repository you can can generate javadoc using:

```
mvn javadoc:aggregate
``` 

The output will be in `target/apidocs`.

## Typedoc 

You can generate Typescript documentation using [Typedoc](http://typedoc.org) from any JS package folder using the command:

```bash
typedoc --out doc/
```

This will generate a `doc` folder which contains a website of documentation.
