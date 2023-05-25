import {
  BuyoutExecuted as BuyoutExecutedEvent,
  BuyoutParamsSet as BuyoutParamsSetEvent,
  BuyoutRequested as BuyoutRequestedEvent,
  AltrFractionsBuyoutRoleGranted as AltrFractionsBuyoutRoleGrantedEvent,
  AltrFractionsBuyoutRoleRevoked as AltrFractionsBuyoutRoleRevokedEvent
} from "../generated/AltrFractionsBuyout/AltrFractionsBuyout";
import { Buyout, Sale } from "../generated/schema";
import { grantRole, revokeRole } from "./utils/role-management";

export function handleBuyoutExecuted(event: BuyoutExecutedEvent): void {
  const buyoutId = event.params.buyoutId.toHexString();
  let buyout = Buyout.load(buyoutId);
  if (buyout == null) {
    buyout = new Buyout(buyoutId);
    buyout.buyoutId = event.params.buyoutId;
    buyout.erc1155 = `${event.params.Fractions}${event.params.tokenId}`;
    buyout.initiator = event.params.executor.toHexString();
  }
  buyout.isSuccessful = true;
  buyout.save();
}

export function handleBuyoutParamsSet(event: BuyoutParamsSetEvent): void {
  const buyoutId = event.params.buyoutId.toHexString();
  let buyout = Buyout.load(buyoutId);
  buyout!.openingTime = event.params.buyout.openingTime;
  buyout!.closingTime = event.params.buyout.closingTime;
  buyout!.buyoutPrice = event.params.buyout.buyoutPrice;
  buyout!.buyoutToken = event.params.buyout.buyoutToken;
  buyout!.buyoutTokenManager = event.params.buyout.buyoutTokenManager;
  buyout!.save();
}

export function handleBuyoutRequested(event: BuyoutRequestedEvent): void {
  const buyoutId = event.params.buyoutId.toHexString();
  let buyout = new Buyout(buyoutId);
  buyout.buyoutId = event.params.buyoutId;
  const sale = Sale.load(`ERC1155${event.params.saleId}`)
  buyout.erc1155 = sale!.erc1155!;
  buyout.initiator = event.params.initiator.toHexString();
  buyout.isSuccessful = false;
  buyout.save();
}

export function handleAltrFractionsBuyoutRoleGranted(
  event: AltrFractionsBuyoutRoleGrantedEvent
): void {
  const roleName = event.params.role;
  const specialUser = event.params.account;
  grantRole(event.address, specialUser, roleName);
}

export function handleAltrFractionsBuyoutRoleRevoked(
  event: AltrFractionsBuyoutRoleRevokedEvent
): void {
  const roleId = `${event.address.toHexString()}${event.params.role.toHexString()}`;
  const specialUserId = event.params.account.toHexString();
  revokeRole(specialUserId, roleId);
}
