import { IntentBuilder } from '../src/IntentBuilder';
import { CHAINS } from '../src/Constants';

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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        // asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: "0xA0b86991c6218b36c1d19D4a2e9EB0cE3606eB48",
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
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // Lido
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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // Lido
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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "STAKE",
        address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Lido for USDC
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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "LOAN",
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave
        asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: "TOKEN",
        address: "0xA0b86991c6218b36c1d19d4a2e9EB0cE3606eB48",
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
