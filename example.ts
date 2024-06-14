import { IntentBuilder, Projects, Intent, Asset, Stake } from './src';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const intentBuilder = new IntentBuilder();

const sender = '0x';
const fromSelectedToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const inputValue = '0.1';

const fromCaseValue = {
  case: 'fromAsset',
  value: new Asset({
    address: fromSelectedToken,
    amount: intentBuilder.createBigInt(Number(inputValue)),
    chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const toCaseValue = {
  case: 'toStake',
  value: new Stake({
    address: Projects.Lido,
    chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

intentBuilder
  .execute(
    new Intent({
      sender: sender,
      from: fromCaseValue,
      to: toCaseValue,
    }),
    signer,
  )
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
