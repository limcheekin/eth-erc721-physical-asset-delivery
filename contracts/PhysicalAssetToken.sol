// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhysicalAssetToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => uint256) public tokenLockedFromTimestamp;
    mapping(uint256 => bytes32) public tokenUnlockCodeHashes;
    mapping(uint256 => bool) public tokenUnlocked;

    event TokenUnlocked(uint256 tokenId, address unlockerAddress);

    constructor() ERC721("PhysicalAssetToken", "PA") {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(
            tokenLockedFromTimestamp[tokenId] > block.timestamp ||
                tokenUnlocked[tokenId],
            "PhysicalAssetToken: Token locked"
        );
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function unlockToken(bytes32 unlockHash, uint256 tokenId) public {
        require(
            msg.sender == ownerOf(tokenId),
            "PhysicalAssetToken: Only the Owner can unlock the Token"
        ); //not 100% sure about that one yet
        require(
            keccak256(abi.encode(unlockHash)) == tokenUnlockCodeHashes[tokenId],
            "PhysicalAssetToken: Unlock Code Incorrect"
        );
        tokenUnlocked[tokenId] = true;
        emit TokenUnlocked(tokenId, msg.sender);
    }

    /**
     * This one is the mint function that sets the unlock code, then calls the parent mint
     */
    function mint(
        address to,
        uint256 lockedFromTimestamp,
        bytes32 unlockHash
    ) public onlyOwner {
        tokenLockedFromTimestamp[_tokenIds.current()] = lockedFromTimestamp;
        tokenUnlockCodeHashes[_tokenIds.current()] = unlockHash;
        super._mint(to, _tokenIds.current());
        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(tokenId), ".json"));
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://eth-erc721-physical-asset-delivery.vercel.app/metadata/";
    }
}
