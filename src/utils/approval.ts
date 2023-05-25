import { ApprovalForAll } from "../../generated/AltrFractions/AltrFractions";
import { ApprovalForAll as ApprovalForAllERC721 } from "../../generated/templates/AltrNftCollection/AltrNftCollection";
import { ERC1155, ERC721 } from "../../generated/schema";
import { removeFromArray } from "./array";

export function approvalForAllERC721True(
  event: ApprovalForAllERC721
): void {
  let i = 1;
  while (true) {
    const ERC721Id = `${event.address.toHexString()}${i}`;
    let erc721 = ERC721.load(ERC721Id);
    if (erc721 == null) {
      return;
    }
    let operators = erc721.operators || [];
    operators!.push(event.params.operator.toHexString());
    erc721.operators = operators;
    erc721.save();
    i++;
  }
}

export function approvalForAllERC721False(
  event: ApprovalForAllERC721
): void {
  let i = 1;
  while (true) {
    const ERC721Id = `${event.address.toHexString()}${i}`;
    let erc721 = ERC721.load(ERC721Id);
    if (erc721 == null) {
      return;
    }
    if (!erc721.operators) {
      break;
    }
    erc721.operators = removeFromArray(erc721.operators!, event.params.operator.toHexString());
    erc721.save();
    i++;
  }
}

// export function approvalForAllERC1155True(
//   event: ApprovalForAll
// ): void {
//   let i = 1;
//   while (true) {
//     const ERC1155Id = `${event.address.toHexString()}${i}`;
//     let erc1155 = ERC1155.load(ERC1155Id);
//     if (erc1155 == null) {
//       return;
//     }
//     erc1155.operators!.push(event.params.operator.toHexString());
//     erc1155.save();
//     i++;
//   }
// }

// export function approvalForAllERC1155False(
//   event: ApprovalForAll
// ): void {
//   let i = 1;
//   while (true) {
//     const ERC1155Id = `${event.address.toHexString()}${i}`;
//     let erc1155 = ERC1155.load(ERC1155Id);
//     if (erc1155 == null) {
//       return;
//     }
//     if (!erc1155.operators) {
//       break;
//     }
//     erc1155.operators = removeFromArray(erc1155.operators, event.params.operator.toHexString());
//     erc1155.save();
//     i++;
//   }
// }
