const PhysicalAssetToken = artifacts.require('PhysicalAssetToken');
const truffleAssert = require('truffle-assertions');

let correctUnlockCode = web3.utils.sha3('test'); //test is the password
const LOCK_IN_SECONDS = 10; //lock it in 10 seconds to test unlock
let timestampLockedFrom = Math.round(Date.now() / 1000) + LOCK_IN_SECONDS;
let unlockCodeHash = web3.utils.sha3(correctUnlockCode); //double hashed

contract('PhysicalAssetToken: test mint and lock', (accounts) => {
    const [deployerAddress, tokenHolderOneAddress, tokenHolderTwoAddress] = accounts;

    before(async () => {
        this.token = await PhysicalAssetToken.deployed()
    })

    it('is possible to mint tokens for the minter role', async () => {
        await this.token.mint(tokenHolderOneAddress, timestampLockedFrom, unlockCodeHash); //minting works
        await truffleAssert.fails(this.token.transferFrom(deployerAddress, tokenHolderOneAddress, 0)); //transferring for others doesn't work

        //but transferring in general works
        await truffleAssert.passes(
            this.token.transferFrom(tokenHolderOneAddress, tokenHolderTwoAddress, 0, { from: tokenHolderOneAddress }),
        );
    });

    it('is not possible to transfer locked tokens', async () => {
        // Wait for the token to be locked
        await new Promise((res) => {
            setTimeout(res, (LOCK_IN_SECONDS + 1) * 1000);
        });
        await truffleAssert.fails(
            this.token.transferFrom(tokenHolderTwoAddress, tokenHolderOneAddress, 0, { from: tokenHolderTwoAddress }),
            truffleAssert.ErrorType.REVERT,
            'PhysicalAssetToken: Token locked',
        );
    });

    it('is not possible to unlock tokens for anybody else than the token holder', async () => {
        await truffleAssert.fails(
            this.token.unlockToken(correctUnlockCode, 0, { from: deployerAddress }),
            truffleAssert.ErrorType.REVERT,
            'PhysicalAssetToken: Only the Owner can unlock the Token',
        );
    });

    it('is not possible to unlock tokens without the correct unlock code', async () => {
        let wrongUnlockCode = web3.utils.sha3('Santa Lucia');
        await truffleAssert.fails(
            this.token.unlockToken(wrongUnlockCode, 0, { from: tokenHolderTwoAddress }),
            truffleAssert.ErrorType.REVERT,
            'PhysicalAssetToken: Unlock Code Incorrect',
        );
    });

    it('is possible to unlock the token and transfer it again', async () => {
        await truffleAssert.passes(this.token.unlockToken(correctUnlockCode, 0, { from: tokenHolderTwoAddress }));
        await truffleAssert.passes(
            this.token.transferFrom(tokenHolderTwoAddress, deployerAddress, 0, { from: tokenHolderTwoAddress }),
        );
        let tokenOwner = await this.token.ownerOf(0);
        assert.equal(tokenOwner, deployerAddress, 'The Owner is not the correct address');
    });

    it('is possible to retrieve the correct token URI', async () => {
        let metadata = await this.token.tokenURI(0);
        assert.equal('https://eth-erc721-physical-asset-delivery.vercel.app/metadata/0.json', metadata);
    })
});