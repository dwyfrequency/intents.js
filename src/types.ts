import { BigNumber } from 'ethers';

export interface ChainConfig {
  chainId: BigNumber;
  rpcUrl: string;
  bundlerUrl: string;
}

export type ChainConfigs = Record<string, ChainConfig>;

/**
 * Creates a new ChainConfig object.
 * @param chainId The chain ID as a number or string.
 * @param rpcUrl The RPC URL for the chain.
 * @param bundlerUrl The bundler URL for the chain.
 * @returns A ChainConfig object.
 */
export function createChainConfig(chainId: number | string, rpcUrl: string, bundlerUrl: string): ChainConfig {
  return {
    chainId: BigNumber.from(chainId),
    rpcUrl,
    bundlerUrl,
  };
}
