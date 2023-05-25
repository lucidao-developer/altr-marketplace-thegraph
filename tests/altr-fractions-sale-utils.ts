import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AllowListSet,
  FailedSaleNftWithdrawn,
  FeeManagerSet,
  FractionsBuyoutAddressSet,
  FractionsKeptWithdrawn,
  FractionsPurchased,
  Initialized,
  NewFractionsSale,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TiersSet
} from "../generated/AltrFractionsSale/AltrFractionsSale"

export function createAllowListSetEvent(allowList: Address): AllowListSet {
  let allowListSetEvent = changetype<AllowListSet>(newMockEvent())

  allowListSetEvent.parameters = new Array()

  allowListSetEvent.parameters.push(
    new ethereum.EventParam("allowList", ethereum.Value.fromAddress(allowList))
  )

  return allowListSetEvent
}

export function createFailedSaleNftWithdrawnEvent(
  saleId: BigInt,
  beneficiary: Address,
  nftCollection: Address,
  nftId: BigInt
): FailedSaleNftWithdrawn {
  let failedSaleNftWithdrawnEvent = changetype<FailedSaleNftWithdrawn>(
    newMockEvent()
  )

  failedSaleNftWithdrawnEvent.parameters = new Array()

  failedSaleNftWithdrawnEvent.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  )
  failedSaleNftWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  failedSaleNftWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "nftCollection",
      ethereum.Value.fromAddress(nftCollection)
    )
  )
  failedSaleNftWithdrawnEvent.parameters.push(
    new ethereum.EventParam("nftId", ethereum.Value.fromUnsignedBigInt(nftId))
  )

  return failedSaleNftWithdrawnEvent
}

export function createFeeManagerSetEvent(feeManager: Address): FeeManagerSet {
  let feeManagerSetEvent = changetype<FeeManagerSet>(newMockEvent())

  feeManagerSetEvent.parameters = new Array()

  feeManagerSetEvent.parameters.push(
    new ethereum.EventParam(
      "feeManager",
      ethereum.Value.fromAddress(feeManager)
    )
  )

  return feeManagerSetEvent
}

export function createFractionsBuyoutAddressSetEvent(
  fractionsBuyout: Address
): FractionsBuyoutAddressSet {
  let fractionsBuyoutAddressSetEvent = changetype<FractionsBuyoutAddressSet>(
    newMockEvent()
  )

  fractionsBuyoutAddressSetEvent.parameters = new Array()

  fractionsBuyoutAddressSetEvent.parameters.push(
    new ethereum.EventParam(
      "fractionsBuyout",
      ethereum.Value.fromAddress(fractionsBuyout)
    )
  )

  return fractionsBuyoutAddressSetEvent
}

export function createFractionsKeptWithdrawnEvent(
  saleId: BigInt,
  beneficiary: Address,
  amount: BigInt
): FractionsKeptWithdrawn {
  let fractionsKeptWithdrawnEvent = changetype<FractionsKeptWithdrawn>(
    newMockEvent()
  )

  fractionsKeptWithdrawnEvent.parameters = new Array()

  fractionsKeptWithdrawnEvent.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  )
  fractionsKeptWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  fractionsKeptWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fractionsKeptWithdrawnEvent
}

export function createFractionsPurchasedEvent(
  saleId: BigInt,
  beneficiary: Address,
  fractionsAmount: BigInt
): FractionsPurchased {
  let fractionsPurchasedEvent = changetype<FractionsPurchased>(newMockEvent())

  fractionsPurchasedEvent.parameters = new Array()

  fractionsPurchasedEvent.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  )
  fractionsPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  fractionsPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "fractionsAmount",
      ethereum.Value.fromUnsignedBigInt(fractionsAmount)
    )
  )

  return fractionsPurchasedEvent
}

export function createInitializedEvent(
  version: i32
): Initialized {
  let altrFractionsSaleInitializedEvent = changetype<
    Initialized
  >(newMockEvent())

  altrFractionsSaleInitializedEvent.parameters = new Array()

  altrFractionsSaleInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return altrFractionsSaleInitializedEvent
}

export function createNewFractionsSaleEvent(
  saleId: BigInt,
  fractionsSale: ethereum.Tuple
): NewFractionsSale {
  let newFractionsSaleEvent = changetype<NewFractionsSale>(newMockEvent())

  newFractionsSaleEvent.parameters = new Array()

  newFractionsSaleEvent.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  )
  newFractionsSaleEvent.parameters.push(
    new ethereum.EventParam(
      "fractionsSale",
      ethereum.Value.fromTuple(fractionsSale)
    )
  )

  return newFractionsSaleEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let altrFractionsSaleRoleAdminChangedEvent = changetype<
    RoleAdminChanged
  >(newMockEvent())

  altrFractionsSaleRoleAdminChangedEvent.parameters = new Array()

  altrFractionsSaleRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsSaleRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  altrFractionsSaleRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return altrFractionsSaleRoleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let altrFractionsSaleRoleGrantedEvent = changetype<
    RoleGranted
  >(newMockEvent())

  altrFractionsSaleRoleGrantedEvent.parameters = new Array()

  altrFractionsSaleRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsSaleRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  altrFractionsSaleRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return altrFractionsSaleRoleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let altrFractionsSaleRoleRevokedEvent = changetype<
    RoleRevoked
  >(newMockEvent())

  altrFractionsSaleRoleRevokedEvent.parameters = new Array()

  altrFractionsSaleRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsSaleRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  altrFractionsSaleRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return altrFractionsSaleRoleRevokedEvent
}

export function createTiersSetEvent(
  priceLimits: Array<BigInt>,
  fractionsAmounts: Array<BigInt>
): TiersSet {
  let tiersSetEvent = changetype<TiersSet>(newMockEvent())

  tiersSetEvent.parameters = new Array()

  tiersSetEvent.parameters.push(
    new ethereum.EventParam(
      "priceLimits",
      ethereum.Value.fromUnsignedBigIntArray(priceLimits)
    )
  )
  tiersSetEvent.parameters.push(
    new ethereum.EventParam(
      "fractionsAmounts",
      ethereum.Value.fromUnsignedBigIntArray(fractionsAmounts)
    )
  )

  return tiersSetEvent
}
