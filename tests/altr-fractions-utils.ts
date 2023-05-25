import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  BuyoutStatusSet,
  ClosingTimeForTokenSaleSet,
  ContractSaleSet,
  Initialized,
  OperatorBurn,
  AltrFractionsRoleAdminChanged,
  AltrFractionsRoleGranted,
  AltrFractionsRoleRevoked,
  TokenSaleStatusSet,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/AltrFractions/AltrFractions"

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBuyoutStatusSetEvent(
  tokenId: BigInt,
  status: boolean
): BuyoutStatusSet {
  let buyoutStatusSetEvent = changetype<BuyoutStatusSet>(newMockEvent())

  buyoutStatusSetEvent.parameters = new Array()

  buyoutStatusSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyoutStatusSetEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return buyoutStatusSetEvent
}

export function createClosingTimeForTokenSaleSetEvent(
  tokenId: BigInt,
  closingTime: BigInt
): ClosingTimeForTokenSaleSet {
  let closingTimeForTokenSaleSetEvent = changetype<ClosingTimeForTokenSaleSet>(
    newMockEvent()
  )

  closingTimeForTokenSaleSetEvent.parameters = new Array()

  closingTimeForTokenSaleSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  closingTimeForTokenSaleSetEvent.parameters.push(
    new ethereum.EventParam(
      "closingTime",
      ethereum.Value.fromUnsignedBigInt(closingTime)
    )
  )

  return closingTimeForTokenSaleSetEvent
}

export function createContractSaleSetEvent(
  altrFractionsSale: Address
): ContractSaleSet {
  let contractSaleSetEvent = changetype<ContractSaleSet>(newMockEvent())

  contractSaleSetEvent.parameters = new Array()

  contractSaleSetEvent.parameters.push(
    new ethereum.EventParam(
      "altrFractionsSale",
      ethereum.Value.fromAddress(altrFractionsSale)
    )
  )

  return contractSaleSetEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOperatorBurnEvent(
  operator: Address,
  account: Address,
  id: BigInt,
  amount: BigInt
): OperatorBurn {
  let operatorBurnEvent = changetype<OperatorBurn>(newMockEvent())

  operatorBurnEvent.parameters = new Array()

  operatorBurnEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  operatorBurnEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  operatorBurnEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  operatorBurnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return operatorBurnEvent
}

export function createAltrFractionsRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): AltrFractionsRoleAdminChanged {
  let altrFractionsRoleAdminChangedEvent = changetype<
    AltrFractionsRoleAdminChanged
  >(newMockEvent())

  altrFractionsRoleAdminChangedEvent.parameters = new Array()

  altrFractionsRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  altrFractionsRoleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return altrFractionsRoleAdminChangedEvent
}

export function createAltrFractionsRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): AltrFractionsRoleGranted {
  let altrFractionsRoleGrantedEvent = changetype<
    AltrFractionsRoleGranted
  >(newMockEvent())

  altrFractionsRoleGrantedEvent.parameters = new Array()

  altrFractionsRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  altrFractionsRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return altrFractionsRoleGrantedEvent
}

export function createAltrFractionsRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): AltrFractionsRoleRevoked {
  let altrFractionsRoleRevokedEvent = changetype<
    AltrFractionsRoleRevoked
  >(newMockEvent())

  altrFractionsRoleRevokedEvent.parameters = new Array()

  altrFractionsRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  altrFractionsRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  altrFractionsRoleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return altrFractionsRoleRevokedEvent
}

export function createTokenSaleStatusSetEvent(
  tokenId: BigInt,
  status: i32
): TokenSaleStatusSet {
  let tokenSaleStatusSetEvent = changetype<TokenSaleStatusSet>(newMockEvent())

  tokenSaleStatusSetEvent.parameters = new Array()

  tokenSaleStatusSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenSaleStatusSetEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return tokenSaleStatusSetEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}
