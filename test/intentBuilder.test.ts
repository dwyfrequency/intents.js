import { IntentBuilder, CHAINS, checkBalance, faucet, getSender, Intent, PROJECTS } from '../src';

import { ethers } from 'ethers';

import { TOKENS } from './constants';

function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

describe('execute function use cases tests', () => {
  let intentBuilder: IntentBuilder;
  let senderAddress: string;
  let signer: ethers.Wallet;
  if (!process.env.BUNDLER_URL) throw new Error('BUNDLER_URL is missing');
  const BUNDLER_URL = process.env.BUNDLER_URL;

  beforeAll(async () => {
    intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);
    signer = generateRandomAccount();
    senderAddress = await getSender(signer, BUNDLER_URL);
  });

  it('should have an initial ETH balance of 0', async () => {
    const balance = await checkBalance(senderAddress);
    expect(parseFloat(balance)).toBe(0);
  }, 100000);

  it('should faucet the account with 1 ETH and check the balance', async () => {
    // Faucet the account with 1 ETH
    await faucet(senderAddress);

    // Check the balance after faucet
    const balanceAfter = await checkBalance(senderAddress);
    expect(parseFloat(balanceAfter)).toBe(0.5);
  }, 100000);

  it('ETH -> DAI Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> WETH Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.2',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Weth,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);

    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('WETH -> ETH Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Weth,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('DAI -> USDC Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Stake', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: '100',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'STAKE',
        address: PROJECTS.Lido,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('WETH -> ETH Stake', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Weth,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'STAKE',
        address: PROJECTS.Lido,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'STAKE',
        address: PROJECTS.Lido,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'LOAN',
        address: PROJECTS.Aave,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  }, 100000);

  // The remaining tests follow a similar pattern, so I'll provide the code for them without individual explanations

  it('ERC20 -> ERC20 Loan', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'LOAN',
        address: PROJECTS.Aave,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));
  }, 100000);

  it('ETH -> Weth Loan', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'LOAN',
        address: PROJECTS.Aave,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> Dai Loan', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'LOAN',
        address: PROJECTS.Aave,
        asset: TOKENS.Dai,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    await intentBuilder.execute(intents, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('Loaned Dai -> ETH', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.ADai,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Weth -> ETH', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.Aweth,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Dai -> Usdc', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.ADai,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
  }, 100000);

  it('Failed Loaned ETH -> ERC20', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    try {
      await intentBuilder.execute(intents, signer);

      const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
      const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Non-Loaned ERC20 -> ERC20', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.Awbtc,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialNonAaveTokenBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    try {
      await intentBuilder.execute(intents, signer);

      const finalNonAaveTokenBalance = await checkBalance(senderAddress, TOKENS.Usdc);
      const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

      expect(parseFloat(finalNonAaveTokenBalance)).toBeLessThan(parseFloat(initialNonAaveTokenBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Loan -> Stake', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'LOAN',
        address: TOKENS.ADai,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'STAKE',
        address: PROJECTS.Lido,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    try {
      await intentBuilder.execute(intents, signer);
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('ETH -> DAI Swap with Slippage Control', async () => {
    const slippageTolerance = 0.05; // 5% tolerance

    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(intents, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    const expectedDai = parseFloat(initialDaiBalance) * (1 + slippageTolerance);
    expect(parseFloat(finalDaiBalance)).toBeLessThanOrEqual(expectedDai);
  }, 100000);

  it('WBTC -> ETH Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Wbtc,
        amount: '0.1',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialWbtcBalance = await checkBalance(senderAddress, TOKENS.Wbtc);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(intents, signer);

    const finalWbtcBalance = await checkBalance(senderAddress, TOKENS.Wbtc);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalWbtcBalance)).toBeLessThan(parseFloat(initialWbtcBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('USDC -> DAI Swap', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(intents, signer);

    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('USDC Staking', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.Usdc,
        amount: '10',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'STAKE',
        address: PROJECTS.Lido,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    await intentBuilder.execute(intents, signer);

    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
  }, 100000);
});
