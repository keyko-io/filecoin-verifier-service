# Filecoin Verifier Service 

> Filecoin service for automated datacap allocation
> [filecoin.io](https://filecoin.io/)


## Setup

```sh
# Install dependencies
npm install

# Compile
npm run build

# Run
npm run start
```

The application needs to have the following common environment variables defined:

```sh
ROOT_PATH // Default ""
NODE_ENV // Default  "development". Values: "development, Nerpanet, Mainnet"
SERVER_PORT // Default 3001
SERVER_HOST // Default 127.0.0.1
NODE_URL
NODE_TOKEN
```

To Generate secure JWT
```sh
TOKEN_SECRET
```

To run service as "Automated Verifier"
```sh
RUN_SERVICE // Set to true
RUN_APP_SERVICE // Set to false
VERIFIER_ADDRESS
VERIFIER_PRIVATE_KEY
VERIFIER_MSIG_ADDRESS 
```

To run service as "Automated Verifier"
```sh
RUN_SERVICE // Set to false
RUN_APP_SERVICE // Set to true
APP_MSIG_ADDRESS
APP_PRIVATE_KEY
VERIFIER_MSIG_ADDRESS 
APP_DATACAP_ALLOCATION // (in GB) default 1
```
