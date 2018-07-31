# Jonah

## About this repo

This repository contains the project documentation, but it also has some scripts to get up get started:

```bash
# Clone this repository
git clone https://github.com/commitd/jonah.git

# Run this command (it'll clone the other two projects for you)
./setup.sh

# Now go to the project you want:
# cd jonah-server
# cd jonah-ui

# or build everything:

./build.sh
cd build/
./run.sh
```

## Where's the actual code?

Quite right!

This is a top level project repository, but the actual code is held under to separate repositories:

- [Jonah Server](https://github.com/commitd/jonah-server) for backend server code
- [Jonah UI](https://github.com/commitd/jonah-ui) for the frontend web code

The project depends on the Invest framework:

- [Invest](https://commitd.github.io/invest) for the project documentation
- [Invest Server](https://github.com/commitd/invest-server) for backend server code
- [Invest UI](https://github.com/commitd/invest-ui) for the frontend web code

## Licence

Jonah is licensed under the Apache Software Licence, see the LICENSE for more details.

Committed were selected by the Defence Science Technology Laboratory (Dstl) to deliver the Jonah Framework under a contract which ended in March 2018.
