import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

export function getOrCreateUser(userId: string, address: Address): User {
    let user = User.load(userId);
    if (user != null) {
        return user;
    }
    user = new User(userId);
    user.address = address;
    user.allowed = false;
    return user;
}
