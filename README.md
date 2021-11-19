# Ethereum NFT(ERC721) with Physical Asset Delivery and Secondary Royalties [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![Add to Homescreen](https://img.shields.io/badge/Skynet-Add%20To%20Homescreen-00c65e?logo=skynet&labelColor=0d0d0d)](https://homescreen.hns.siasky.net/#/skylink/AQCYCUhVSrL7ZH_ytcnGvfWW4IifSlgCo_J6a6iNicQDeQ)

<p>
  <img alt="made for ethereum" src="https://img.shields.io/badge/made_for-ethereum-771ea5.svg">
  <img alt="to the moon" src="https://img.shields.io/badge/to_the-moon-fab127.svg">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg">
</p>

I think the NFT(ERC721) is an important use case that every Solidity developer needs to get familiar besides ERC20. 

The token of the dApps known as `Physical Asset Token` with symbol `PA` as it is involved physical item delivery. The seller of the NFT needs to specify the "Lock From Date" and "Unlock Password" upon minting the NFT. The NFT is locked starting from the "Lock From Date". The buyer cannot sells/transfers the NFT until he/she unlocks the NFT with the "Unlock Password" that come with the physical item.

The project is created by referred to excellent tutorials on [ERC721](https://ethereum-blockchain-developer.com/120-erc721-supply-chain-aisthisi/00-aisthisi-project-overview/) and [Secondary Sales Royalties](https://ethereum-blockchain-developer.com/121-erc721-secondary-sales-royalties-erc2981/00-overview/) published by Thomas Wiesner.

The project is using the following third party libraries:
- Use `nft.storage` to store the image of the NFT and metadata.json file to the IPFS. You can find out more about [nft.storage here](https://nft.storage/).
- Use `@openzeppelin/contracts` for implementation of ERC721
- Reuse the [codes](https://github.com/rarible/protocol-contracts/tree/master/royalties/contracts) of `@rarible/royalties/contracts`.
- Use `truffle-assertions` for writing unit tests.

It is tested with [MetaMask](https://metamask.io/) Chrome extension and Android. I think it is good idea to test out [the dApp hosted on Skynet](https://0409g2a8al5b5ur4fvpbbie6nnqpdo48jt55g0l3u9t6na4dh7206u8.siasky.net/) yourself before looking into the code.

The dApps is interacting with smart contracts running on Rinkeby testnet, hence you need some ETH in your wallet. If you don't have any, you can request some ETH from [Rinkeby Faucet](https://faucet.rinkeby.io/). 


## Smart Contract Development
The project is bootstrapped with [Truffle](https://www.trufflesuite.com/truffle) using `truffle init` command.

Steps to run the smart contracts locally:
1. Clone the github repository. This also takes care of installing the necessary dependencies.
    ```bash
    git clone git@github.com:limcheekin/eth-erc721-physical-asset-delivery.git
    ```

2. Install dependencies in the root directory.
    ```bash
    npm i
    # or
    yarn
    ```

3. Install Truffle globally.
    ```bash
    npm install -g truffle
    ```

4. Run the development console in the root directory of the project.
    ```bash
    truffle develop
    ```

5. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```bash
    compile
    migrate
    ```
    Please note down the contract address of the deployed smart contracts. We will need to update it in the front-end's `.env.local`.

6. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```bash
    // If inside the development console.
    test

    // If outside the development console.
    truffle test
    ```

7. Deploy smart contract to Rinkeby testnet
    - Create a `.env` file with the configuration of Infura Project ID and private key of your Rinkeby account, for example:
        ```
        INFURA_PROJECT_ID=Your_Infura_Project_Id
        RINKEBY_PRIVATE_KEY=Your_Rinkeby_Private_Key
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

2. Create the `.env.local` file in the `client` directory and define the following environment variables:
    ```
    NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
    NEXT_PUBLIC_INFURA_PROJECT_ID=...
    NEXT_PUBLIC_NFT_STORAGE_API_KEY=...
    ```
   As the `.env.local` file is not stored in the repo, you need to add the content of the `.env.local` file as `DOT_ENV_DOT_LOCAL` secret for Skynet deployment.

3. Run the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser, you will see the following screen of the React client:
    
    ![Main Screen](https://github.com/limcheekin/eth-erc721-physical-asset-delivery/raw/master/doc/images/main.png "Main Screen")

4. Run with MetaMask
    
    As `truffle develop` exposes the blockchain onto port `9545`, you'll need to add a Custom RPC network of `http://localhost:9545` in your MetaMask to make it work.

5. After connected to MetaMask from the main screen, you will see the following screen which allow you to upload image to the IPFS and mint the NFT by click on the "Create" button.

    ![Create Screen](https://github.com/limcheekin/eth-erc721-physical-asset-delivery/raw/master/doc/images/create.png "Create Screen") 

6. After the token created successfully then click the list tab to view it, you will see the following screen:

    ![List Screen](https://github.com/limcheekin/eth-erc721-physical-asset-delivery/raw/master/doc/images/list.png "List Screen")

7. Run with Rinkeby network
    
    After the NFT token minted in the Rinkeby network, you can view it in the testnet/testsite of the following NFT marketplaces:
    - [OpenSea](https://testnets.opensea.io/assets/0x4e1e053c2515b20ddd66418de11f283bfc7e745a/0)
      
        ![OpenSea Screen](https://github.com/limcheekin/eth-erc721-physical-asset-delivery/raw/master/doc/images/opensea.png "OpenSea Screen")

    - [Rarible](https://rinkeby.rarible.com/token/0x4e1e053c2515b20ddd66418de11f283bfc7e745a:0)

        ![Rarible Screen](https://github.com/limcheekin/eth-erc721-physical-asset-delivery/raw/master/doc/images/rarible.png "Rarible Screen")    

    - Mintable

        However, it is unable to view on Mintable as per response from the Customer Support on 17 Nov 2021: _"I've made a check with the devs. Our Rinkeby Testnet is currently outdated. The devs are working on it to get it updated, unfortunately, I do not have an ETA on when it'll be updated. Hope this explains!"_

## Continuous Integration
The repository setup Continuous Integration build pipeline with GitHub Actions. If you use it as your project template, the first build will fail upon project creation. To fix it, you need to setup the `CC_SECRET` encrypted secret for Codechecks and `DOT_COVERALLS_YML` encrypted secret for Coveralls. Please refer to [Continuous Integration Setup](doc/ContinuousIntegrationSetup.md) for more information.