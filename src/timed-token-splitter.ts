import { ERC1155, Sale, User } from "../generated/schema";
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
  for (let i = 0; i < event.params.users.length; i++) {
    let user = User.load(event.params.users[i].toHexString());
    let erc1155Index = -1;
    for (let j = 0; j < user!.erc1155!.length; j++) {
      if (user!.erc1155![j] == sale!.erc1155) {
        erc1155Index = j;
        break;
      }
    }
    if (erc1155Index != -1) {
      let erc1155User = user!.erc1155;
      erc1155User!.splice(erc1155Index, 1);
      user!.erc1155 = erc1155User;

      let erc1155Balance = user!.erc1155Balance;
      erc1155Balance!.splice(erc1155Index, 1);
      user!.erc1155Balance = erc1155Balance;
      user!.save();
    }

    let erc1155 = ERC1155.load(sale!.erc1155!);
    let erc1155Owners = erc1155!.owners;
    let ownerIndex = -1;
    for (let j = 0; j < erc1155Owners!.length; j++) {
      if (erc1155Owners![j] == user!.id) {
        ownerIndex = j;
        break;
      }
    }
    if (ownerIndex != -1) {
      erc1155Owners!.splice(ownerIndex, 1);
      erc1155!.owners = erc1155Owners;
      erc1155!.save();
    }
  }
}
