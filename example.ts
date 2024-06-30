import { IntentBuilder, Projects, CHAINS, Intent, Asset, Stake, createBigInt } from './src';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const sender = '0xAddress';
const Token = 'NATIVE';
const amount = 0.1;

const fromCaseValue = {
  case: 'fromAsset',
  value: new Asset({
    address: Token,
    amount: createBigInt(Number(amount)),
    chainId: createBigInt(CHAINS.Ethereum),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const toCaseValue = {
  case: 'toStake',
  value: new Stake({
    address: Projects.Lido,
    chainId: createBigInt(CHAINS.Ethereum),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

async function executeIntent() {
  const intentBuilder = new IntentBuilder();
  await intentBuilder.init();
  await intentBuilder.execute(
    new Intent({
      sender: sender,
      from: fromCaseValue,
      to: toCaseValue,
    }),
    signer,
  );
}

executeIntent()
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
