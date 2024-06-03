import { IntentBuilder } from '../src/IntentBuilder';
import { Projects } from '../src/Projects';
import { NODE_URL } from '../src/Constants';
import { TOKENS,CHAINS } from './constants';

import { Intent } from '../src/index';
import { ethers } from 'ethers';

function randomToBytesLike(): ethers.BytesLike {
  const randomNum = Math.random();
  const hexString = ethers.utils.hexlify(Math.floor(randomNum * Number.MAX_SAFE_INTEGER));
  return ethers.utils.hexZeroPad(hexString, 32);
}

function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

describe('execute function use cases tests', () => {
  let intentBuilder: IntentBuilder;
  let randomAccount: ethers.Wallet;
  let sender: string;
  let signer: ethers.Wallet;

  beforeAll(async () => {
    intentBuilder = new IntentBuilder();
    randomAccount = generateRandomAccount();
    signer = randomAccount;
    sender = await intentBuilder.getSender(signer);
  });

  it('should have an initial ETH balance of 0', async () => {
    const balance = await intentBuilder.checkBalance(sender, NODE_URL);
    expect(parseFloat(balance)).toBe(0);
  }, 100000);

  it('should faucet the account with 1 ETH and check the balance', async () => {
    // Faucet the account with 1 ETH
    await intentBuilder.faucet(sender);

    // Check the balance after faucet
    const balanceAfter = await intentBuilder.checkBalance(sender, NODE_URL);
    expect(parseFloat(balanceAfter)).toBe(0.5);
  }, 100000);

  it('ETH -> ERC20 Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.Ethereum,
      },
    } as Intent;

    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);


      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ETH Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: "10",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ERC20 Swap', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: "10",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
    const initialUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
      const finalUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);


      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      // expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ETH Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: "100",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'STAKE',
        address: Projects.Lido,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
    const initialStEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Steth);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
      const finalStEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Steth);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: "0.1",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'STAKE',
        address: Projects.Lido,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
    const initialStEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Steth);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
      const finalStEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Steth);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: "0.1",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ERC20 -> ERC20 Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: "0.1",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
    const initialADaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);
      const finalADaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));

    } catch (error) {
      throw error;
    }
  }, 100000);

  it('ETH -> ERC20 Loan', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: "0.1",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);
      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Dai);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('Loaned ERC20 -> ETH', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.ADai,
        amount: "10",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);
    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);
      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);

  it('Loaned ERC20 -> ERC20', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.ADai,
        amount: "5",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum
      },
    } as Intent;

    const initialDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);
    const initialUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);

    try {
      await intentBuilder.execute(intents, signer, NODE_URL);

      const finalDaiBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ADai);
      const finalUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      throw error;
    }
  }, 100000);


  it('Failed Loaned ETH -> ERC20', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Ethereum,
        amount: "1",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum
      },
    } as Intent;
  
    const initialEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ETH);
    const initialUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);
  
    try {
      await intentBuilder.execute(intents, signer, NODE_URL);
  
      const finalEthBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.ETH);
      const finalUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);
  
      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Non-Loaned ERC20 -> ERC20', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.Usdc, // Token not available on Aave
        amount: "5",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum
      },
    } as Intent;
  
    const initialNonAaveTokenBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.NonAaveToken);
    const initialUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);
  
    try {
      await intentBuilder.execute(intents, signer, NODE_URL);
  
      const finalNonAaveTokenBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.NonAaveToken);
      const finalUsdcBalance = await intentBuilder.checkBalance(sender, NODE_URL, TOKENS.Usdc);
  
      expect(parseFloat(finalNonAaveTokenBalance)).toBeLessThan(parseFloat(initialNonAaveTokenBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);
  
  it('Failed Loan -> Stake', async () => {
    const intents = {
      sender: sender,
      from: {
        type: 'LOAN',
        address: Projects.Aave,
        asset: TOKENS.ADai,
        amount: "5",
        chainId: CHAINS.Ethereum
      },
      to: {
        type: 'STAKE',
        address: Projects.Lido,
        chainId: CHAINS.Ethereum
      },
    } as Intent;
  
    try {
      await intentBuilder.execute(intents, signer, NODE_URL);
  
      } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);
  
});
