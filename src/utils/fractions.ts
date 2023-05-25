import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { ERC1155 } from "../../generated/schema";

export function createFractions(owner: Address): ERC1155 {
  const fractionsId = BigInt.fromI32(1);
  const contractAddress = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  const erc1155 = new ERC1155(`${contractAddress.toHexString()}${fractionsId}`);
  erc1155.contractAddress = contractAddress;
  erc1155.supply = BigInt.fromI32(100);
  erc1155.tokenId = fractionsId;
  erc1155.erc721 = `${contractAddress}2`;
  erc1155.owners = [owner.toHexString()];
  erc1155.ownersBalances = [BigInt.fromI32(10)]
  erc1155.save();
  return erc1155;
}

export function getSupplyFromPrice(price: BigInt): BigInt {
  const tiers = new TypedMap<string, Array<BigInt>>();
  tiers.set("priceLimits", [
    BigInt.fromI32(0),
    BigInt.fromI64(500000000000),
    BigInt.fromI64(1000000000000),
    BigInt.fromI64(2500000000000),
    BigInt.fromI64(4000000000000)
  ]);
  tiers.set("fractionsAmount", [
    BigInt.fromI32(500),
    BigInt.fromI32(1000),
    BigInt.fromI32(4000),
    BigInt.fromI32(6000),
    BigInt.fromI32(10000)
  ]);
  const priceLimits = tiers.get("priceLimits");
  const fractionsAmount = tiers.get("fractionsAmount");
  for (let i = 1; i < priceLimits!.length; i++) {
    const lowerBound = priceLimits![i - 1];
    const fractionsAmountToSet = fractionsAmount![i - 1];
    const upperBound = priceLimits![i];

    if (price > lowerBound && price <= upperBound) {
      return fractionsAmountToSet;
    }
  }
  const maxAmount = fractionsAmount![fractionsAmount!.length - 1];
  return maxAmount;
}
