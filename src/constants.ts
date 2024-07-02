import dotenv from 'dotenv';

dotenv.config();

import { BigNumber } from 'ethers';

// URL Map for different environments
const URL_MAP: { [key: string]: string } = {
  LIVE: 'https://test.balloondogs.network:4338',
  TEST: 'https://test.balloondogs.network:4338',
  DEV: 'https://dev.balloondogs.network:4338',
};

// Validate and get BUNDLER_URL based on the environment
const env = process.env.ENV;

if (!env || !URL_MAP[env]) {
  throw new Error('Invalid or missing environment variable: ENV');
}

export const BUNDLER_URL = URL_MAP[env];

export const CHAIN_ID = BigNumber.from(888);
export const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
export const FACTORY = '0x793bf47262290b0d02d4326bfc3654a0358e12de';
export const NODE_URL = 'https://virtual.mainnet.rpc.tenderly.co/c5ed9a3b-7ad5-4d6a-8e4b-76a4b00ba6ea';
