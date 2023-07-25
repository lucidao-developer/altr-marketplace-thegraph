import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  ERC1155,
  ERC721,
  Role,
  Sale,
  SpecialUser,
  Transaction,
  User
} from "../../generated/schema";
import { NewFractionsSale } from "../../generated/AltrFractionsSale/AltrFractionsSale";
import { getSupplyFromPrice } from "./fractions";

export function getOrCreateUser(userId: string, address: Address): User {
  let user = User.load(userId);
  if (user != null) {
    return user;
  }
  user = new User(userId);
  user.address = address;
  user.allowed = false;
  return user;
}

export function getOrCreateSpecialUser(
  userId: string,
  address: Address
): SpecialUser {
  let user = SpecialUser.load(userId);
  if (user != null) {
    return user;
  }
  user = new SpecialUser(userId);
  user.address = address;
  user.allowed = false;
  return user;
}

export function getOrCreateRole(contract: Address, roleName: Bytes): Role {
  const roleId = `${contract.toHexString()}${roleName.toHexString()}`;
  let role = Role.load(roleId);
  if (role != null) {
    return role;
  }
  role = new Role(roleId);
  role.contract = contract;
  role.name = roleName;
  return role;
}

export function getOrCreateSale(
  saleId: string,
  erc721Id: string,
  event: NewFractionsSale
): Sale {
  let sale = Sale.load(saleId);
  if (sale == null) {
    sale = new Sale(saleId);
  }
  sale.openingTime = event.params.fractionsSale.openingTime;
  sale.closingTime = event.params.fractionsSale.closingTime;
  sale.saleId = event.params.saleId;
  sale.isSuccessful = false;
  sale.seller = event.params.fractionsSale.initiator.toHexString();
  sale.fractionPrice = event.params.fractionsSale.fractionPrice;
  sale.fractionsAmount = event.params.fractionsSale.fractionsAmount;
  sale.fractionsSold = event.params.fractionsSale.fractionsSold;
  sale.erc721 = erc721Id;

  return sale;
}

export function getOrCreateERC721(
  contractAddress: Address,
  tokenId: BigInt
): ERC721 {
  const erc721Id = `${contractAddress.toHexString()}${tokenId}`;
  let erc721 = ERC721.load(erc721Id);
  if (erc721 == null) {
    erc721 = new ERC721(erc721Id);
    erc721.contractAddress = contractAddress;
    erc721.tokenId = tokenId;
  }
  return erc721;
}

export function getOrCreateERC1155(
  fractionsContractAddress: Address,
  tokenId: BigInt,
  erc721Id: string = "0"
): ERC1155 {
  const erc1155Id = `${fractionsContractAddress.toHexString()}${tokenId}`;
  let erc1155 = ERC1155.load(erc1155Id);
  if (erc1155 == null) {
    erc1155 = new ERC1155(erc1155Id);
    erc1155.contractAddress = fractionsContractAddress;
    erc1155.tokenId = tokenId;
  }
  if (erc721Id !== "0") {
    erc1155.erc721 = erc721Id;
  }
  return erc1155;
}

export function enrichERC1155(erc1155: ERC1155): ERC1155 {
  let fractionsSale = Sale.load(`ERC1155${erc1155.tokenId}`);
  if (fractionsSale != null) {
    erc1155.erc721 = fractionsSale.erc721;
    erc1155.supply = getSupplyFromPrice(
      fractionsSale.fractionPrice.times(fractionsSale.fractionsAmount)
    );
    fractionsSale.erc1155 = erc1155.id;
    fractionsSale.save();
  }
  return erc1155;
}

export function createTransaction<T extends ethereum.Event>(
  event: T,
  from: string,
  to: string,
  quantity: BigInt = BigInt.fromI32(0)
): Transaction {
  let transaction = new Transaction(event.transaction.hash.toHexString());
  transaction.transactionId = event.transaction.hash;
  transaction.block = event.block.number;
  transaction.from = from;
  transaction.to = to;
  transaction.timestamp = event.block.timestamp;
  if (quantity !== BigInt.fromI32(0)) {
    transaction.erc1155Quantity = [quantity];
  }
  return transaction;
}
