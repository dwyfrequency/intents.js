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

export async function getUsdPrice(tokenAddress: string): Promise<number> {
  // https://forum.moralis.io/t/current-price-of-eth/11905
  tokenAddress =
    tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' //weth
      : tokenAddress;
  const response = await Moralis.EvmApi.token.getTokenPrice({
    address: tokenAddress,
    chain: EvmChain.ETHEREUM,
  });
  const usdPrice = response.result.usdPrice;
  return usdPrice;
}

export async function getPrice(sourceAddress: string, targetAddress: string, sourceAmount: number) {
  const [sourcePrice, targetPrice] = await Promise.all([getUsdPrice(sourceAddress), getUsdPrice(targetAddress)]);
  return (sourceAmount * sourcePrice) / targetPrice;
}

export function amountToBigInt(amount: number, token: Token) {
  return toBigInt(Math.round(amount * 10 ** token.decimal));
}
