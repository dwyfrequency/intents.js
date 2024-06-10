import { IntentBuilder } from './src';
import {
  Intent,
  AssetType,
  AssetKind,
  ProcessingStatus,
  BigInt
} from 'blndgs-model/dist/asset_pb';
import { ethers } from 'ethers';
import { CHAINS } from './src/Constants';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const nodeUrl = '';

const intentBuilder = new IntentBuilder();

const intents = {
  sender: '',
  fromAsset: {
    type: AssetKind.TOKEN,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    amount: intentBuilder.createBigInt('2300'),
    chainId: intentBuilder.createBigInt(CHAINS.Ethereum),
  },
  toStake: {
    type: AssetKind.STAKE,
    address: 'NATIVE', //ETH
    amount: intentBuilder.createBigInt('1'),
    chainId: intentBuilder.createBigInt(CHAINS.Ethereum),
  },
    expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24h
};

intentBuilder
  .execute(intents, signer, nodeUrl)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
