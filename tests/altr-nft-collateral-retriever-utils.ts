import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  RedeemRequest
} from "../generated/AltrNftCollateralRetriever/AltrNftCollateralRetriever";

export function createAltrNftCollateralRetrieverOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let altrNftCollateralRetrieverOwnershipTransferred = changetype<
    OwnershipTransferred
  >(newMockEvent());

  altrNftCollateralRetrieverOwnershipTransferred.parameters = new Array();

  altrNftCollateralRetrieverOwnershipTransferred.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  );
  altrNftCollateralRetrieverOwnershipTransferred.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  );

  return altrNftCollateralRetrieverOwnershipTransferred;
}

export function createRedeemRequest(
  collectionAddress: Address,
  from: Address,
  operator: Address,
  tokenId: BigInt
): RedeemRequest {
  let redeemRequest = changetype<RedeemRequest>(newMockEvent());
  redeemRequest.parameters = new Array();
  redeemRequest.parameters.push(
    new ethereum.EventParam(
      "collectionAddress",
      ethereum.Value.fromAddress(collectionAddress)
    )
  );
  redeemRequest.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  );
  redeemRequest.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  );
  redeemRequest.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  );
  return redeemRequest;
}
