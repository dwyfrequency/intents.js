import { ChainConfigs } from './types';
import { BigNumber } from 'ethers';

/**
 * The address of the entry point smart contract.
 */
export const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

/**
 * The factory contract address.
 */
export const FACTORY = '0x61e218301932a2550AE8E4Cd1EcfCA7bE64E57DC';

// TODO:: define as a config process.env
// validate it if the config is correct
// static keys for Ethereum, Binance and so on
export const CHAIN_CONFIGS: ChainConfigs = {
  Ethereum: {
    chainId: BigNumber.from(888),
    rpcUrl: 'https://virtual.mainnet.rpc.tenderly.co/13d45a24-2474-431e-8f19-31f251f6cd2a',
    bundlerUrl: 'https://eth.bundler.dev.balloondogs.network',
  },
  Binance: {
    chainId: BigNumber.from(890),
    rpcUrl: 'https://virtual.binance.rpc.tenderly.co/4e9d15b6-3c42-43b7-a254-359a7893e8e6',
    bundlerUrl: 'https://bsc.bundler.dev.balloondogs.network',
  },
};
