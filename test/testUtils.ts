import { ethers } from 'ethers';
import { getSender, IntentBuilder } from '../src';

export function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

export async function initTest() {
  if (!process.env.BUNDLER_URL) throw new Error('BUNDLER_URL is missing');

  const signer = generateRandomAccount();
  return {
    intentBuilder: await IntentBuilder.createInstance(process.env.BUNDLER_URL),
    senderAddress: await getSender(signer, process.env.BUNDLER_URL),
    signer,
  };
}
