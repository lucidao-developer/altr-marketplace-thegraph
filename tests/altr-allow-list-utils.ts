import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AddressesAllowed,
  AddressesDisallowed,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/AltrAllowList/AltrAllowList"

export function createAddressesAllowedEvent(
  addresses: Array<Address>
): AddressesAllowed {
  let addressesAllowedEvent = changetype<AddressesAllowed>(newMockEvent())

  addressesAllowedEvent.parameters = new Array()

  addressesAllowedEvent.parameters.push(
    new ethereum.EventParam(
      "addresses",
      ethereum.Value.fromAddressArray(addresses)
    )
  )

  return addressesAllowedEvent
}

export function createAddressesDisallowedEvent(
  addresses: Array<Address>
): AddressesDisallowed {
  let addressesDisallowedEvent = changetype<AddressesDisallowed>(newMockEvent())

  addressesDisallowedEvent.parameters = new Array()

  addressesDisallowedEvent.parameters.push(
    new ethereum.EventParam(
      "addresses",
      ethereum.Value.fromAddressArray(addresses)
    )
  )

  return addressesDisallowedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
