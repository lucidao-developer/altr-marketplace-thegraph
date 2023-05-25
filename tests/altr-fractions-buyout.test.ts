import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index";
import { BigInt, Address, ethereum, Bytes } from "@graphprotocol/graph-ts";
import {
  handleBuyoutExecuted,
  handleBuyoutParamsSet,
  handleBuyoutRequested,
  handleAltrFractionsBuyoutRoleGranted,
  handleAltrFractionsBuyoutRoleRevoked
} from "../src/altr-fractions-buyout";
import {
  createBuyoutExecutedEvent,
  createBuyoutParamsSetEvent,
  createBuyoutRequestedEvent,
  createAltrFractionsBuyoutRoleGrantedEvent,
  createAltrFractionsBuyoutRoleRevokedEvent
} from "./altr-fractions-buyout-utils";
import { Buyout, Sale } from "../generated/schema";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
describe("FractionsBuyout", () => {
  afterEach(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Buyout Executed", () => {
    const buyoutId = BigInt.fromI32(234);
    const boughtOutFractions = BigInt.fromI32(234);
    const buyoutAmount = BigInt.fromI32(234);
    const fractionsContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const tokenId = BigInt.fromI32(1);
    const newBuyoutExecutedEvent = createBuyoutExecutedEvent(
      buyoutId,
      address,
      boughtOutFractions,
      buyoutAmount,
      fractionsContractAddress,
      tokenId
    );
    handleBuyoutExecuted(newBuyoutExecutedEvent);
    assert.entityCount("Buyout", 1);
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "initiator",
      address.toHexString()
    );
    assert.fieldEquals("Buyout", buyoutId.toHexString(), "isSuccessful", "true");
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "erc1155",
      `${fractionsContractAddress}${tokenId}`
    );
  });
  test("Buyout Params Set", () => {
    const buyoutId = BigInt.fromI32(1);
    const now = 1675845214;
    const buyoutPrice = 10;
    const buyoutToken = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const buyoutTokenManager = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    );

    const initiator = Address.fromString(
      "0x0000000000000000000000000000000000000004"
    );

    const saleId = BigInt.fromI32(1);

    const buyoutTuple = new ethereum.Tuple(9);
    buyoutTuple[0] = ethereum.Value.fromAddress(address);
    buyoutTuple[1] = ethereum.Value.fromUnsignedBigInt(saleId);
    buyoutTuple[2] = ethereum.Value.fromAddress(buyoutTokenManager);
    buyoutTuple[3] = ethereum.Value.fromAddress(buyoutToken);
    buyoutTuple[4] = ethereum.Value.fromUnsignedBigInt(
      BigInt.fromI32(buyoutPrice)
    );
    buyoutTuple[5] = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(now));
    buyoutTuple[6] = ethereum.Value.fromUnsignedBigInt(
      BigInt.fromI32(now + 10)
    );
    buyoutTuple[7] = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10));
    buyoutTuple[8] = ethereum.Value.fromBoolean(false);
    const newBuyoutParamsSet = createBuyoutParamsSetEvent(
      buyoutId,
      buyoutTuple
    );
    let buyout = new Buyout(buyoutId.toHexString());
    buyout.buyoutId = buyoutId;
    buyout.erc1155 = `${address}1`;
    buyout.initiator = address.toHexString();
    buyout.isSuccessful = false;
    buyout.save();
    handleBuyoutParamsSet(newBuyoutParamsSet);
    assert.entityCount("Buyout", 1);
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "openingTime",
      `${now}`
    );
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "buyoutPrice",
      `${buyoutPrice}`
    );
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "buyoutToken",
      buyoutToken.toHexString()
    );
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "buyoutTokenManager",
      buyoutTokenManager.toHexString()
    );
  });
  test("Buyout Requested", () => {
    const saleId = `ERC1155${BigInt.fromI32(1)}`
    const buyoutId = BigInt.fromI32(2);
    const nftContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    );
    const fractionsContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000004"
    );
    const now = BigInt.fromI32(1675845214);
    const sale = new Sale(saleId);
    sale.openingTime = now;
    sale.closingTime = now.plus(BigInt.fromI32(10));
    sale.saleId = BigInt.fromI32(1);
    sale.isSuccessful = false;
    sale.seller = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    ).toHexString();
    sale.fractionPrice = BigInt.fromI32(10);
    sale.fractionsAmount = BigInt.fromI32(100);
    sale.fractionsSold = BigInt.fromI32(0);
    sale.erc721 = `${nftContractAddress}${1}`;
    sale.erc1155 = `${fractionsContractAddress}${1}`;
    sale.save();
    const newBuyoutRequestedEvent = createBuyoutRequestedEvent(
      sale.saleId,
      address,
      buyoutId
    );
    handleBuyoutRequested(newBuyoutRequestedEvent);
    assert.entityCount("Buyout", 1);
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "initiator",
      address.toHexString()
    );
    assert.fieldEquals("Buyout", buyoutId.toHexString(), "isSuccessful", "false");
    assert.fieldEquals(
      "Buyout",
      buyoutId.toHexString(),
      "erc1155",
      `${fractionsContractAddress}${1}`
    );
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
    const newRoleGratedEvent = createAltrFractionsBuyoutRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsBuyoutRoleGranted(newRoleGratedEvent);
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
    const newRoleGratedEvent = createAltrFractionsBuyoutRoleGrantedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsBuyoutRoleGranted(newRoleGratedEvent);
    assert.entityCount("SpecialUser", 1);
    assert.entityCount("Role", 1);
    const newRoleRevokedEvent = createAltrFractionsBuyoutRoleRevokedEvent(
      role,
      address,
      sender
    );
    handleAltrFractionsBuyoutRoleRevoked(newRoleRevokedEvent);
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
