import { IntentBuilder } from '../src';
import { Projects } from '../src';
import { CHAINS } from '../src/Constants';
import { TOKENS } from './constants';

import { Intent } from '../src';
import { ethers } from 'ethers';

const nodeUrl = 'https://virtual.mainnet.rpc.tenderly.co/c4100609-e3ff-441b-a803-5a4e95de809f';
const privateKey = '';
const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
const signer = new ethers.Wallet(privateKey, provider);

function randomToBytesLike(): ethers.BytesLike {
  // Generate a random number using Math.random() and convert it to a hex string
  const randomNum = Math.random();

  // Convert the random number to a string representing its hexadecimal value
  // Scale the random number to a larger integer range to get more bytes
  const hexString = ethers.utils.hexlify(Math.floor(randomNum * Number.MAX_SAFE_INTEGER));

  // Pad the hex string to ensure it represents a full byte sequence if necessary
  // ethers.utils.hexZeroPad ensures that the hex string has at least 32 bytes (64 hex characters)
  return ethers.utils.hexZeroPad(hexString, 32);
}

describe('execute function use cases tests', async () => {
  const intentBuilder = new IntentBuilder();
  const sender = await intentBuilder.getSender(signer, randomToBytesLike());

  it('ETH -> ERC20 Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ERC20 -> ETH Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ERC20 -> ERC20 Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ERC20 -> ETH Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'STAKE',
        address: Projects.Lido,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'STAKE',
        address: Projects.Lido,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ETH -> ERC20 Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'STAKE',
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ERC20 -> ERC20 Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
        amount: 0,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ERC20 -> ETH Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
        amount: 0,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('ETH -> ERC20 Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
        amount: 0,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('Loaned ERC20 -> ETH', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
        amount: 0,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);

  it('Loaned ERC20 -> ERC20', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
        amount: 0,
      },
    } as Intent;

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intents, signer, nodeUrl);
  }, 100000);
});
