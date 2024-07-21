import { ethers } from 'ethers';
import { IntentBuilder } from '../src';
import { Account } from '../src/Account';

export function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

export async function initTest() {
  if (!process.env.BUNDLER_URL) throw new Error('BUNDLER_URL is missing');
  if (!process.env.NODE_URL) throw new Error('NODE_URL is missing');

  const signer = generateRandomAccount();
  return {
    intentBuilder: await IntentBuilder.createInstance(process.env.BUNDLER_URL),
    account: await Account.createInstance(signer, process.env.BUNDLER_URL, process.env.NODE_URL),
  };
}
