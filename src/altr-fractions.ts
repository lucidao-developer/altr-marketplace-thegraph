import { Address } from "@graphprotocol/graph-ts";
import {
  ApprovalForAll as ApprovalForAllEvent,
  AltrFractionsRoleGranted as AltrFractionsRoleGrantedEvent,
  AltrFractionsRoleRevoked as AltrFractionsRoleRevokedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent
} from "../generated/AltrFractions/AltrFractions";
import { ERC1155, Transaction, Sale } from "../generated/schema";
import { grantRole, revokeRole } from "./utils/role-management";
import { getSupplyFromPrice } from "./utils/fractions";
import { getOrCreateUser } from "./utils/user";
import { searchString } from "./utils/array";



export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  // if (event.params.approved) {
  //   approvalForAllERC1155True(event);
  // } else {
  //   approvalForAllERC1155False(event);
  // }
}

export function handleAltrFractionsRoleGranted(
  event: AltrFractionsRoleGrantedEvent
): void {
  const roleName = event.params.role;
  const specialUser = event.params.account;
  grantRole(event.address, specialUser, roleName);
}

export function handleAltrFractionsRoleRevoked(
  event: AltrFractionsRoleRevokedEvent
): void {
  const roleId = `${event.address.toHexString()}${event.params.role.toHexString()}`;
  const specialUserId = event.params.account.toHexString();
  revokeRole(specialUserId, roleId);
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  const fromUserId = event.params.from.toHexString();
  let fromUser = getOrCreateUser(fromUserId, event.params.from);
  const toUserId = event.params.to.toHexString();
  let toUser = getOrCreateUser(toUserId, event.params.to);

  let transaction = new Transaction(event.transaction.hash.toHexString());
  transaction.transactionId = event.transaction.hash;
  transaction.block = event.block.number;
  transaction.from = event.params.from.toHexString();
  transaction.to = event.params.to.toHexString();
  transaction.erc1155Quantity = event.params.values;
  transaction.timestamp = event.block.timestamp;

  for (let i = 0; i < event.params.ids.length; i++) {
    const ERC1155Id = `${event.address.toHexString()}${event.params.ids[i]}`;
    let erc1155 = ERC1155.load(ERC1155Id);
    if (erc1155 == null) {
      erc1155 = new ERC1155(ERC1155Id);
      erc1155.contractAddress = event.address;
      erc1155.tokenId = event.params.ids[i];
      let fractionsSale = Sale.load(`ERC1155${event.params.ids[i]}`);
      if (fractionsSale != null) {
        erc1155.erc721 = fractionsSale.erc721;
        erc1155.supply = getSupplyFromPrice(
          fractionsSale.fractionPrice.times(fractionsSale.fractionsAmount)
        );
        fractionsSale.erc1155 = ERC1155Id
        fractionsSale.save()
      }
    }
    let owners = erc1155.owners ? erc1155.owners : [];
    let ownersBalances = erc1155.ownersBalances ? erc1155.ownersBalances : [];
    const toUserIndex = searchString(owners!, toUserId);
    if (toUserIndex == -1) {
      owners!.push(toUserId);
      ownersBalances!.push(event.params.values[i]);
    } else {
      ownersBalances![toUserIndex] = ownersBalances![toUserIndex].plus(event.params.values[i]);
    }
    const fromUserIndex = searchString(owners!, fromUserId);
    if (fromUserIndex != -1) {
      ownersBalances![fromUserIndex] = ownersBalances![fromUserIndex].minus(event.params.values[i]);
      if (ownersBalances![fromUserIndex].isZero()) {
        ownersBalances!.splice(fromUserIndex, 1);
        owners!.splice(fromUserIndex, 1);
      }
    }
    erc1155.owners = owners;
    erc1155.ownersBalances = ownersBalances;

    let erc1155Transaction = transaction.erc1155 ? transaction.erc1155 : [];
    erc1155Transaction!.push(erc1155.id);
    transaction.erc1155 = erc1155Transaction;

    let toUserErc1155 = toUser.erc1155 ? toUser.erc1155 : [];
    let fromUserErc1155 = fromUser.erc1155 ? fromUser.erc1155 : [];
    let toUserErc1155Balance = toUser.erc1155Balance ? toUser.erc1155Balance : [];
    let fromUserErc1155Balance = fromUser.erc1155Balance ? fromUser.erc1155Balance : [];
    let toUserErc1155Index = searchString(toUserErc1155!, ERC1155Id);
    let fromUserErc1155Index = searchString(fromUserErc1155!, ERC1155Id);

    if (toUserErc1155Index != -1) {
      toUserErc1155Balance![toUserErc1155Index] = toUserErc1155Balance![toUserErc1155Index].plus(event.params.values[i]);
    } else {
      toUserErc1155!.push(erc1155.id);
      toUserErc1155Balance!.push(event.params.values[i]);
    }

    if (fromUserErc1155Index != -1) {
      fromUserErc1155Balance![fromUserErc1155Index] = fromUserErc1155Balance![fromUserErc1155Index].minus(event.params.values[i]);
      if (fromUserErc1155Balance![fromUserErc1155Index].isZero()) {
        fromUserErc1155Balance!.splice(fromUserErc1155Index, 1);
        fromUserErc1155!.splice(fromUserErc1155Index, 1);
      }
    }

    toUser.erc1155 = toUserErc1155;
    toUser.erc1155Balance = toUserErc1155Balance;

    fromUser.erc1155Balance = fromUserErc1155Balance
    fromUser.erc1155 = fromUserErc1155

    let transactionHistory = erc1155.transactionHistory
      ? erc1155.transactionHistory
      : [];
    transactionHistory!.push(transaction.id);
    erc1155.transactionHistory = transactionHistory;

    erc1155.save();
  }
  fromUser.save();
  toUser.save();
  transaction.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  const ERC1155Id = `${event.address.toHexString()}${event.params.id}`;
  const toUserId = event.params.to.toHexString();
  const fromUserId = event.params.from.toHexString();
  let erc1155 = ERC1155.load(ERC1155Id);
  let toUser = getOrCreateUser(toUserId, event.params.to);
  let fromUser = getOrCreateUser(fromUserId, event.params.from);

  let transaction = new Transaction(event.transaction.hash.toHexString());
  transaction.transactionId = event.transaction.hash;
  transaction.block = event.block.number;
  transaction.from = event.params.from.toHexString();
  transaction.to = event.params.to.toHexString();
  transaction.erc1155Quantity = [event.params.value];
  transaction.timestamp = event.block.timestamp;

  if (event.params.from == Address.zero() || erc1155 == null) {
    erc1155 = new ERC1155(ERC1155Id);
    erc1155.contractAddress = event.address;
    erc1155.tokenId = event.params.id;
  }

  let owners = erc1155.owners ? erc1155.owners : [];
  let ownersBalances = erc1155.ownersBalances ? erc1155.ownersBalances : [];
  const toUserIndex = searchString(owners!, toUserId);
  if (toUserIndex == -1) {
    owners!.push(toUserId);
    ownersBalances!.push(event.params.value);
  } else {
    ownersBalances![toUserIndex] = ownersBalances![toUserIndex].plus(event.params.value);
  }
  const fromUserIndex = searchString(owners!, fromUserId);
  if (fromUserIndex != -1) {
    ownersBalances![fromUserIndex] = ownersBalances![fromUserIndex].minus(event.params.value);
    if (ownersBalances![fromUserIndex].isZero()) {
      ownersBalances!.splice(fromUserIndex, 1);
      owners!.splice(fromUserIndex, 1)
    }
  }
  erc1155.owners = owners;
  erc1155.ownersBalances = ownersBalances;


  let erc1155Transaction = transaction.erc1155 ? transaction.erc1155 : [];
  erc1155Transaction!.push(erc1155.id);
  transaction.erc1155 = erc1155Transaction;

  let fractionsSale = Sale.load(`ERC1155${event.params.id}`);
  if (fractionsSale != null) {
    erc1155.erc721 = fractionsSale.erc721;
    erc1155.supply = getSupplyFromPrice(
      fractionsSale.fractionPrice.times(fractionsSale.fractionsAmount)
    );
    fractionsSale.erc1155 = ERC1155Id;
    fractionsSale.save();
  }

  let toUserErc1155 = toUser.erc1155 ? toUser.erc1155 : [];
  let toUserErc1155Balance = toUser.erc1155Balance ? toUser.erc1155Balance : [];
  let toUserErc1155Index = searchString(toUserErc1155!, ERC1155Id);
  if (toUserErc1155Index != -1) {
    toUserErc1155Balance![toUserErc1155Index] = toUserErc1155Balance![toUserErc1155Index].plus(event.params.value);
  } else {
    toUserErc1155!.push(erc1155.id);
    toUserErc1155Balance!.push(event.params.value);
  }

  let fromUserErc1155 = fromUser.erc1155 ? fromUser.erc1155 : [];
  let fromUserErc1155Balance = fromUser.erc1155Balance ? fromUser.erc1155Balance : [];
  let fromUserErc1155Index = searchString(fromUserErc1155!, ERC1155Id);

  if (fromUserErc1155Index != -1) {
    fromUserErc1155Balance![fromUserErc1155Index] = fromUserErc1155Balance![fromUserErc1155Index].minus(event.params.value);
    if (fromUserErc1155Balance![fromUserErc1155Index].isZero()) {
      fromUserErc1155Balance!.splice(fromUserErc1155Index, 1);
      fromUserErc1155!.splice(fromUserErc1155Index, 1);
    }
  }

  toUser.erc1155 = toUserErc1155;
  toUser.erc1155Balance = toUserErc1155Balance;

  fromUser.erc1155Balance = fromUserErc1155Balance
  fromUser.erc1155 = fromUserErc1155

  let transactionHistory = erc1155.transactionHistory
    ? erc1155.transactionHistory
    : [];
  transactionHistory!.push(transaction.id);
  erc1155.transactionHistory = transactionHistory;

  toUser.save();
  erc1155.save();
  transaction.save();
  fromUser.save();
}
