# SDS Cli
*Software Development Service's command line interface.*

This is a [nodejs](https://nodejs.org) library for Smartcontract Developers.
It's an [SDS](https://docs.seascape.network/sds/intro) tool that allows smartcontract setup.

---
The **SDS Cli** is intended to be used along with smartcontract frameworks.

Supported smartcontract frameworks:
* [hardhat](https://hardhat.org/)
* [truffle](https://trufflesuite.com/)

## Installation
In your smartcontract framework run:

```bash
npm i sds-cli
```

## Requirements
> The smartcontract developer account
> that registers the smartcontract should 
> be whitelisted in the SDS.

The library requires environment variables:

```sh
SDS_ORGANIZATION_NAME=
SDS_PROJECT_NAME=
SDS_GATEWAY_HOST=localhost:3500
```

## Features
The **SDS Cli** supports two following operations with SDS.

1. register smartcontract &ndash; adds a new smartcontract to the SDS.
2. enable bundling &ndash; enables parameter bundling for smartcontracts, that has array arguments.

## `Hardhat` example

#### Smartcontract registration
You should change the script that deploys smartcontract to something like the code below:

```js
let { Smartcontract }  = require('sds-cli');
const { ethers }       = require("hardhat");

(async () => {
  let name            = "Greeter";
  let group           = "simple-test";

  // We get the contract to deploy
  const Greeter       = await ethers.getContractFactory(name);
  let deployer        = await ethers.getSigner();
  let smartcontract   = new Smartcontract(name, group);

  // constructor argument
  let constructor = ["Hello World!"];

  await smartcontract
    .deployInHardhat(deployer, Greeter, constructor)
    .catch(console.error);

  console.log(`\n\nDeployment Finished!\n\n`);
})()
  
```
If the code above was saved as `<project directory>/scripts/greeter.js`. Then run it using hardhat:

```bash
npx hardhat run scripts/greeter.js --network goerli-testnet
```

If everything is successful, that smartcontract will be registered in the SDS. To interact with smartcontract use the SDK libraries:

* [gosds](https://github.com/blocklords/gosds) for go language.
* [seascape-js](https://github.com/seascape/seascape-js) for typescript/nodejs.

---

# Contribution

The following part is for the maintainer of this project.
It's mostly for me [ahmetson](https://github.com/ahmetson) as the main maintainer I want to be able to remember how to work on this project.

## Installation
1. fork this repo.
2. download [docker](https://www.docker.com/products/docker-desktop/).
3. create `.env` based on the `.example.env`
4. create the docker image and run a container based on the image: `docker-compose up -d`
5. enter into the container: `docker exec -it seascape-js bash`

## Development
1. Compile the Typescript to Javascript code

```npx tsc```

2. Add the tests.
3. Add the example of code used in the examples folder.
4. Add the part of the code in README.md.
5. Update the version in package.json and push it to GitHub. 
6. upload `npm publish`

## Publishing for contributors
* Create a pull request to the https://github.com/blocklords/sds-cli
* Raise the issue with your changes.

---

# Tests
See the test scripts to see how it's used.
In order to run the test scripts, run the following command:

```sh
npx ts-node test/<test file name>
```

