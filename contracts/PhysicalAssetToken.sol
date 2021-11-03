// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./@rarible/royalties/contracts/impl/RoyaltiesV2Impl.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./@rarible/royalties/contracts/LibRoyaltiesV2.sol";

contract PhysicalAssetToken is ERC721URIStorage, Ownable, RoyaltiesV2Impl {
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
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
        string memory metadataURI,
        uint256 lockedFromTimestamp,
        bytes32 unlockHash
    ) public onlyOwner {
        uint256 id = _tokenIds.current();
        tokenLockedFromTimestamp[id] = lockedFromTimestamp;
        tokenUnlockCodeHashes[id] = unlockHash;
        super._mint(to, id);
        super._setTokenURI(id, metadataURI);

        _tokenIds.increment();
    }

    function setRoyalties(
        uint256 _tokenId,
        address payable _royaltiesReceipientAddress,
        uint96 _percentageBasisPoints
    ) public onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = _percentageBasisPoints;
        _royalties[0].account = _royaltiesReceipientAddress;
        _saveRoyalties(_tokenId, _royalties);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        LibPart.Part[] memory _royalties = royalties[_tokenId];
        if (_royalties.length > 0) {
            return (
                _royalties[0].account,
                (_salePrice * _royalties[0].value) / 10000
            );
        }
        return (address(0), 0);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        if (interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
            return true;
        }

        if (interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }

        return super.supportsInterface(interfaceId);
    }

    function tokenIds()
        external
        view
        returns (uint256)
    {
        return _tokenIds.current();
    }
}
