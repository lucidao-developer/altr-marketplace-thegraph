import { Address, BigInt, TypedMap, log } from "@graphprotocol/graph-ts";
import { ERC1155, Transaction, User } from "../../generated/schema";
import {
  pushToArray,
  removeFromArray,
  removeFromArrayByIndex,
  search
} from "./array";
import { enrichERC1155 } from "./entity";

export class Tuple<T, U, X, Y> {
  _0: T;
  _1: U;
  _2: X;
  _3: Y;

  constructor(a: T, b: U, c: X, d: Y) {
    this._0 = a;
    this._1 = b;
    this._2 = c;
    this._3 = d;
  }
}

export function createFractions(owner: Address): ERC1155 {
  const fractionsId = BigInt.fromI32(1);
  const contractAddress = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  const erc1155 = new ERC1155(`${contractAddress.toHexString()}${fractionsId}`);
  erc1155.contractAddress = contractAddress;
  erc1155.supply = BigInt.fromI32(100);
  erc1155.tokenId = fractionsId;
  erc1155.erc721 = `${contractAddress.toHexString()}2`;
  erc1155.owners = [owner.toHexString()];
  erc1155.ownersBalances = [BigInt.fromI32(10)];
  erc1155.save();
  return erc1155;
}

export function getSupplyFromPrice(price: BigInt): BigInt {
  const tiers = new TypedMap<string, Array<BigInt>>();
  tiers.set("priceLimits", [
    BigInt.fromI32(0),
    BigInt.fromI64(500000000000),
    BigInt.fromI64(1000000000000),
    BigInt.fromI64(2500000000000),
    BigInt.fromI64(4000000000000)
  ]);
  tiers.set("fractionsAmount", [
    BigInt.fromI32(500),
    BigInt.fromI32(1000),
    BigInt.fromI32(4000),
    BigInt.fromI32(6000),
    BigInt.fromI32(10000)
  ]);
  const priceLimits = tiers.get("priceLimits");
  const fractionsAmount = tiers.get("fractionsAmount");
  for (let i = 1; i < priceLimits!.length; i++) {
    const lowerBound = priceLimits![i - 1];
    const fractionsAmountToSet = fractionsAmount![i - 1];
    const upperBound = priceLimits![i];

    if (price > lowerBound && price <= upperBound) {
      return fractionsAmountToSet;
    }
  }
  const maxAmount = fractionsAmount![fractionsAmount!.length - 1];
  return maxAmount;
}

export function manageFractionsBalance(
  fromUser: User,
  toUser: User,
  transaction: Transaction,
  erc1155: ERC1155,
  erc1155Quantity: BigInt
): Tuple<User, User, Transaction, ERC1155> {
  const toUserIndex = search(erc1155.owners, toUser.id);
  if (toUserIndex == -1) {
    erc1155.owners = pushToArray(erc1155.owners, toUser.id);
    erc1155.ownersBalances = pushToArray(
      erc1155.ownersBalances,
      erc1155Quantity
    );
  } else {
    erc1155.ownersBalances![toUserIndex] = erc1155.ownersBalances![
      toUserIndex
    ].plus(erc1155Quantity);
  }

  const fromUserIndex = search(erc1155.owners, fromUser.id);
  if (fromUserIndex != -1) {
    let balance = erc1155.ownersBalances![fromUserIndex];
    balance = balance.minus(erc1155Quantity);
    if (balance.isZero()) {
      erc1155.owners = removeFromArray(erc1155.owners, fromUser.id);
      erc1155.ownersBalances = removeFromArrayByIndex(
        erc1155.ownersBalances,
        fromUserIndex
      );
    } else {
      const ownersBalances = erc1155.ownersBalances;
      ownersBalances![fromUserIndex] = balance;
      erc1155.ownersBalances = ownersBalances;
    }
  }

  transaction.erc1155 = pushToArray(transaction.erc1155, erc1155.id);
  transaction.erc1155Quantity = pushToArray(
    transaction.erc1155Quantity,
    erc1155Quantity
  );

  erc1155 = enrichERC1155(erc1155);

  let toUserErc1155Index = search(toUser.erc1155, erc1155.id);
  if (toUserErc1155Index != -1) {
    toUser.erc1155Balance![toUserErc1155Index] = toUser.erc1155Balance![
      toUserErc1155Index
    ].plus(erc1155Quantity);
  } else {
    toUser.erc1155 = pushToArray(toUser.erc1155, erc1155.id);
    toUser.erc1155Balance = pushToArray(toUser.erc1155Balance, erc1155Quantity);
  }

  let fromUserErc1155Index = search(fromUser.erc1155, erc1155.id);
  if (fromUserErc1155Index != -1) {
    let balance = fromUser.erc1155Balance![fromUserErc1155Index];
    balance = balance.minus(erc1155Quantity);
    if (balance.isZero()) {
      fromUser.erc1155 = removeFromArray(fromUser.erc1155, erc1155.id);
      fromUser.erc1155Balance = removeFromArrayByIndex(
        fromUser.erc1155Balance,
        fromUserErc1155Index
      );
    } else {
      const ownersBalances = fromUser.erc1155Balance;
      ownersBalances![fromUserErc1155Index] = balance;
      fromUser.erc1155Balance = ownersBalances;
    }
  }

  erc1155.transactionHistory = pushToArray(
    erc1155.transactionHistory,
    transaction.id
  );

  return new Tuple(fromUser, toUser, transaction, erc1155);
}
