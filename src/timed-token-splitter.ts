import { Sale } from "../generated/schema";
import {
  TokensReleased,
  TokensSellerReleased
} from "../generated/templates/TimedTokenSplitter/TimedTokenSplitter";

export function handleTokensSellerReleased(event: TokensSellerReleased): void {
  const saleId = `ERC1155${event.params.saleId}`;
  let sale = Sale.load(saleId);
  sale!.isSuccessful = true;
  sale!.sellerReleased = true;
  sale!.save();
}

export function handleTokensReleased(event: TokensReleased): void {
  const saleId = `ERC1155${event.params.tokenId}`;
  let sale = Sale.load(saleId);
  sale!.isSuccessful = false;
  sale!.save();
}
