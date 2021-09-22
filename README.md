# Ethereum dApps Next.js Boiletplate [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<p>
  <img alt="made for ethereum" src="https://img.shields.io/badge/made_for-ethereum-771ea5.svg">
  <img alt="to the moon" src="https://img.shields.io/badge/to_the-moon-fab127.svg">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg">
</p>

The creation of Ethereum dApps Next.js Boiletplate is inspired by a truffle box [truffle-next](https://www.trufflesuite.com/boxes/truffle-next) with the
following improvements:
 - TypeScript support
 - WalletConnect integration
 - Better UI with Chakra UI
 - JQuery HTML example (without React)
 - Github workflow to run `truffle test` on every `git push` 

It is tested with [MetaMask](https://metamask.io/) Chrome extension and Android. I think it is good idea to test out [the dApps](https://eth-dapps-nextjs-boiletplate.vercel.app/) yourself before you continue further reading.

The dApps is interacting with a [Greeter smart contract](https://github.com/ethereum/ethereum-org/blob/master/views/content/greeter.md) that running on Rinkeby testnet, hence you need some ETH in your wallet. If you don't have any, you can request some ETH from [Rinkeby Faucet](https://faucet.rinkeby.io/). 


## Smart Contract Development
The project is bootstrapped with [Truffle](https://www.trufflesuite.com/truffle) using `truffle init` command.

Steps to run the Greeter smart contract locally:
1. Clone the github repository. This also takes care of installing the necessary dependencies.
    ```bash
    git clone git@github.com:limcheekin/eth-dapps-nextjs-boiletplate.git
    ```

2. Install Truffle globally.
    ```bash
    npm install -g truffle
    ```

3. Run the development console in the eth-dapps-nextjs-boiletplate directory.
    ```bash
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```bash
    compile
    migrate
    ```
    Please note down the contract address of the deployed Greeter smart contract. We will need to update it in the front-end code.

5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```bash
    // If inside the development console.
    test

    // If outside the development console.
    truffle test
    ```
6. Deploy smart contract to Rinkeby testnet
    - Install dependencies in the root directory.
        ```bash
        npm i
        # or
        yarn
        ```
    - Create a `.env` file with Infura Project ID and private key of your Rinkeby account, for example:
        ```
        INFURA_PROJECT_ID=b874a2f145f84dc5a8466e5490816789
        RINKEBY_PRIVATE_KEY=e0adc9a1b4818153aa47fee3f5160179bbb4f14157a971c133c22e2e35f88c9e
        ```
    - Run the `truffle migrate --network rinkeby` command to deploy smart contract to Rinkeby network.



## dApps Front End
The front-end code of the dApps is located in `client` directory. It is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The client is created by derived/adapted the codes from the following excellence articles:
- [Build a Web3 Dapp in React & Login with MetaMask](https://dev.to/jacobedawson/build-a-web3-dapp-in-react-login-with-metamask-4chp)
- [Global State Using Only React Hooks with the Context API (TypeScript Edition)](https://javascript.plainenglish.io/global-state-using-only-react-hooks-with-the-context-api-typescript-edition-ada822fc282c)
- [Build Your First Solidity Dapp With Web3.js and MetaMask](http://blog.adnansiddiqi.me/build-your-first-solidity-dapp-with-web3-js-and-metamask/)

Steps to run the client locally:
1. Install dependencies.
    ```bash
    npm i
    # or
    yarn
    ```
2. Update the following environment variables located in [client/.env.local](client/.env.local):
    ```
    NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS=0x...
    NEXT_PUBLIC_INFURA_PROJECT_ID=YOUR_INFURA_PROJECT_ID
    ```

3. Run the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser, you will see the screen of the React client:
    
    ![Main Screen](https://github.com/limcheekin/eth-dapps-nextjs-boiletplate/raw/master/doc/images/main.png "Main Screen")

    If React is not your cup of tea, open [http://localhost:3000/static.html](http://localhost:3000/static.html) with your browser, you will see the screen of the JQuery HTML client:

    ![JQuery HTML](https://github.com/limcheekin/eth-dapps-nextjs-boiletplate/raw/master/doc/images/static.png "JQuery HTML")

3. Update the value of the `contractAddress` of the [client/public/static.html](client/public/static.html#L101).

4. Run with MetaMask
    
    As `truffle develop` exposes the blockchain onto port `9545`, you'll need to add a Custom RPC network of `http://localhost:9545` in your MetaMask to make it work.

## Continuous Integration
The repository setup Continuous Integration build pipeline with GitHub Actions. If you use it as your project template, the first build will fail upon project creation. To fix it, you need to setup the `CC_SECRET` encrypted secret for Codechecks and `DOT_COVERALLS_YML` encrypted secret for Coveralls. Please refer to [Continuous Integration Setup](doc/ContinuousIntegrationSetup.md) for more information.