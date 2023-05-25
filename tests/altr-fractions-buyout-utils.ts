import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  BuyoutExecuted,
  BuyoutMinFractionsSet,
  BuyoutOpenTimePeriodSet,
  BuyoutParamsSet,
  BuyoutRequested,
  AltrFractionsBuyoutRoleGranted,
  AltrFractionsBuyoutRoleRevoked
} from "../generated/AltrFractionsBuyout/AltrFractionsBuyout";

export function createBuyoutExecutedEvent(
  buyoutId: BigInt,
  executor: Address,
  boughtOutFractions: BigInt,
  buyoutAmount: BigInt,
  fractions: Address,
  tokenId: BigInt
): BuyoutExecuted {
  let buyoutExecutedEvent = changetype<BuyoutExecuted>(newMockEvent());

  buyoutExecutedEvent.parameters = new Array();

  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutId",
      ethereum.Value.fromUnsignedBigInt(buyoutId)
    )
  );
  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam("executor", ethereum.Value.fromAddress(executor))
  );
  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "boughtOutFractions",
      ethereum.Value.fromUnsignedBigInt(boughtOutFractions)
    )
  );
  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutAmount",
      ethereum.Value.fromUnsignedBigInt(buyoutAmount)
    )
  );
  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam("Fractions", ethereum.Value.fromAddress(fractions))
  );
  buyoutExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  );

  return buyoutExecutedEvent;
}

export function createBuyoutMinFractionsSetEvent(
  buyoutMinFractions: BigInt
): BuyoutMinFractionsSet {
  let buyoutMinFractionsSetEvent = changetype<BuyoutMinFractionsSet>(
    newMockEvent()
  );

  buyoutMinFractionsSetEvent.parameters = new Array();

  buyoutMinFractionsSetEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutMinFractions",
      ethereum.Value.fromUnsignedBigInt(buyoutMinFractions)
    )
  );

  return buyoutMinFractionsSetEvent;
}

export function createBuyoutOpenTimePeriodSetEvent(
  buyoutOpenTimePeriod: BigInt
): BuyoutOpenTimePeriodSet {
  let buyoutOpenTimePeriodSetEvent = changetype<BuyoutOpenTimePeriodSet>(
    newMockEvent()
  );

  buyoutOpenTimePeriodSetEvent.parameters = new Array();

  buyoutOpenTimePeriodSetEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutOpenTimePeriod",
      ethereum.Value.fromUnsignedBigInt(buyoutOpenTimePeriod)
    )
  );

  return buyoutOpenTimePeriodSetEvent;
}

export function createBuyoutParamsSetEvent(
  buyoutId: BigInt,
  buyout: ethereum.Tuple
): BuyoutParamsSet {
  let buyoutParamsSetEvent = changetype<BuyoutParamsSet>(newMockEvent());

  buyoutParamsSetEvent.parameters = new Array();

  buyoutParamsSetEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutId",
      ethereum.Value.fromUnsignedBigInt(buyoutId)
    )
  );
  buyoutParamsSetEvent.parameters.push(
    new ethereum.EventParam("buyout", ethereum.Value.fromTuple(buyout))
  );

  return buyoutParamsSetEvent;
}

export function createBuyoutRequestedEvent(
  saleId: BigInt,
  initiator: Address,
  buyoutId: BigInt
): BuyoutRequested {
  let buyoutRequestedEvent = changetype<BuyoutRequested>(newMockEvent());

  buyoutRequestedEvent.parameters = new Array();

  buyoutRequestedEvent.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  );
  buyoutRequestedEvent.parameters.push(
    new ethereum.EventParam("initiator", ethereum.Value.fromAddress(initiator))
  );
  buyoutRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "buyoutId",
      ethereum.Value.fromUnsignedBigInt(buyoutId)
    )
  );

  return buyoutRequestedEvent;
}

export function createAltrFractionsBuyoutRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): AltrFractionsBuyoutRoleGranted {
  let altrFractionsBuyoutRoleGrantedEvent = changetype<
    AltrFractionsBuyoutRoleGranted
  >(newMockEvent());

  altrFractionsBuyoutRoleGrantedEvent.parameters = new Array();

  altrFractionsBuyoutRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  altrFractionsBuyoutRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  altrFractionsBuyoutRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  );

  return altrFractionsBuyoutRoleGrantedEvent;
}

export function createAltrFractionsBuyoutRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): AltrFractionsBuyoutRoleRevoked {
  let altrFractionsBuyoutRoleRevokedEvent = changetype<
    AltrFractionsBuyoutRoleRevoked
  >(newMockEvent());

  altrFractionsBuyoutRoleRevokedEvent.parameters = new Array();

  altrFractionsBuyoutRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  altrFractionsBuyoutRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  altrFractionsBuyoutRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  );

  return altrFractionsBuyoutRoleRevokedEvent;
}
