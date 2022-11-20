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

Install node modules required by backend and frontend
```
npm --prefix client install client
npm --prefix truffle install truffle
```

### Truffle
Create .env file based on truffle/.env.example file
```
touch truffle/.env
```

To run tests, run ganache and run this command
```
truffle test test/voting.test.js --network development
```

To deploy Voting contract locally
```
truffle deploy Voting.sol --network development
```
To deploy Voting contract on Goerli
```
truffle deploy Voting.sol --network goerli
```

## Run Voting Dapp

To run Voting Dapp locally, start the react dev server.
```sh
cd client
npm run start
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.
