#!/bin/bash

# Delete old documentation
rm -rf build/documentation


# build new documenentation
cd documentation/website
yarn build
cd -

# Copy the documentation into place
mkdir -p build
cp -r documentation/website/build/ build/documentation

