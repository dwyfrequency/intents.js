import { BigNumber } from 'ethers';
import { mainnet } from 'viem/chains';

export const BUNDLER_URL = 'https://testapi.balloondogs.team';
export const chainID = BigNumber.from(888);
export const CHAINS = {
  ethereum: mainnet,
};
export const entryPointAddr = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
export const factoryAddr = '0x793bf47262290b0d02d4326bfc3654a0358e12de';
export const NODE_URL = 'https://virtual.mainnet.rpc.tenderly.co/c4100609-e3ff-441b-a803-5a4e95de809f';
