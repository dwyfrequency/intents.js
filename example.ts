import { IntentBuilder, PROJECTS, CHAINS, Asset, Stake, toBigInt, Account, amountToBigInt } from './src';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://bundler.dev.balloondogs.network';
const NODE_URL = 'https://virtual.mainnet.rpc.tenderly.co/13d45a24-2474-431e-8f19-31f251f6cd2a';

const signer = new ethers.Wallet('private key');

const amount = 0.1;
const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const ethDecimals = 18;

const from = new Asset({
  address: ethAddress,
  amount: amountToBigInt(amount, ethDecimals),
  chainId: toBigInt(CHAINS.Ethereum),
});

const to = new Stake({
  amount: amountToBigInt(amount, ethDecimals),
  address: PROJECTS.Lido,
  chainId: toBigInt(CHAINS.Ethereum),
});

async function executeIntent() {
  const account = await Account.createInstance(signer, BUNDLER_URL, NODE_URL),
    intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

  try {
    await intentBuilder.execute(from, to, account);
    console.log('Intent executed successfully.');
  } catch (error) {
    console.error('Error executing intent:', error);
  }
}

executeIntent();
