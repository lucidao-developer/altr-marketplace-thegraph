import {
  FailedSaleNftWithdrawn as FailedSaleNftWithdrawnEvent,
  FractionsKeptWithdrawn as FractionsKeptWithdrawnEvent,
  FractionsPurchased as FractionsPurchasedEvent,
  NewFractionsSale as NewFractionsSaleEvent,
  RoleGranted as AltrFractionsSaleRoleGrantedEvent,
  RoleRevoked as AltrFractionsSaleRoleRevokedEvent
} from "../generated/AltrFractionsSale/AltrFractionsSale";
import { ERC721, Sale } from "../generated/schema";
import { grantRole, revokeRole } from "./utils/role-management";
import { getOrCreateERC1155, getOrCreateSale } from "./utils/entity";

export function handleFailedSaleNftWithdrawn(
  event: FailedSaleNftWithdrawnEvent
): void {
  const saleId = `ERC1155${event.params.saleId}`;
  let sale = Sale.load(saleId);
  sale!.isSuccessful = false;
  sale!.save();
}

export function handleFractionsKeptWithdrawn(
  event: FractionsKeptWithdrawnEvent
): void {
  const saleId = `ERC1155${event.params.saleId}`;
  let sale = Sale.load(saleId);
  sale!.isSuccessful = true;

  sale!.save();
}

export function handleFractionsPurchased(event: FractionsPurchasedEvent): void {
  const saleId = `ERC1155${event.params.saleId}`;
  let sale = Sale.load(saleId);
  sale!.fractionsSold = sale!.fractionsSold.plus(event.params.fractionsAmount);
  sale!.save();
}

export function handleNewFractionsSale(event: NewFractionsSaleEvent): void {
  const saleId = `ERC1155${event.params.saleId}`;
  const erc1155Id = `${event.params.altrFractions.toHexString()}${
    event.params.saleId
  }`;
  const erc721Id = `${event.params.fractionsSale.nftCollection.toHexString()}${
    event.params.fractionsSale.nftId
  }`;

  let sale = getOrCreateSale(saleId, erc721Id, event);

  let erc721 = ERC721.load(erc721Id);
  erc721!.erc1155 = erc1155Id;

  let erc1155 = getOrCreateERC1155(
    event.params.altrFractions,
    event.params.saleId,
    erc721Id
  );

  sale.save();
  erc1155.save();
  erc721!.save();
}

export function handleAltrFractionsSaleRoleGranted(
  event: AltrFractionsSaleRoleGrantedEvent
): void {
  const roleName = event.params.role;
  const specialUser = event.params.account;
  grantRole(event.address, specialUser, roleName);
}

export function handleAltrFractionsSaleRoleRevoked(
  event: AltrFractionsSaleRoleRevokedEvent
): void {
  const roleId = `${event.address.toHexString()}${event.params.role.toHexString()}`;
  const specialUserId = event.params.account.toHexString();
  revokeRole(specialUserId, roleId);
}
