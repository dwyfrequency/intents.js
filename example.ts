import { IntentBuilder, Intent } from './src/index';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const nodeUrl = '';

const intentBuilder = new IntentBuilder();

let intents: Intent = {
  sender: '',
  from: {
    type: 'TOKEN',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    amount: '2300',
    chainId: '1',
  },
  to: {
    type: 'TOKEN',
    address: 'NATIVE', //ETH
    amount: '1',
    chainId: '1',
  },
  extraData: {
    expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24h
    partiallyFillable: false,
    kind: 'sell',
  },
};

intentBuilder
  .execute(intents, signer, nodeUrl)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
