import { newMockEvent } from "matchstick-as";
import { ethereum, Address } from "@graphprotocol/graph-ts";
import { OwnershipTransferred } from "../generated/AltrNftCollectionFactory/AltrNftCollectionFactory";

export function createAltrNftCollectionFactoryOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let altrNftCollectionFactoryOwnershipTransferred = changetype<
    OwnershipTransferred
  >(newMockEvent());

  altrNftCollectionFactoryOwnershipTransferred.parameters = new Array();

  altrNftCollectionFactoryOwnershipTransferred.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  );
  altrNftCollectionFactoryOwnershipTransferred.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  );

  return altrNftCollectionFactoryOwnershipTransferred;
}
