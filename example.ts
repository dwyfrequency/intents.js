import { IntentBuilder, PROJECTS, CHAINS, Intent, Currency, Stake } from './src';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://testapi.balloondogs.team:4338'; //'https://api.balloondogs.network';

const signer = new ethers.Wallet('your-private-key');

const eth = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const amount = ethers.utils.parseUnits('0.1', 'ether').toString();

const from: Currency = {
  type: 'TOKEN',
  address: eth,
  amount: amount,
  chainId: CHAINS.Ethereum,
};

const to: Stake = {
  type: 'STAKE',
  address: PROJECTS.Lido,
  chainId: CHAINS.Ethereum,
};

const intent: Intent = {
  sender: await signer.getAddress(),
  from: from,
  to: to,
};

async function executeIntent() {
  const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

  await intentBuilder.execute(intent, signer);
}

executeIntent()
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
