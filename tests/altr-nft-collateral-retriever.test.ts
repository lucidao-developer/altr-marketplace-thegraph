import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  logStore
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  createAltrNftCollateralRetrieverOwnershipTransferredEvent,
  createRedeemRequest
} from "./altr-nft-collateral-retriever-utils";
import {
  handleOwnershipTransferred as handleAltrNftCollateralRetrieverOwnershipTransferred,
  handleRedeemRequest
} from "../src/altr-nft-collateral-retriever";

describe("Nft Collateral Retriever", () => {
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
    const newOwnershipTransferredEvent = createAltrNftCollateralRetrieverOwnershipTransferredEvent(
      previousOwner,
      newOwner
    );
    handleAltrNftCollateralRetrieverOwnershipTransferred(
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
    assert.fieldEquals(
      "SpecialUser",
      previousOwner.toHexString(),
      "roles",
      `[]`
    );
  });

  test("Redeem Request", () => {
    const collectionAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const fromAddress = "0x0000000000000000000000000000000000000000";
    const from = Address.fromString(fromAddress);
    const tokenId = BigInt.fromI32(1);
    const newRedeemRequestEvent = createRedeemRequest(
      collectionAddress,
      from,
      from,
      tokenId
    );
    handleRedeemRequest(newRedeemRequestEvent);
    const ER721Id = `${collectionAddress}${tokenId}`;
    assert.entityCount("RedeemRequest", 1);
    assert.fieldEquals("RedeemRequest", ER721Id, "erc721", ER721Id);
    assert.fieldEquals("RedeemRequest", ER721Id, "from", from.toHexString());
    assert.fieldEquals("RedeemRequest", ER721Id, "operator", fromAddress);
  });
});
