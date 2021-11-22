import { BigInt } from "@graphprotocol/graph-ts"
import {
  PhysicalAssetToken,
  TokenUnlocked,
  Transfer
} from "../generated/PhysicalAssetToken/PhysicalAssetToken"
import { Token, User } from "../generated/schema"

export function handleTokenUnlocked(event: TokenUnlocked): void {
  let token = Token.load(event.params.tokenId.toString());
  if (token) {
    let contract = PhysicalAssetToken.bind(event.address);
    token.unlocked = contract.tokenUnlocked(event.params.tokenId);
    token.save();
  }  
}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.to.toHexString();
    token.tokenId = event.params.tokenId;

    let contract = PhysicalAssetToken.bind(event.address);
    token.tokenURI = contract.tokenURI(event.params.tokenId);
    token.createdAtTimestamp = event.block.timestamp;
    token.lockedAtTimestamp = contract.tokenLockedFromTimestamp(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
