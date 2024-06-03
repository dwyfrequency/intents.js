import { IntentBuilder } from '../src/IntentBuilder';
import { Projects } from '../src/Projects';
import { CHAINS } from '../src/Constants';
import { TOKENS } from './constants';


import { Intent } from '../src/index';
import { ethers } from 'ethers';

const nodeUrl = 'https://virtual.mainnet.rpc.tenderly.co/c4100609-e3ff-441b-a803-5a4e95de809f';
const privateKey = '';
const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
const signer = new ethers.Wallet(privateKey, provider);

describe('execute function use cases tests', () => {
  it('ETH -> ERC20 Swap', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ETH Swap', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ERC20 Swap', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ETH Stake', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: Projects.Lido,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: Projects.Lido,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ERC20 Stake', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ERC20 Loan', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ETH Loan', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ERC20 Loan', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('Loaned ERC20 -> ETH', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: TOKENS.Ethereum,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('Loaned ERC20 -> ERC20', async () => {
    const intents = {
      sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
      from: {
        type: "LOAN",
        address: Projects.Aave,
        asset: TOKENS.Dai,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: TOKENS.Usdc,
        chainId: CHAINS.ethereum.id,
      },
    } as Intent;

    try {
      const intentBuilder = new IntentBuilder();
      await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
});
