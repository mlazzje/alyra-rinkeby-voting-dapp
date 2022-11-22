# Alyra Rinkeby Voting Dapp
Alyra Project - Voting Dapp - Project #3

## Packages required

```
Truffle v5.6.2 (core: 5.6.2)
Ganache v7.4.4
Solidity - 0.8.17 (solc-js)
Node v16.18.1
Web3.js v1.7.4
```

## Init

After cloning the project, install node modules required by truffle and website
```sh
npm --prefix client install client
npm --prefix truffle install truffle
```

### Truffle
Create .env file based on truffle/.env.example file
```sh
cd truffle
cp .env.example .env
nano .env
```

To run tests, run ganache and run this command
```sh
cd truffle
truffle test test/voting.test.js --network development
```

To deploy Voting contract locally
```sh
cd truffle
truffle deploy Voting.sol --network development
```
To deploy Voting contract on Goerli
```sh
cd truffle
truffle deploy Voting.sol --network goerli
```

## Run Voting Dapp

To run Voting Dapp locally, start the react dev server.
```sh
cd client
npm run start
```

From there, follow the instructions on the hosted React app.

## Hosted DApp

### Smart contract

The smart contract has been deployed on Goerli at this addres
```
0xcfc626A6f14Ac6bd486ee90A8Ae299d59b78c6A6
```

[See on Etherscan Goerli](https://goerli.etherscan.io/tx/0x27185954f9fa7fcd16c4efe2e2806465b6881bfc2304bb7fbc8baeb71e17c7f6)

### DApp

DApp is hosted on Vercel here: [https://alyra-rinkeby-voting-dapp-by-mlazzje.vercel.app/](https://alyra-rinkeby-voting-dapp-by-mlazzje.vercel.app/)