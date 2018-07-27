---
title: Build
---

Building Ketos is performed by a few helper scripts. Naturally you first need a [development environment](dev.setup-dev-env.html).

The scripts do nothing special, Ketos is is a combination of standard Maven and Lerna/Yarn projects after all.

The scripts are found in the root of the repository:

* `build-js.sh` builds only the the UI
* `build-java.sh` builds only the server components
* `build-documentation.sh` builds only the documentation
* `build.sh` performs all of the above

Each of the individual builds compiles the code or documentation in place. They are then moved over to the `/build` folder. Thus running `./build.sh` will create a complete deployment, which includes documentation, ui plugins and some example configuration.

As the build process is sequential and there are a number of modules on both the UI and on the Server it can take a while to complete and failure at the end of the process can be frustrating. If you know you have only changed a single UI plugin we suggest you first run `yarn build` within the plugins directory to ensure it will compile properly. Then run the `build-js` or `build` script to perform a larger build release. 


## Versioning

Support for versioning is built into Maven and Lerna, and we use those within Ketos. We don't include a script to perform version updates, versioning must be handled manually. 

In general we favour semantic versioning `x.y.z`:

* Update `x` for major changes, particularly those that are not backwards compatible
* Update `y` for minor changes in functionality, incrementing for each release
* Update `z` for bugs or security patches for the previous release

The nature of the Ketos project tends to lead to minor releases bumps. Currently we also release both UI and Server side at the same version (even if there are no changes). 

The general process is as follows, where:

* `$VERSION` with the target version (eg if we are working on `0.3.0` the next version is `0.4.0`)
* `$NEXT_DEV_VERSION` is `0.5.0-SNAPSHOT` 

```
# Start a git flow release
git flow release start $VERSION

# Update versions in maven
mvn version:set $VERSION
mvn versions:commit

# Full build
./build.sh

# At this stage you likely want to test the deploy directory

# Update yarn version, and release to NPM (non-private modules)
yarn version:release
# Release to mvn central (if desired)
mvn deploy

# End of git flow release
# This will also tag the version
git flow release finish

# Here you may want to save the build directory eg to a releases page etc

# Push to source control
git push origin master

# return to develop branch
git checkout develop

# update versions next dev version
mvn versions:set $NEXT_DEV_VERSION
version:snapshot $NEXT_DEV_VERSION

git push origin develop
```