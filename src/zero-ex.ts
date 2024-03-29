import { BigInt } from "@graphprotocol/graph-ts";
import {
  ERC1155OrderCancelled,
  ERC1155OrderFilled,
  ERC721OrderCancelled,
  ERC721OrderFilled
} from "../generated/ZeroEx/ZeroEx";
import {
  ERC1155,
  ERC721,
  Order0x,
  Transaction0x,
  User
} from "../generated/schema";
import { getOrCreateUser } from "./utils/entity";

export function handleERC721OrderCancelled(event: ERC721OrderCancelled): void {
  const maker = User.load(event.params.maker.toHexString());
  if (maker == null) {
    return;
  }
  const ERC721OrderId = `ERC721${event.params.nonce}`;
  let cancelledOrder = Order0x.load(ERC721OrderId);
  if (cancelledOrder == null) {
    cancelledOrder = new Order0x(ERC721OrderId);
    cancelledOrder.maker = maker.id;
    cancelledOrder.nonce = event.params.nonce;
    cancelledOrder.cancelled = true;
    cancelledOrder.filled = false;
    cancelledOrder.timestamp = event.block.timestamp;
    cancelledOrder.nftTokenType = `ERC721`;
  }
  cancelledOrder.save();
}

export function handleERC721OrderFilled(event: ERC721OrderFilled): void {
  const makerId = event.params.maker.toHexString();
  const takerId = event.params.taker.toHexString();
  let taker = getOrCreateUser(takerId, event.params.taker);
  let maker = getOrCreateUser(makerId, event.params.maker);
  const ERC721Id = `${event.params.erc721Token.toHexString()}${
    event.params.erc721TokenId
  }`;
  let erc721 = ERC721.load(ERC721Id);
  if (erc721 == null) {
    return;
  }

  const ERC721OrderId = `ERC721${event.params.nonce}`;
  let filledOrder = Order0x.load(ERC721OrderId);
  if (filledOrder == null) {
    filledOrder = new Order0x(ERC721OrderId);
    filledOrder.maker = maker.id;
    filledOrder.taker = taker.id;
    filledOrder.nonce = event.params.nonce;
    filledOrder.cancelled = false;
    filledOrder.filled = true;
    filledOrder.timestamp = event.block.timestamp;
    filledOrder.erc20Token = event.params.erc20Token;
    filledOrder.erc20FilledAmount = event.params.erc20TokenAmount;
    filledOrder.direction = BigInt.fromI32(event.params.direction);
    filledOrder.nftToken = erc721.contractAddress;
    filledOrder.nftTokenId = event.params.erc721TokenId;
    filledOrder.nftTokenFilledAmount = BigInt.fromI32(1);
    filledOrder.nftTokenType = `ERC721`;
  }

  const transactionId = `${event.transaction.hash.toHexString()}`;
  let transaction0x = Transaction0x.load(transactionId);
  if (transaction0x == null) {
    transaction0x = new Transaction0x(transactionId);
    transaction0x.transactionId = event.transaction.hash;
    transaction0x.order = filledOrder.id;
    transaction0x.erc20Token = event.params.erc20Token;
    transaction0x.erc20TokenAmount = event.params.erc20TokenAmount;
    transaction0x.nftTokenType = `ERC721`;
    transaction0x.nftToken = event.params.erc721Token;
    transaction0x.nftTokenId = event.params.erc721TokenId;
    transaction0x.nftTokenAmount = BigInt.fromI32(1);
    transaction0x.timestamp = event.block.timestamp;
  }

  taker.save();
  maker.save();
  erc721.save();
  filledOrder.save();
  transaction0x.save();
}

export function handleERC1155OrderFilled(event: ERC1155OrderFilled): void {
  const makerId = event.params.maker.toHexString();
  const takerId = event.params.taker.toHexString();
  let taker = getOrCreateUser(takerId, event.params.taker);
  let maker = getOrCreateUser(makerId, event.params.maker);
  const ERC1155Id = `${event.params.erc1155Token.toHexString()}${
    event.params.erc1155TokenId
  }`;
  let erc1155 = ERC1155.load(ERC1155Id);
  if (erc1155 == null) {
    return;
  }

  const ERC1155OrderId = `ERC1155${event.params.nonce}`;
  let filledOrder = Order0x.load(ERC1155OrderId);
  if (filledOrder == null) {
    filledOrder = new Order0x(ERC1155OrderId);
    filledOrder.maker = maker.id;
    filledOrder.taker = taker.id;
    filledOrder.nonce = event.params.nonce;
    filledOrder.cancelled = false;
    filledOrder.filled = true;
    filledOrder.timestamp = event.block.timestamp;
    filledOrder.erc20Token = event.params.erc20Token;
    filledOrder.erc20FilledAmount = event.params.erc20FillAmount;
    filledOrder.direction = BigInt.fromI32(event.params.direction);
    filledOrder.nftTokenType = `ERC1155`;
    filledOrder.nftToken = erc1155.contractAddress;
    filledOrder.nftTokenId = event.params.erc1155TokenId;
    filledOrder.nftTokenFilledAmount = event.params.erc1155FillAmount;
  } else {
    filledOrder.erc20FilledAmount = filledOrder.erc20FilledAmount!.plus(
      event.params.erc20FillAmount
    );
    filledOrder.nftTokenFilledAmount = filledOrder.nftTokenFilledAmount!.plus(
      event.params.erc1155FillAmount
    );
  }

  const transactionId = `${event.transaction.hash.toHexString()}`;
  let transaction0x = Transaction0x.load(transactionId);
  if (transaction0x == null) {
    transaction0x = new Transaction0x(transactionId);
    transaction0x.transactionId = event.transaction.hash;
    transaction0x.order = filledOrder.id;
    transaction0x.erc20Token = event.params.erc20Token;
    transaction0x.erc20TokenAmount = event.params.erc20FillAmount;
    transaction0x.nftTokenType = `ERC1155`;
    transaction0x.nftToken = event.params.erc1155Token;
    transaction0x.nftTokenId = event.params.erc1155TokenId;
    transaction0x.nftTokenAmount = event.params.erc1155FillAmount;
    transaction0x.timestamp = event.block.timestamp;
  }

  taker.save();
  maker.save();
  erc1155.save();
  filledOrder.save();
  transaction0x.save();
}

export function handleERC1155OrderCancelled(
  event: ERC1155OrderCancelled
): void {
  const maker = User.load(event.params.maker.toHexString());
  if (maker == null) {
    return;
  }
  const ERC1155OrderId = `ERC1155${event.params.nonce}`;
  let cancelledOrder = Order0x.load(ERC1155OrderId);
  if (cancelledOrder == null) {
    cancelledOrder = new Order0x(ERC1155OrderId);
    cancelledOrder.maker = maker.id;
    cancelledOrder.nonce = event.params.nonce;
    cancelledOrder.cancelled = true;
    cancelledOrder.filled = false;
    cancelledOrder.timestamp = event.block.timestamp;
    cancelledOrder.nftTokenType = `ERC1155`;
  }
  cancelledOrder.save();
}
