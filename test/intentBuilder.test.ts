import { IntentBuilder, CHAINS, checkBalance, faucet, getSender, Intent, PROJECTS } from '../src';

import { ethers } from 'ethers';

import { TOKENS } from './constants';
import { assert } from 'console';

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

  //   it('should have an initial ETH balance of 0', async () => {
  //     const balance = await checkBalance(senderAddress);
  //     expect(parseFloat(balance)).toBe(0);
  //   }, 10000);

  it('should faucet the account with 1 ETH and check the balance', async () => {
    // Faucet the account with 1 ETH
    await faucet(senderAddress);

    // Check the balance after faucet
    const balanceAfter = await checkBalance(senderAddress);
    expect(parseFloat(balanceAfter)).toBe(1);
  }, 1000);


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


    const initialBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(intents, signer);

    const finalBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalBalance)).toBeGreaterThan(parseFloat(initialBalance));
  }, 10000);

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

    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(intents, signer);

    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 10000);

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

    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(intents, signer);

    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 10000);

    it('ETH -> ETH Loan', async () => {
    const intents = {
      sender: senderAddress,
      from: {
        type: 'TOKEN',
        address: TOKENS.ETH,
        amount: '0.5',
        chainId: CHAINS.Ethereum,
      },
      to: {
        type: 'LOAN',
        asset: TOKENS.ETH,
        address: PROJECTS.Aave,
        chainId: CHAINS.Ethereum,
      },
    } as unknown as Intent;

    const initialBalance = await checkBalance(senderAddress, TOKENS.ETH);
    await intentBuilder.execute(intents, signer);

    const finalBalance = await checkBalance(senderAddress, TOKENS.ETH);
    expect(parseFloat(finalBalance)).toBeLessThan(parseFloat(initialBalance));
  }, 10000);

  //Not Working TODO
  //   it('Loaned AWeth -> Weth', async () => {
  //   const intents = {
  //     sender: senderAddress,
  //     from: {
  //       type: 'LOAN',
  //       address: PROJECTS.Aave,
  //       asset: TOKENS.ETH,
  //       amount: '0.3',
  //       chainId: CHAINS.Ethereum,
  //     },
  //     to: {
  //       type: 'TOKEN',
  //       address: TOKENS.ETH,
  //       chainId: CHAINS.Ethereum,
  //     },
  //   } as unknown as Intent;

  //   const initialBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //   console.log('initialBalance ' + initialBalance)

  //   await intentBuilder.execute(intents, signer);

  //   const finalBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //   console.log('finalBalance ' + finalBalance)

  //   expect(parseFloat(initialBalance)).toBeLessThan(parseFloat(finalBalance));
  // }, 1000000);


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

      const initialBalance = await checkBalance(senderAddress, TOKENS.ETH);

      await intentBuilder.execute(intents, signer);

      const finalBalance = await checkBalance(senderAddress, TOKENS.ETH);


      expect(parseFloat(initialBalance)).toBeGreaterThan(parseFloat(finalBalance));
    }, 10000);

  //   it('DAI -> ETH Swap', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Dai,
  //         amount: '10',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  //   }, 1000000);

  //   it('WETH -> ETH Swap', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Weth,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  //   }, 1000000);

  //   it('DAI -> USDC Swap', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Dai,
  //         amount: '10',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //   }, 1000000);



  //   it('WETH -> ETH Stake', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Weth,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'STAKE',
  //         address: PROJECTS.Lido,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
  //     const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
  //     const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  //   }, 1000000);

  //   it('ETH -> ETH Stake', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'STAKE',
  //         address: PROJECTS.Lido,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

  //     await intentBuilder.execute(intents, signer);

  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //     expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  //   }, 1000000);

  //   it('ETH -> ETH Loan', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'LOAN',
  //         asset: TOKENS.Aweth,
  //         address: PROJECTS.Aave,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     await intentBuilder.execute(intents, signer);

  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //   }, 1000000);

  //   it('ERC20 -> ERC20 Loan', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Dai,
  //         amount: '10',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'LOAN',
  //         asset: TOKENS.Dai,
  //         address: PROJECTS.Aave,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
  //     const initialADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
  //     const finalADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));
  //   }, 1000000);

  //   it('ETH -> Weth Loan', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'LOAN',
  //         asset: TOKENS.Weth,
  //         address: PROJECTS.Aave,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

  //     await intentBuilder.execute(intents, signer);

  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //     expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   }, 1000000);

  //   it('ETH -> Dai Loan', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.ETH,
  //         amount: '0.8',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'LOAN',
  //         address: PROJECTS.Aave,
  //         asset: TOKENS.Dai,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     await intentBuilder.execute(intents, signer);

  //     const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //     expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   }, 10000);

  //   it('Loaned ADai -> DAI', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'LOAN',
  //         address: PROJECTS.Aave,
  //         asset: TOKENS.Dai,
  //         amount: '0.8',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Dai,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //   }, 10000000);



  //   it('Loaned Dai -> Usdc', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'LOAN',
  //         address: TOKENS.ADai,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
  //     const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     await intentBuilder.execute(intents, signer);

  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
  //     const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
  //   }, 1000000);

  //   it('Failed Loaned ETH -> ERC20', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'LOAN',
  //         address: TOKENS.ETH,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //     const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     try {
  //       await intentBuilder.execute(intents, signer);

  //       // If the intent execution does not throw an error, force the test to fail
  //       throw new Error('Expected intent execution to fail, but it succeeded.');

  //     } catch (error) {
  //       // Check the balances to ensure they have not changed
  //       const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
  //       const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //       expect(parseFloat(finalEthBalance)).toBe(parseFloat(initialEthBalance));
  //       expect(parseFloat(finalUsdcBalance)).toBe(parseFloat(initialUsdcBalance));

  //       // Check that the error is defined
  //       expect(error).toBeDefined();
  //     }
  //   }, 1000000);


  //   it('Failed Non-Loaned ERC20 -> ERC20', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'LOAN',
  //         address: TOKENS.Awbtc,
  //         amount: '0.1',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialAwbtcBalance = await checkBalance(senderAddress, TOKENS.Awbtc);
  //     const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     try {
  //       await intentBuilder.execute(intents, signer);

  //       // If the intent execution does not throw an error, force the test to fail
  //       throw new Error('Expected intent execution to fail, but it succeeded.');

  //     } catch (error) {
  //       // Check the balances to ensure they have not changed
  //       const finalAwbtcBalance = await checkBalance(senderAddress, TOKENS.Awbtc);
  //       const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //       expect(parseFloat(finalAwbtcBalance)).toBe(parseFloat(initialAwbtcBalance));
  //       expect(parseFloat(finalUsdcBalance)).toBe(parseFloat(initialUsdcBalance));

  //       // Check that the error is defined
  //       expect(error).toBeDefined();
  //     }
  //   }, 1000000);


  //   it('Failed Loan -> Stake', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'LOAN',
  //         address: TOKENS.ADai,
  //         amount: '10',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'STAKE',
  //         address: PROJECTS.Lido,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     try {
  //       await intentBuilder.execute(intents, signer);

  //       // If the intent execution does not throw an error, force the test to fail
  //       throw new Error('Expected intent execution to fail, but it succeeded.');

  //     } catch (error) {
  //       // Check that the error is defined
  //       expect(error).toBeDefined();
  //     }
  //   }, 1000000);


  //   it('DAI -> USDC Swap', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Dai,
  //         amount: '5',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
  //     const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

  //     await intentBuilder.execute(intents, signer);

  //     const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
  //     const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

  //     expect(parseFloat(finalUsdcBalance)).toBeLessThanOrEqual(parseFloat(initialUsdcBalance));
  //     expect(parseFloat(finalUsdcBalance)).toBeLessThanOrEqual(0);
  //         expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   }, 1000000);


  //   it('USDC Staking', async () => {
  //     const intents = {
  //       sender: senderAddress,
  //       from: {
  //         type: 'TOKEN',
  //         address: TOKENS.Usdc,
  //         amount: '3',
  //         chainId: CHAINS.Ethereum,
  //       },
  //       to: {
  //         type: 'STAKE',
  //         address: PROJECTS.Lido,
  //         chainId: CHAINS.Ethereum,
  //       },
  //     } as unknown as Intent;

  //     const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     await intentBuilder.execute(intents, signer);

  //     const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

  //     expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
  //   }, 1000000);
});
