import {
  ApprovalForAll as ApprovalForAllEvent,
  AltrFractionsRoleGranted as AltrFractionsRoleGrantedEvent,
  AltrFractionsRoleRevoked as AltrFractionsRoleRevokedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent
} from "../generated/AltrFractions/AltrFractions";
import { grantRole, revokeRole } from "./utils/role-management";
import { manageFractionsBalance } from "./utils/fractions";
import {
  createTransaction,
  getOrCreateERC1155,
  getOrCreateUser
} from "./utils/entity";

export function handleApprovalForAll(event: ApprovalForAllEvent): void {}

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

  let transaction = createTransaction(event, fromUserId, toUserId);

  for (let i = 0; i < event.params.ids.length; i++) {
    let erc1155 = getOrCreateERC1155(event.address, event.params.ids[i]);
    const tuple = manageFractionsBalance(
      fromUser,
      toUser,
      transaction,
      erc1155,
      event.params.values[i]
    );

    fromUser = tuple._0;
    toUser = tuple._1;
    transaction = tuple._2;
    erc1155 = tuple._3;

    erc1155.save();
  }
  fromUser.save();
  toUser.save();
  transaction.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  const toUserId = event.params.to.toHexString();
  const fromUserId = event.params.from.toHexString();
  let erc1155 = getOrCreateERC1155(event.address, event.params.id);
  let toUser = getOrCreateUser(toUserId, event.params.to);
  let fromUser = getOrCreateUser(fromUserId, event.params.from);

  let transaction = createTransaction(
    event,
    fromUserId,
    toUserId,
    event.params.value
  );

  const tuple = manageFractionsBalance(
    fromUser,
    toUser,
    transaction,
    erc1155,
    event.params.value
  );

  fromUser = tuple._0;
  toUser = tuple._1;
  transaction = tuple._2;
  erc1155 = tuple._3;

  toUser.save();
  erc1155.save();
  transaction.save();
  fromUser.save();
}
