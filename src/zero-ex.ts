import { BigInt } from "@graphprotocol/graph-ts";
import { ERC721OrderCancelled, ERC721OrderFilled } from "../generated/ZeroEx/ZeroEx";
import { ERC721, Order0x, User } from "../generated/schema";
import { getOrCreateUser } from "./utils/user";

export function handleERC721OrderCancelled(event: ERC721OrderCancelled): void {
    const maker = User.load(event.params.maker.toHexString());
    if (maker == null) {
        return;
    }
    const ERC721OrderId = `${maker.id}${event.params.nonce}`;
    let cancelledOrder = Order0x.load(ERC721OrderId);
    if (cancelledOrder == null) {
        cancelledOrder = new Order0x(ERC721OrderId);
        cancelledOrder.maker = maker.id;
        cancelledOrder.nonce = event.params.nonce;
        cancelledOrder.cancelled = true;
        cancelledOrder.filled = false
        cancelledOrder.timestamp = event.block.timestamp;
    }
    cancelledOrder.save();
}

export function handleERC721OrderFilled(event: ERC721OrderFilled): void {
    const maker = User.load(event.params.maker.toHexString());
    const takerId = event.params.taker.toHexString()
    let taker = getOrCreateUser(takerId, event.params.taker);
    const ERC721Id = `${event.params.erc721Token.toHexString()}${event.params.erc721TokenId}`;
    let erc721 = ERC721.load(ERC721Id)
    if (maker == null || erc721 == null) {
        return
    }

    const ERC721OrderId = `${maker.id}${event.params.nonce}`;
    let filledOrder = Order0x.load(ERC721OrderId);
    if (filledOrder == null) {
        filledOrder = new Order0x(ERC721OrderId);
        filledOrder.maker = maker.id;
        filledOrder.taker = taker.id;
        filledOrder.nonce = event.params.nonce;
        filledOrder.cancelled = false;
        filledOrder.filled = true;
        filledOrder.timestamp = event.block.timestamp;
        filledOrder.token = event.params.erc20Token;
        filledOrder.tokenAmount = event.params.erc20TokenAmount;
        filledOrder.direction = BigInt.fromI32(event.params.direction);
    }

    taker.save();
    erc721.save();
    filledOrder.save();
}