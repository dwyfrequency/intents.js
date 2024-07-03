import { IntentBuilder, PROJECTS, CHAINS, Asset, Stake, toBigInt } from './src';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://testapi.balloondogs.team:4338' //'https://api.balloondogs.network';

const signer = new ethers.Wallet('private key');

const eth = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const amount = 0.1;

const from = new Asset({
  address: eth,
  amount: toBigInt(Number(amount)),
  chainId: toBigInt(CHAINS.Ethereum),
});

const to = new Stake({
  address: PROJECTS.Lido,
  chainId: toBigInt(CHAINS.Ethereum),
});

async function executeIntent() {
  const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

  await intentBuilder.execute(from, to, signer);
}

executeIntent()
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
