import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  createTokensSellerReleasedEvent,
  createTokensReleasedEvent
} from "./timed-token-splitter-utils";
import {
  handleTokensSellerReleased,
  handleTokensReleased
} from "../src/timed-token-splitter";
import { createSale } from "../src/utils/sale";
import { getOrCreateUser } from "../src/utils/user";
import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  logStore
} from "matchstick-as/assembly/index";
import { ERC1155 } from "../generated/schema";

describe("Timed Token Splitter", () => {
  afterEach(() => {
    clearStore();
  });

  test("Tokens Seller Released", () => {
    const sale = createSale();
    const seller = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    const newTokensSellerReleasedEvent = createTokensSellerReleasedEvent(
      seller,
      sale.saleId,
      BigInt.fromI32(100)
    );
    handleTokensSellerReleased(newTokensSellerReleasedEvent);
    assert.entityCount("Sale", 1);
    assert.fieldEquals("Sale", sale.id, "isSuccessful", "true");
    assert.fieldEquals("Sale", sale.id, "sellerReleased", "true");
  });

  test("Tokens Seller Released", () => {
    const sale = createSale();
    const users = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ];
    const user = getOrCreateUser(users[0].toHexString(), users[0]);
    const tokenId = BigInt.fromI32(1);
    const amounts = [BigInt.fromI32(10)];
    const fractionsPrice = BigInt.fromI32(10);
    const newTokensReleasedEvent = createTokensReleasedEvent(
      users,
      tokenId,
      amounts,
      fractionsPrice
    );
    const erc1155Id = `${newTokensReleasedEvent.params.token}${newTokensReleasedEvent.params.tokenId}`;
    const erc1155 = new ERC1155(erc1155Id);
    erc1155.contractAddress = newTokensReleasedEvent.params.token;
    erc1155.supply = BigInt.fromI32(100);
    erc1155.tokenId = newTokensReleasedEvent.params.tokenId;
    erc1155.erc721 = `${sale.erc721}1`;
    erc1155.owners = [user.id];
    erc1155.save();
    user.erc1155 = [erc1155Id];
    user.erc1155Balance = [BigInt.fromI32(10)];
    user.save();
    handleTokensReleased(newTokensReleasedEvent);
    assert.entityCount("Sale", 1);
    assert.fieldEquals("Sale", sale.id, "isSuccessful", "false");
    assert.entityCount("User", 1);
    assert.fieldEquals("User", user.id, "erc1155", "[]");
    assert.fieldEquals("ERC1155", erc1155.id, "owners", "[]");
  });
});
