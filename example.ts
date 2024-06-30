import { IntentBuilder, Projects, CHAINS, Intent, Asset, Stake, createBigInt } from './src';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const nativeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const amount = 0.1;

const asset = new Asset({
  address: nativeToken,
  amount: createBigInt(Number(amount)),
  chainId: createBigInt(CHAINS.Ethereum),
});

const stake = new Stake({
  address: Projects.Lido,
  chainId: createBigInt(CHAINS.Ethereum),
});

async function executeIntent() {
  const intentBuilder = await IntentBuilder.createInstance();
  await intentBuilder.execute(
    new Intent({
      from: {
        case: 'fromAsset',
        value: asset,
      },
      to: {
        case: 'toStake',
        value: stake,
      },
    }),
    signer,
  );
}

executeIntent()
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
