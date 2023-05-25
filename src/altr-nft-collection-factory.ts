import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  CollectionCreated
} from "../generated/AltrNftCollectionFactory/AltrNftCollectionFactory";
import { SpecialUser } from "../generated/schema";
import { AltrNftCollection } from "../generated/templates";
import {
  createSpecialUser,
  grantRole,
  revokeRole
} from "./utils/role-management";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const roleName = Bytes.fromUTF8("Owner");
  const previousOwnerId = event.params.previousOwner.toHexString();
  const newOwner = event.params.newOwner;
  const contractAddress = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  const roleId = `${contractAddress.toHexString()}${roleName.toHexString()}`;
  if (SpecialUser.load(previousOwnerId) == null) {
    const user = createSpecialUser(previousOwnerId, event.params.previousOwner);
    user.save();
  }
  grantRole(contractAddress, newOwner, roleName);
  revokeRole(previousOwnerId, roleId);
}

export function handleCollectionCreated(event: CollectionCreated): void {
  AltrNftCollection.create(event.params.contractAddress);
}
