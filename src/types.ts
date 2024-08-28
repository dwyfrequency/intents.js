export interface ChainConfig {
  rpcUrl: string;
  bundlerUrl: string;
}

export type ChainConfigs = Record<number, ChainConfig>;

/**
 * Constructs a new ChainConfig object configured with the specified RPC and bundler URLs.
 * This function is particularly useful for initializing configuration settings that
 * will be consumed by blockchain client interfaces.
 *
 * @param rpcUrl The URL to the RPC endpoint of a blockchain network, used for making remote procedure calls.
 * @param bundlerUrl The URL to the transaction bundler service, which groups multiple transactions for efficiency.
 * @returns A new ChainConfig object containing the provided URLs.
 */
export function createChainConfig(rpcUrl: string, bundlerUrl: string): ChainConfig {
  return {
    rpcUrl,
    bundlerUrl,
  };
}
