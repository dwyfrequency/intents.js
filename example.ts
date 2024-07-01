import { IntentBuilder, Projects, CHAINS, Asset, Stake, createBigInt } from './src';
import { ethers } from 'ethers';

const signer = new ethers.Wallet('private key');

const eth = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const amount = 0.1;

const from = new Asset({
  address: eth,
  amount: createBigInt(Number(amount)),
  chainId: createBigInt(CHAINS.Ethereum),
});

const to = new Stake({
  address: Projects.Lido,
  chainId: createBigInt(CHAINS.Ethereum),
});

async function executeIntent() {
  const intentBuilder = await IntentBuilder.createInstance();

  await intentBuilder.execute(from, to, signer);
}

executeIntent()
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
