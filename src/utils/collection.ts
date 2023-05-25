import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC721 } from "../../generated/schema";

export function createCollection(
  collectionAddress: Address,
  tokenId: BigInt,
  owner: Address
): ERC721 {
  const erc721Id = `${collectionAddress.toHexString()}${tokenId}`;
  const erc721 = new ERC721(erc721Id);
  erc721.contractAddress = collectionAddress;
  erc721.tokenId = tokenId;
  erc721.owner = owner.toHexString();
  erc721.save();
  return erc721;
}
