import { BigNumber } from 'ethers';

export interface ChainConfig {
  chainId: BigNumber;
  rpcUrl: string;
  bundlerUrl: string;
}

export type ChainConfigs = Record<string, ChainConfig>;
