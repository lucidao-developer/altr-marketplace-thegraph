import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Sale } from "../../generated/schema";

export function createSale(): Sale {
  const now = BigInt.fromI32(1000000);
  const saleNumber = BigInt.fromI32(1);
  const saleId = `ERC1155${saleNumber}`;
  const sale = new Sale(saleId);
  const nftContractAddress = Address.fromString(
    "0x0000000000000000000000000000000000000002"
  );
  const erc1155Address = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  sale.openingTime = now;
  sale.closingTime = now.plus(BigInt.fromI32(10));
  sale.saleId = saleNumber;
  sale.isSuccessful = false;
  sale.seller = Address.fromString(
    "0x0000000000000000000000000000000000000003"
  ).toHexString();
  sale.fractionPrice = BigInt.fromI32(10);
  sale.fractionsAmount = BigInt.fromI32(100);
  sale.fractionsSold = BigInt.fromI32(0);
  sale.erc721 = `${nftContractAddress}${1}`;
  const tokenId = BigInt.fromI32(1);
  sale.erc1155 = `${erc1155Address}${tokenId}`;
  sale.save();
  return sale;
}
