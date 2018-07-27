#!/bin/bash
# Clone 
git clone -b ${1:-master} git@github.com:commitd/jonah-server.git
git clone -b ${1:-master} git@github.com:commitd/jonah-ui.git

# Install documentation too
./setup-documentation.sh

cd jonah-server
./setup.sh
cd -

cd jonah-ui
./setup.sh
cd -