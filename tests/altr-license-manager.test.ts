import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  afterEach
} from "matchstick-as/assembly/index";
import { handleAltrLicenseManagerOwnershipTransferred } from "../src/altr-license-manager";
import { createAltrLicenseManagerOwnershipTransferredEvent } from "./altr-license-manager-utils";
import { Address, Bytes } from "@graphprotocol/graph-ts";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  afterEach(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Ownership Transferred", () => {
    const previousOwner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    const newOwner = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const contractAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const role = Bytes.fromUTF8("Owner");
    const newOwnershipTransferredEvent = createAltrLicenseManagerOwnershipTransferredEvent(
      previousOwner,
      newOwner
    );
    handleAltrLicenseManagerOwnershipTransferred(
      newOwnershipTransferredEvent
    );
    assert.entityCount("SpecialUser", 2);
    assert.entityCount("Role", 1);
    assert.fieldEquals(
      "SpecialUser",
      newOwner.toHexString(),
      "roles",
      `[${contractAddress.toHexString()}${role.toHexString()}]`
    );
    assert.fieldEquals(
      "Role",
      `${contractAddress.toHexString()}${role.toHexString()}`,
      "specialUsers",
      `[${newOwner.toHexString()}]`
    );
    assert.fieldEquals("SpecialUser", previousOwner.toHexString(), "roles", `[]`);
  });
});
