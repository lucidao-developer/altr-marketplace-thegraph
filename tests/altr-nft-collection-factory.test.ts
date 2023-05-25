import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { createAltrNftCollectionFactoryOwnershipTransferredEvent } from "./altr-nft-collection-factory-utils";
import { handleOwnershipTransferred } from "../src/altr-nft-collection-factory";

describe("Nft Collection Factory", () => {
  afterEach(() => {
    clearStore();
  });

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
    const newOwnershipTransferredEvent = createAltrNftCollectionFactoryOwnershipTransferredEvent(
      previousOwner,
      newOwner
    );
    handleOwnershipTransferred(newOwnershipTransferredEvent);
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
