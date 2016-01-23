# world-simulator

No, this does not try to simulate the world.

## Prerequisites

node v5.

## Commands

### Running the server

    nodemon server/index.js

### Tests

Specific ones:

    npm-exec mocha test/shared/lib/

    cat $(which npm-exec)

=>

    #!/bin/bash
    command=$@
    $(npm bin)/$command