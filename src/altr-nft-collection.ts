import { ERC721 } from "../generated/schema";
import {
  Approval,
  ApprovalForAll,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/templates/AltrNftCollection/AltrNftCollection";
import { grantRole, revokeRole } from "./utils/role-management";
import {
  createTransaction,
  getOrCreateERC721,
  getOrCreateUser
} from "./utils/entity";
import { pushToArray, removeFromArray } from "./utils/array";
import {
  approvalForAllERC721False,
  approvalForAllERC721True
} from "./utils/approval";

export function handleApproval(event: Approval): void {
  const ERC721Id = `${event.address.toHexString()}${event.params.tokenId}`;
  const approvedUserId = event.params.approved.toHexString();
  let erc721 = ERC721.load(ERC721Id);
  let approvedUser = getOrCreateUser(approvedUserId, event.params.approved);

  erc721!.approved = approvedUser.id;

  approvedUser.save();
  erc721!.save();
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  if (event.params.approved) {
    approvalForAllERC721True(event);
  } else {
    approvalForAllERC721False(event);
  }
}

export function handleTransfer(event: Transfer): void {
  const ERC721Id = `${event.address.toHexString()}${event.params.tokenId}`;
  const toUserId = event.params.to.toHexString();
  const fromUserId = event.params.from.toHexString();
  let erc721 = getOrCreateERC721(event.address, event.params.tokenId);
  let toUser = getOrCreateUser(toUserId, event.params.to);
  let fromUser = getOrCreateUser(fromUserId, event.params.from);

  let transaction = createTransaction(event, fromUserId, toUserId);

  erc721.owner = toUserId;
  erc721.approved = null;
  erc721.operators = [];
  transaction.erc721 = erc721.id;

  toUser.erc721Owned = pushToArray(toUser.erc721Owned, erc721.id);

  if (fromUser.erc721Owned != null) {
    fromUser.erc721Owned = removeFromArray(fromUser.erc721Owned!, ERC721Id);
  }

  erc721.transactionHistory = pushToArray(
    erc721.transactionHistory,
    transaction.id
  );

  toUser.save();
  fromUser.save();
  erc721.save();
  transaction.save();
}

export function handleRoleGranted(event: RoleGranted): void {
  const roleName = event.params.role;
  const specialUser = event.params.account;
  grantRole(event.address, specialUser, roleName);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const roleId = `${event.address.toHexString()}${event.params.role.toHexString()}`;
  const specialUserId = event.params.account.toHexString();
  revokeRole(specialUserId, roleId);
}
