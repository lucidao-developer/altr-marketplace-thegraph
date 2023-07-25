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
  handleApprovalForAll,
  handleAltrFractionsRoleGranted,
  handleAltrFractionsRoleRevoked,
  handleTransferBatch,
  handleTransferSingle
} from "../src/altr-fractions";
import {
  createApprovalForAllEvent,
  createAltrFractionsRoleGrantedEvent,
  createAltrFractionsRoleRevokedEvent,
  createTransferBatchEvent,
  createTransferSingleEvent
} from "./altr-fractions-utils";
import { getOrCreateUser } from "../src/utils/entity";
import { createFractions } from "../src/utils/fractions";

const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
describe("Describe entity assertions", () => {
  afterEach(() => {
    clearStore();
  });

  test("Approval For All", () => {
    const user = getOrCreateUser(address.toHexString(), address);
    user.save();
    const operatorAddress = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const operator = getOrCreateUser(
      operatorAddress.toHexString(),
      operatorAddress
    );
    operator.save();
    const contractAddress = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a";
    const newApprovalForAllEvent = createApprovalForAllEvent(
      address,
      operatorAddress,
      true
    );
    handleApprovalForAll(newApprovalForAllEvent);
    assert.entityCount("User", 2);
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
    const newRoleGratedEvent = createAltrFractionsRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsRoleGranted(newRoleGratedEvent);
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
    const newRoleGratedEvent = createAltrFractionsRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsRoleGranted(newRoleGratedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    const newRoleRevokedEvent = createAltrFractionsRoleRevokedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsRoleRevoked(newRoleRevokedEvent);
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

  test("Transfer Single", () => {
    const to = Address.fromString("0x0000000000000000000000000000000000000002");
    const erc1155 = createFractions(address);
    const newTransferSingleEvent = createTransferSingleEvent(
      address,
      address,
      to,
      erc1155.tokenId,
      BigInt.fromI32(10)
    );
    handleTransferSingle(newTransferSingleEvent);
    logStore();
    assert.entityCount("Transaction", 1);
    assert.fieldEquals(
      "Transaction",
      newTransferSingleEvent.transaction.hash.toHexString(),
      "from",
      address.toHexString()
    );
    assert.fieldEquals(
      "Transaction",
      newTransferSingleEvent.transaction.hash.toHexString(),
      "to",
      to.toHexString()
    );
    assert.fieldEquals(
      "ERC1155",
      erc1155.id,
      "transactionHistory",
      `[${newTransferSingleEvent.transaction.hash.toHexString()}]`
    );
    assert.fieldEquals("User", to.toHexString(), "erc1155", `[${erc1155.id}]`);
    assert.fieldEquals(
      "User",
      to.toHexString(),
      "erc1155Balance",
      `[${BigInt.fromI32(10)}]`
    );
    assert.fieldEquals(
      "ERC1155",
      erc1155.id,
      "owners",
      `[${to.toHexString()}]`
    );
    assert.fieldEquals(
      "ERC1155",
      erc1155.id,
      "ownersBalances",
      `[${BigInt.fromI32(10)}]`
    );
  });

  test("Transfer Batch", () => {
    const to = Address.fromString("0x0000000000000000000000000000000000000002");
    const newTransferBatchEvent = createTransferBatchEvent(
      address,
      address,
      to,
      [BigInt.fromI32(1), BigInt.fromI32(2)],
      [BigInt.fromI32(10), BigInt.fromI32(10)]
    );
    handleTransferBatch(newTransferBatchEvent);
    assert.entityCount("Transaction", 1);
    assert.fieldEquals(
      "Transaction",
      newTransferBatchEvent.transaction.hash.toHexString(),
      "erc1155",
      `[${Address.fromString(
        "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
      ).toHexString()}${BigInt.fromI32(1)}, ${Address.fromString(
        "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
      ).toHexString()}${BigInt.fromI32(2)}]`
    );
    assert.fieldEquals(
      "ERC1155",
      `${Address.fromString(
        "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
      ).toHexString()}${BigInt.fromI32(1)}`,
      "transactionHistory",
      `[${newTransferBatchEvent.transaction.hash.toHexString()}]`
    );
    assert.fieldEquals(
      "User",
      to.toHexString(),
      "erc1155",
      `[${Address.fromString(
        "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
      ).toHexString()}${BigInt.fromI32(1)}, ${Address.fromString(
        "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
      ).toHexString()}${BigInt.fromI32(2)}]`
    );
    assert.fieldEquals(
      "User",
      to.toHexString(),
      "erc1155Balance",
      `[${BigInt.fromI32(10)}, ${BigInt.fromI32(10)}]`
    );
  });
});
