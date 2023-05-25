import { Role, SpecialUser, User } from "../../generated/schema";
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function grantRole(
  contractAddress: Address,
  userAddress: Address,
  roleName: Bytes
): void {
  const userId = userAddress.toHexString();
  const roleId = `${contractAddress.toHexString()}${roleName.toHexString()}`;
  let specialUser = SpecialUser.load(userId);
  let role = Role.load(roleId);

  if (specialUser == null) {
    specialUser = createSpecialUser(userId, userAddress);
  }

  if (role == null) {
    role = createRole(roleId, contractAddress, roleName);
  }
  let specialUsers = role.specialUsers;
  specialUsers!.push(specialUser.id);
  role.specialUsers = specialUsers;
  let roles = specialUser.roles;
  roles!.push(role.id);
  specialUser.roles = roles;
  role.save();
  specialUser.save();
}

export function revokeRole(userId: string, roleId: string): void {
  let specialUser = SpecialUser.load(userId);
  let role = Role.load(roleId);
  let specialUserIndex = -1;
  for (let i = 0; i < role!.specialUsers!.length; i++) {
    if (role!.specialUsers![i] == specialUser!.id) {
      specialUserIndex = i;
      break;
    }
  }
  if (specialUserIndex != -1) {
    let specialUsers = role!.specialUsers;
    specialUsers!.splice(specialUserIndex, 1);
    role!.specialUsers = specialUsers;
  }

  let roleIndex = -1;
  for (let i = 0; i < specialUser!.roles!.length; i++) {
    if (specialUser!.roles![i] == roleId) {
      roleIndex = i;
      break;
    }
  }
  if (roleIndex != -1) {
    let roles = specialUser!.roles;
    roles!.splice(roleIndex, 1);
    specialUser!.roles = roles;
  }

  specialUser!.save();
  role!.save();
}

export function createRole(
  roleId: string,
  contractAddress: Address,
  roleName: Bytes
): Role {
  let role = new Role(roleId);
  role.contract = contractAddress;
  role.name = roleName;
  role.specialUsers = [];
  return role;
}

export function createSpecialUser(
  userId: string,
  address: Address
): SpecialUser {
  let superUser = new SpecialUser(userId);
  superUser.address = address;
  superUser.allowed = false;
  superUser.roles = [];
  return superUser;
}