import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  handleAddressesAllowed,
  handleAddressesDisallowed,
  handleRoleGranted,
  handleRoleRevoked
} from "../src/altr-allow-list";
import {
  createAddressesAllowedEvent,
  createAddressesDisallowedEvent,
  createRoleGrantedEvent,
  createRoleRevokedEvent
} from "./altr-allow-list-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
describe("AllowList", () => {
  afterEach(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Allow Addresses", () => {
    const addresses = [address];
    const newAddressesAllowedEvent = createAddressesAllowedEvent(addresses);
    handleAddressesAllowed(newAddressesAllowedEvent);
    assert.entityCount("User", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals("User", address.toHexString(), "allowed", "true");
  });

  test("Disallow Addresses", () => {
    const addresses = [address];
    const newAddressesAllowedEvent = createAddressesAllowedEvent(addresses);
    handleAddressesAllowed(newAddressesAllowedEvent);
    assert.entityCount("User", 1);
    assert.fieldEquals("User", address.toHexString(), "allowed", "true");
    const newAddressesDisallowedEvent = createAddressesDisallowedEvent(
      addresses
    );
    handleAddressesDisallowed(newAddressesDisallowedEvent);
    assert.entityCount("User", 1);
    assert.fieldEquals("User", address.toHexString(), "allowed", "false");
  });

  test("Role Granted", () => {
    const contractAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const role = Bytes.fromHexString(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
    const sender = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const newRoleGratedEvent = createRoleGrantedEvent(role, address, sender);
    handleRoleGranted(newRoleGratedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    assert.fieldEquals(
      "SpecialUser",
      address.toHexString(),
      "roles",
      `[${contractAddress.toHexString()}${role.toHexString()}]`
    );
    assert.fieldEquals(
      "Role",
      `${contractAddress.toHexString()}${role.toHexString()}`,
      "specialUsers",
      `[${address.toHexString()}]`
    );
  });

  test("Role Revoked", () => {
    const contractAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const role = Bytes.fromHexString(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
    const sender = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const newRoleGratedEvent = createRoleGrantedEvent(role, address, sender);
    handleRoleGranted(newRoleGratedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    const newRoleRevokedEvent = createRoleRevokedEvent(role, address, sender);
    handleRoleRevoked(newRoleRevokedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    assert.fieldEquals("SpecialUser", address.toHexString(), "roles", `[]`);
    assert.fieldEquals(
      "Role",
      `${contractAddress.toHexString()}${role.toHexString()}`,
      "specialUsers",
      `[]`
    );
    assert.fieldEquals(
      "Role",
      `${contractAddress.toHexString()}${role.toHexString()}`,
      "specialUsers",
      `[]`
    );
  });
});
