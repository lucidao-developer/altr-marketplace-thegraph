import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  CollectionCreated
} from "../generated/AltrNftCollectionFactory/AltrNftCollectionFactory";
import { AltrNftCollection } from "../generated/templates";
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
  previousOwner.save();
}

export function handleCollectionCreated(event: CollectionCreated): void {
  AltrNftCollection.create(event.params.contractAddress);
}
