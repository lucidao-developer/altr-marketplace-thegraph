import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DiscountSet,
  AltrLicenseManagerOwnershipTransferred,
  StakedTokensForOracleEligibilitySet,
  StakingServicePidSet,
  StakingServiceSet
} from "../generated/AltrLicenseManager/AltrLicenseManager"

export function createDiscountSetEvent(
  user: Address,
  discount: BigInt
): DiscountSet {
  let discountSetEvent = changetype<DiscountSet>(newMockEvent())

  discountSetEvent.parameters = new Array()

  discountSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  discountSetEvent.parameters.push(
    new ethereum.EventParam(
      "discount",
      ethereum.Value.fromUnsignedBigInt(discount)
    )
  )

  return discountSetEvent
}

export function createAltrLicenseManagerOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): AltrLicenseManagerOwnershipTransferred {
  let altrLicenseManagerOwnershipTransferredEvent = changetype<
    AltrLicenseManagerOwnershipTransferred
  >(newMockEvent())

  altrLicenseManagerOwnershipTransferredEvent.parameters = new Array()

  altrLicenseManagerOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  altrLicenseManagerOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return altrLicenseManagerOwnershipTransferredEvent
}

export function createStakedTokensForOracleEligibilitySetEvent(
  amount: BigInt
): StakedTokensForOracleEligibilitySet {
  let stakedTokensForOracleEligibilitySetEvent = changetype<
    StakedTokensForOracleEligibilitySet
  >(newMockEvent())

  stakedTokensForOracleEligibilitySetEvent.parameters = new Array()

  stakedTokensForOracleEligibilitySetEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return stakedTokensForOracleEligibilitySetEvent
}

export function createStakingServicePidSetEvent(
  pid: BigInt
): StakingServicePidSet {
  let stakingServicePidSetEvent = changetype<StakingServicePidSet>(
    newMockEvent()
  )

  stakingServicePidSetEvent.parameters = new Array()

  stakingServicePidSetEvent.parameters.push(
    new ethereum.EventParam("pid", ethereum.Value.fromUnsignedBigInt(pid))
  )

  return stakingServicePidSetEvent
}

export function createStakingServiceSetEvent(
  stakingService: Address,
  stakingServicePid: BigInt
): StakingServiceSet {
  let stakingServiceSetEvent = changetype<StakingServiceSet>(newMockEvent())

  stakingServiceSetEvent.parameters = new Array()

  stakingServiceSetEvent.parameters.push(
    new ethereum.EventParam(
      "stakingService",
      ethereum.Value.fromAddress(stakingService)
    )
  )
  stakingServiceSetEvent.parameters.push(
    new ethereum.EventParam(
      "stakingServicePid",
      ethereum.Value.fromUnsignedBigInt(stakingServicePid)
    )
  )

  return stakingServiceSetEvent
}
