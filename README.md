
## Description

Tycho API - Built with [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

You also need a mongodb instance available to persist data:

```
docker run -d -p 27017:27017 --name tycho-mongo -v mongovol:/data/db mongo:4.2.5
```

## Initialize db script

```bash
# script will create 1 donor, 1 consumer and 1 call for papers
$ npx ts-node initiate-db.ts

# consumer:
login: consumer@mail.com
password: consumer

# donor:
login: donor@mail.com
password: donor
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
