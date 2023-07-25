import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  RedeemRequest as RedeemRequestEvent
} from "../generated/AltrNftCollateralRetriever/AltrNftCollateralRetriever";
import { RedeemRequest } from "../generated/schema";
import { grantRole, revokeRole } from "./utils/role-management";
import { getOrCreateSpecialUser } from "./utils/entity";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const roleName = Bytes.fromUTF8("Owner");
  const previousOwner = getOrCreateSpecialUser(
    event.params.previousOwner.toHexString(),
    event.params.previousOwner
  );
  const newOwner = event.params.newOwner;
  const contractAddress = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  const roleId = `${contractAddress.toHexString()}${roleName.toHexString()}`;
  grantRole(contractAddress, newOwner, roleName);
  revokeRole(previousOwner.id, roleId);
}

export function handleRedeemRequest(event: RedeemRequestEvent): void {
  const ER721Id = `${event.params.collectionAddress}${event.params.tokenId}`;
  let redeemRequest = new RedeemRequest(ER721Id);
  redeemRequest.erc721 = ER721Id;
  redeemRequest.from = event.params.from.toHexString();
  redeemRequest.operator = event.params.operator;
  redeemRequest.save();
}
