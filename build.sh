#!/bin/bash


echo "Cleaning old build"
rmdir -rf build/
mkdir build

echo "Building UI"
cd jonah-ui
./build.sh
cd ..


cd jonah-server
./build.sh
cd -

./build-documentation.sh

echo "Collating to build directory"
cp -r jonah-server/build/. build/.
cp -r config/*  build/.

