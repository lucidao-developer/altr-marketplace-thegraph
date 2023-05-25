import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  createFailedSaleNftWithdrawnEvent,
  createRoleGrantedEvent,
  createRoleRevokedEvent,
  createFractionsKeptWithdrawnEvent,
  createFractionsPurchasedEvent,
  createNewFractionsSaleEvent
} from "./altr-fractions-sale-utils";
import {
  handleFailedSaleNftWithdrawn,
  handleAltrFractionsSaleRoleGranted,
  handleAltrFractionsSaleRoleRevoked,
  handleFractionsKeptWithdrawn,
  handleFractionsPurchased,
  handleNewFractionsSale
} from "../src/altr-fractions-sale";
import { createSale } from "../src/utils/sale";

const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
describe("Describe entity assertions", () => {
  afterEach(() => {
    clearStore();
  });

  test("Failed Sale Nft Withdrawn", () => {
    const saleNumber = BigInt.fromI32(1);
    const saleId = `ERC1155${saleNumber}`;
    const now = 10000000;
    const nftContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const tokenId = BigInt.fromI32(1);
    const newFailedSaleNftWithdrawnEvent = createFailedSaleNftWithdrawnEvent(
      saleNumber,
      address,
      nftContractAddress,
      tokenId
    );
    const sale = createSale();
    handleFailedSaleNftWithdrawn(newFailedSaleNftWithdrawnEvent);
    assert.entityCount("Sale", 1);
    assert.fieldEquals("Sale", saleId, "isSuccessful", "false");
  });
  test("Fractions Kept Withdrawn", () => {
    const saleNumber = BigInt.fromI32(1);
    const saleId = `ERC1155${saleNumber}`;
    const sale = createSale();
    const amount = BigInt.fromI32(100);
    const newFractionsKeptWithdrawnEvent = createFractionsKeptWithdrawnEvent(
      saleNumber,
      address,
      amount
    );
    handleFractionsKeptWithdrawn(newFractionsKeptWithdrawnEvent);
    assert.entityCount("Sale", 1);
  });
  test("Fractions Purchased", () => {
    const saleNumber = BigInt.fromI32(1);
    const saleId = `ERC1155${saleNumber}`;
    const sale = createSale();
    const amount = BigInt.fromI32(100);
    const newFractionsPurchasedEvent = createFractionsPurchasedEvent(
      saleNumber,
      address,
      amount
    );
    handleFractionsPurchased(newFractionsPurchasedEvent);
    assert.entityCount("Sale", 1);
    assert.fieldEquals("Sale", saleId, "fractionsSold", "100");
  });
  test("New Fractions Sale", () => {
    const saleNumber = BigInt.fromI32(1);
    const saleId = `ERC1155${saleNumber}`;
    const buyTokenManager = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const nftContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    );
    const now = 1675845214;
    const fractionPrice = BigInt.fromI32(10);
    const fractionsAmount = 100;
    const fractionsSaleTuple = new ethereum.Tuple(12);
    fractionsSaleTuple[0] = ethereum.Value.fromAddress(address);
    fractionsSaleTuple[1] = ethereum.Value.fromAddress(buyTokenManager);
    fractionsSaleTuple[2] = ethereum.Value.fromAddress(nftContractAddress);
    fractionsSaleTuple[3] = ethereum.Value.fromUnsignedBigInt(
      BigInt.fromI32(1)
    );
    fractionsSaleTuple[4] = ethereum.Value.fromAddress(address);
    fractionsSaleTuple[5] = ethereum.Value.fromUnsignedBigInt(
      BigInt.fromI32(now)
    );
    fractionsSaleTuple[6] = ethereum.Value.fromUnsignedBigInt(
      BigInt.fromI32(now + 10)
    );
    fractionsSaleTuple[7] = ethereum.Value.fromUnsignedBigInt(fractionPrice);
    fractionsSaleTuple[8] = ethereum.Value.fromI32(fractionsAmount);
    fractionsSaleTuple[9] = ethereum.Value.fromI32(10);
    fractionsSaleTuple[10] = ethereum.Value.fromI32(0);
    fractionsSaleTuple[11] = ethereum.Value.fromI32(0);
    const newFractionsSaleEvent = createNewFractionsSaleEvent(
      saleNumber,
      fractionsSaleTuple
    );
    handleNewFractionsSale(newFractionsSaleEvent);
    assert.entityCount("Sale", 1);
    assert.fieldEquals("Sale", saleId, "openingTime", `${now}`);
    assert.fieldEquals("Sale", saleId, "closingTime", `${now + 10}`);
    assert.fieldEquals("Sale", saleId, "saleId", `${saleNumber}`);
    assert.fieldEquals("Sale", saleId, "isSuccessful", "false");
    assert.fieldEquals("Sale", saleId, "seller", address.toHexString());
    assert.fieldEquals(
      "Sale",
      saleId,
      "fractionPrice",
      `${fractionPrice}`
    );
    assert.fieldEquals(
      "Sale",
      saleId,
      "fractionsAmount",
      `${fractionsAmount}`
    );
    assert.fieldEquals("Sale", saleId, "fractionsSold", "0");
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
    const newRoleGratedEvent = createRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsSaleRoleGranted(newRoleGratedEvent);
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
    const newRoleGratedEvent = createRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsSaleRoleGranted(newRoleGratedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    const newRoleRevokedEvent = createRoleRevokedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsSaleRoleRevoked(newRoleRevokedEvent);
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
