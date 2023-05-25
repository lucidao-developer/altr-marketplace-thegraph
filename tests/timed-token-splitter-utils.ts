import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import {
  TokensSellerReleased,
  TokensReleased
} from "../generated/templates/TimedTokenSplitter/TimedTokenSplitter";

export function createTokensSellerReleasedEvent(
  seller: Address,
  saleId: BigInt,
  sellerAmount: BigInt
): TokensSellerReleased {
  let timedTokenSplitterTokensSellerReleased = changetype<TokensSellerReleased>(
    newMockEvent()
  );

  timedTokenSplitterTokensSellerReleased.parameters = new Array();

  timedTokenSplitterTokensSellerReleased.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  );

  timedTokenSplitterTokensSellerReleased.parameters.push(
    new ethereum.EventParam(
      "saleContract",
      ethereum.Value.fromAddress(
        Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a")
      )
    )
  );

  timedTokenSplitterTokensSellerReleased.parameters.push(
    new ethereum.EventParam("saleId", ethereum.Value.fromUnsignedBigInt(saleId))
  );

  timedTokenSplitterTokensSellerReleased.parameters.push(
    new ethereum.EventParam(
      "sellerAmount",
      ethereum.Value.fromUnsignedBigInt(sellerAmount)
    )
  );

  return timedTokenSplitterTokensSellerReleased;
}

export function createTokensReleasedEvent(
  users: Address[],
  tokenId: BigInt,
  amounts: BigInt[],
  fractionsPrice: BigInt
): TokensReleased {
  let timedTokenSplitterTokensReleased = changetype<TokensReleased>(
    newMockEvent()
  );

  timedTokenSplitterTokensReleased.parameters = new Array();

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam("users", ethereum.Value.fromAddressArray(users))
  );

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam(
      "redemptionToken",
      ethereum.Value.fromAddress(
        Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a")
      )
    )
  );

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam(
      "token",
      ethereum.Value.fromAddress(
        Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a")
      )
    )
  );

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  );

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  );

  timedTokenSplitterTokensReleased.parameters.push(
    new ethereum.EventParam(
      "fractionsPrice",
      ethereum.Value.fromUnsignedBigInt(fractionsPrice)
    )
  );

  return timedTokenSplitterTokensReleased;
}
