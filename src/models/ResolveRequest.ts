import Big from "big.js";

export interface ResolveRequest {
    requestId: Big;
    type: 'resolve';
}
