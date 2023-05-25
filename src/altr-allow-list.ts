import {
  AddressesAllowed as AddressesAllowedEvent,
  AddressesDisallowed as AddressesDisallowedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/AltrAllowList/AltrAllowList";
import { grantRole, revokeRole } from "./utils/role-management";
import { getOrCreateUser } from "./utils/user";

export function handleAddressesAllowed(event: AddressesAllowedEvent): void {
  const allowedAddresses = event.params.addresses;
  for (let i = 0; i < allowedAddresses.length; i++) {
    const allowedAddress = allowedAddresses[i];
    const userId = allowedAddress.toHexString();
    let user = getOrCreateUser(userId, allowedAddress);
    user.allowed = true;
    user.save();
  }
}

export function handleAddressesDisallowed(
  event: AddressesDisallowedEvent
): void {
  const disallowedAddresses = event.params.addresses;
  for (let i = 0; i < disallowedAddresses.length; i++) {
    const disallowedAddress = disallowedAddresses[i];
    const userId = disallowedAddress.toHexString();
    let user = getOrCreateUser(userId, disallowedAddress);
    user.allowed = false;
    user.save();

  }
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  const roleName = event.params.role;
  const specialUser = event.params.account;
  grantRole(event.address, specialUser, roleName);
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  const roleId = `${event.address.toHexString()}${event.params.role.toHexString()}`;
  const specialUserId = event.params.account.toHexString();
  revokeRole(specialUserId, roleId);
}
