import AppConfig, { OracleRequest } from "./models/AppConfig";
import logger from "./services/LoggerService";
import NetworkQueue from "./services/NetworkQueue";

function findQueueForRequest(request: OracleRequest, queues: NetworkQueue[]) {
    return queues.find((queue) => {
        if (request.toNetwork.type !== queue.provider.networkConfig.type) {
            return false;
        }

        if (request.toNetwork.bridgeChainId !== queue.provider.networkConfig.bridgeChainId) {
            return false;
        }

        return true;
    });
}

export function searchRequests(appConfig: AppConfig, queues: NetworkQueue[]) {

    function onRequest(request: OracleRequest) {
        const queue = findQueueForRequest(request, queues);
        if (!queue) {
            logger.error(`[${request.block.network.type}-${request.block.network.bridgeChainId}] Could not find network ${request.toNetwork.type} with chain id ${request.toNetwork.bridgeChainId}`);
            return;
        }

        queue.add(request);
    }

    appConfig.requestListeners?.map((listenerConfig) => {
        const fromQueue = queues.find(queue => queue.id === listenerConfig.networkId);
        if (!fromQueue) {
            throw new Error(`Could not find provider for ${listenerConfig.networkId}`);
        }

        fromQueue.provider.onRequests(onRequest);
        return fromQueue.provider.startFetching(listenerConfig.contractAddress, listenerConfig.interval);
    });
}
