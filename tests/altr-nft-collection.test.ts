import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  handleRoleGranted,
  handleRoleRevoked,
  handleApproval,
  handleApprovalForAll,
  handleTransfer
} from "../src/altr-nft-collection";
import { createCollection } from "../src/utils/collection";
import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index";
import {
  createRoleGrantedEvent,
  createApproval,
  createApprovalForAllEvent,
  createRoleRevokedEvent,
  createTransferEvent
} from "./altr-nft-collection-utils";
import { getOrCreateUser } from "../src/utils/entity";

const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

describe("Nft Collection", () => {
  afterEach(() => {
    clearStore();
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

  test("Approval", () => {
    const approved = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const newApprovalEvent = createApproval(
      address,
      approved,
      BigInt.fromI32(1)
    );
    const contractAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const tokenId = BigInt.fromI32(1);
    const erc721 = createCollection(contractAddress, tokenId, address);
    handleApproval(newApprovalEvent);
    assert.entityCount("User", 1);
    assert.fieldEquals(
      "ERC721",
      erc721.id,
      "approved",
      `${approved.toHexString()}`
    );
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
    const erc721 = createCollection(
      Address.fromString(contractAddress),
      BigInt.fromI32(1),
      address
    );
    const newApprovalForAllEvent = createApprovalForAllEvent(
      address,
      operatorAddress,
      true
    );
    handleApprovalForAll(newApprovalForAllEvent);
    assert.entityCount("User", 2);
    assert.fieldEquals("ERC721", erc721.id, "operators", `[${operator.id}]`);
  });

  test("Transfer", () => {
    const user = getOrCreateUser(address.toHexString(), address);
    const to = Address.fromString("0x0000000000000000000000000000000000000002");
    const tokenId = BigInt.fromI32(1);
    const newTransferEvent = createTransferEvent(address, to, tokenId);
    const contractAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const erc721Id = `${contractAddress.toHexString()}${tokenId}`;
    user.erc721Owned = [erc721Id];
    user.save();
    handleTransfer(newTransferEvent);
    assert.fieldEquals("ERC721", erc721Id, "owner", to.toHexString());
    assert.fieldEquals(
      "User",
      to.toHexString(),
      "erc721Owned",
      `[${erc721Id}]`
    );
    assert.fieldEquals("User", address.toHexString(), "erc721Owned", `[]`);
    assert.fieldEquals(
      "ERC721",
      erc721Id,
      "transactionHistory",
      `[${newTransferEvent.transaction.hash.toHexString()}]`
    );
    assert.fieldEquals(
      "Transaction",
      newTransferEvent.transaction.hash.toHexString(),
      "from",
      user.id
    );
    assert.fieldEquals(
      "Transaction",
      newTransferEvent.transaction.hash.toHexString(),
      "to",
      to.toHexString()
    );
    assert.fieldEquals(
      "Transaction",
      newTransferEvent.transaction.hash.toHexString(),
      "erc721",
      `${erc721Id}`
    );
  });
});
