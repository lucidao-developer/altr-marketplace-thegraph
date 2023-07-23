import { Address, Bytes } from "@graphprotocol/graph-ts";
import { AltrLicenseManagerOwnershipTransferred as AltrLicenseManagerOwnershipTransferredEvent } from "../generated/AltrLicenseManager/AltrLicenseManager";
import { getOrCreateSpecialUser } from "./utils/entity";
import { grantRole, revokeRole } from "./utils/role-management";

export function handleAltrLicenseManagerOwnershipTransferred(
  event: AltrLicenseManagerOwnershipTransferredEvent
): void {
  const roleName = Bytes.fromUTF8("Owner");
  const previousOwner = getOrCreateSpecialUser(
    event.params.previousOwner.toHexString(),
    event.params.previousOwner
  );
  const newOwner = event.params.newOwner;
  const contractAddress = Address.fromString(
    "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  );
  const roleId = `${contractAddress.toHexString()}${roleName.toHexString()}`;
  grantRole(contractAddress, newOwner, roleName);
  revokeRole(previousOwner.id, roleId);
}
