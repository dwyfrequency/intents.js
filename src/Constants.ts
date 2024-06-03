import { BigNumber } from 'ethers';
import { mainnet } from 'viem/chains';

export const BUNDLER_URL = 'https://testapi.balloondogs.team';
export const chainID = BigNumber.from(1);
export const CHAINS = {
  ethereum: mainnet,
};
export const entryPointAddr = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
export const factoryAddr = '0x2564193458ffe133fec5ca8141e0181cad1b458d';
