import { ethers } from 'ethers';
import { IntentBuilder, toBigInt, Account } from '../src';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Token } from './constants';
import dotenv from 'dotenv';

dotenv.config();
const moralis_key = process.env.MORALIS_API_KEY;
let isMoralisInitialized = false;

export async function initializeMoralis() {
  if (!isMoralisInitialized) {
    await Moralis.start({ apiKey: moralis_key });
    isMoralisInitialized = true;
  }
}

export function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

export async function initTest() {
  if (!process.env.BUNDLER_URL) throw new Error('BUNDLER_URL is missing');
  if (!process.env.NODE_URL) throw new Error('NODE_URL is missing');
  if (!process.env.MORALIS_API_KEY) throw new Error('MORALIS_API_KEY is missing');

  const signer = generateRandomAccount();
  await initializeMoralis();
  return {
    intentBuilder: await IntentBuilder.createInstance(process.env.BUNDLER_URL),
    account: await Account.createInstance(signer, process.env.BUNDLER_URL, process.env.NODE_URL),
  };
}

export async function getUsdPrice(tokenAddress: string, decimals: number): Promise<ethers.BigNumber> {
  tokenAddress =
    tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH address for APIs
      : tokenAddress;
  const response = await Moralis.EvmApi.token.getTokenPrice({
    address: tokenAddress,
    chain: EvmChain.ETHEREUM,
  });

  const usdPriceStr = response.result.usdPrice.toFixed(decimals); // Convert to string with 18 decimal places
  const usdPrice = ethers.utils.parseUnits(usdPriceStr, decimals);

  return usdPrice;
}

export async function getPrice(
  source: Token,
  target: Token,
  sourceAmount: ethers.BigNumber,
): Promise<ethers.BigNumber> {
  const [sourcePrice, targetPrice] = await Promise.all([
    getUsdPrice(source.address, source.decimal),
    getUsdPrice(target.address, target.decimal),
  ]);

  return sourceAmount.mul(sourcePrice).div(targetPrice);
}

// export function amountToBigInt(amount: number | string, token: Token) {
//   // Convert amount to a BigNumber right from the input to avoid precision loss
//   const amountBigNumber = ethers.utils.parseUnits(amount.toString(), token.decimal);
//   return toBigInt(amountBigNumber);
// }

// Updated to handle BigNumber inputs directly
export function amountToBigInt(amount: ethers.BigNumber) {
  // Assuming 'amount' is already a BigNumber formatted to the token's decimals
  return toBigInt(amount);
}
