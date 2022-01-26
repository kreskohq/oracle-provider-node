import { BridgeChainId } from "./BridgeChainId";

export interface Block {
    hash: string;
    receiptsRoot: string;
    number: number;
    network: {
        bridgeChainId: BridgeChainId;
        type: "evm" | "near";
    };
}
