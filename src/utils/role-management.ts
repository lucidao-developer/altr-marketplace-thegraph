import { Role, SpecialUser, User } from "../../generated/schema";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { pushToArray, removeFromArray, search } from "./array";
import { getOrCreateRole, getOrCreateSpecialUser } from "./entity";

export function grantRole(
  contractAddress: Address,
  userAddress: Address,
  roleName: Bytes
): void {
  const userId = userAddress.toHexString();
  const roleId = `${contractAddress.toHexString()}${roleName.toHexString()}`;
  let specialUser = getOrCreateSpecialUser(userId, userAddress);
  let role = getOrCreateRole(contractAddress, roleName);

  role.specialUsers = pushToArray(role.specialUsers, specialUser.id);
  specialUser.roles = pushToArray(specialUser.roles, roleId);

  role.save();
  specialUser.save();
}

export function revokeRole(userId: string, roleId: string): void {
  let specialUser = SpecialUser.load(userId);
  let role = Role.load(roleId);

  role!.specialUsers = removeFromArray(role!.specialUsers, specialUser!.id);
  specialUser!.roles = removeFromArray(specialUser!.roles, roleId);

  specialUser!.save();
  role!.save();
}
