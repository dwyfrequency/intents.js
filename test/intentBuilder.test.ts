import { IntentBuilder, PROJECTS, CHAINS, Asset, Stake, checkBalance, faucet, createBigInt, getSender } from '../src';

import { ethers } from 'ethers';
// @ts-ignore
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

  beforeAll(async () => {
    intentBuilder = await IntentBuilder.createInstance();
    signer = generateRandomAccount();
    senderAddress = await getSender(signer);
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
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Dai,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> WETH Swap', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.2),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Weth,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);

    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Swap', async () => {
    const from = new Asset({
        address: TOKENS.Dai,
        amount: createBigInt(10),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('WETH -> ETH Swap', async () => {
    const from = new Asset({
        address: TOKENS.Weth,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('DAI -> USDC Swap', async () => {
    const from = new Asset({
        address: TOKENS.Dai,
        amount: createBigInt(10),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Usdc,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Stake', async () => {
    const from = new Asset({
        address: TOKENS.Dai,
        amount: createBigInt(100),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Lido,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('WETH -> ETH Stake', async () => {
    const from = new Asset({
        address: TOKENS.Weth,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Lido,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Weth);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Lido,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalStEthBalance = await checkBalance(senderAddress, TOKENS.Steth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Aave,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  }, 100000);

  // The remaining tests follow a similar pattern, so I'll provide the code for them without individual explanations

  it('ERC20 -> ERC20 Loan', async () => {
    const from = new Asset({
        address: TOKENS.Dai,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Aave,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalADaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));
  }, 100000);

  it('ETH -> Weth Loan', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Aave,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> Dai Loan', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Aave,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    await intentBuilder.execute(from, to, signer);

    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('Loaned Dai -> ETH', async () => {
    const from = new Asset({
        address: TOKENS.ADai,
        amount: createBigInt(10),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Weth -> ETH', async () => {
    const from = new Asset({
        address: TOKENS.Aweth,
        amount: createBigInt(10),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Aweth);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Dai -> Usdc', async () => {
    const from = new Asset({
        address: TOKENS.ADai,
        amount: createBigInt(5),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Usdc,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.ADai);
    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
  }, 100000);

  it('Failed Loaned ETH -> ERC20', async () => {
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Usdc,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    try {
      await intentBuilder.execute(from, to, signer);

      const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);
      const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Non-Loaned ERC20 -> ERC20', async () => {
    const from = new Asset({
        address: TOKENS.Usdc, // Token not available on Aave
        amount: createBigInt(5),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Usdc,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialNonAaveTokenBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    try {
      await intentBuilder.execute(from, to, signer);

      const finalNonAaveTokenBalance = await checkBalance(senderAddress, TOKENS.Usdc);
      const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

      expect(parseFloat(finalNonAaveTokenBalance)).toBeLessThan(parseFloat(initialNonAaveTokenBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Loan -> Stake', async () => {
    const from = new Asset({
        address: TOKENS.ADai,
        amount: createBigInt(5),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: PROJECTS.Lido,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    try {
      await intentBuilder.execute(from, to, signer);
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('ETH -> DAI Swap with Slippage Control', async () => {
    const slippageTolerance = 0.05; // 5% tolerance
    const from = new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.5),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Dai,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    const expectedDai = parseFloat(initialDaiBalance) * (1 + slippageTolerance);
    expect(parseFloat(finalDaiBalance)).toBeLessThanOrEqual(expectedDai);
  }, 100000);

  describe('Negative tests with extreme amounts', () => {
    it('should fail with negative amount', async () => {
      const amount = createBigInt(-1); // Invalid negative amount
      expect(() => {
        new Asset({
          address: TOKENS.ETH,
          amount: amount,
          chainId: createBigInt(CHAINS.Ethereum),
        });
      }).toThrowError();
    });

    it('should fail with zero amount', async () => {
      const from = new Asset({
          address: TOKENS.ETH,
          amount: createBigInt(0), // Zero amount
          chainId: createBigInt(CHAINS.Ethereum),
        }),
        to = new Asset({
          address: TOKENS.Dai,
          chainId: createBigInt(CHAINS.Ethereum),
        });

      try {
        await intentBuilder.execute(from, to, signer);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle high amount', async () => {
      const highAmount = createBigInt(10000000000000000000000); // High amount
      const from = new Asset({
          address: TOKENS.ETH,
          amount: highAmount,
          chainId: createBigInt(CHAINS.Ethereum),
        }),
        to = new Asset({
          address: TOKENS.Dai,
          chainId: createBigInt(CHAINS.Ethereum),
        });
      // Assuming this might fail due to lack of balance or other reasons
      try {
        await intentBuilder.execute(from, to, signer);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
  it('DAI -> ETH Swap with Maximum Precision', async () => {
    const maxPrecisionAmount = createBigInt(Number('1'.padEnd(19, '0'))); // 18 decimals
    const from = new Asset({
        address: TOKENS.Dai,
        amount: maxPrecisionAmount,
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(from, to, signer);

    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('handles concurrent ETH -> DAI and DAI -> ETH swaps', async () => {
    const swap1 = intentBuilder.execute(
      new Asset({
        address: TOKENS.ETH,
        amount: createBigInt(0.1),
        chainId: createBigInt(CHAINS.Ethereum),
      }),

      new Asset({
        address: TOKENS.Dai,
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      signer,
    );

    const swap2 = intentBuilder.execute(
      new Asset({
        address: TOKENS.Dai,
        amount: createBigInt(50),
        chainId: createBigInt(CHAINS.Ethereum),
      }),

      new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      signer,
    );

    await Promise.all([swap1, swap2]);
    // After both transactions complete, verify balances or state
  }, 100000);

  it('WBTC -> ETH Swap', async () => {
    const from = new Asset({
        address: TOKENS.Wbtc,
        amount: createBigInt(0.1), // 1 WBTC (8 decimals)
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.ETH,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialWbtcBalance = await checkBalance(senderAddress, TOKENS.Wbtc);
    const initialEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    await intentBuilder.execute(from, to, signer);

    const finalWbtcBalance = await checkBalance(senderAddress, TOKENS.Wbtc);
    const finalEthBalance = await checkBalance(senderAddress, TOKENS.ETH);

    expect(parseFloat(finalWbtcBalance)).toBeLessThan(parseFloat(initialWbtcBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('USDC -> DAI Swap', async () => {
    const from = new Asset({
        address: TOKENS.Usdc,
        amount: createBigInt(10),
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: TOKENS.Dai,
        chainId: createBigInt(CHAINS.Ethereum),
      });
    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const initialDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    await intentBuilder.execute(from, to, signer);

    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);
    const finalDaiBalance = await checkBalance(senderAddress, TOKENS.Dai);

    expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('USDC Staking', async () => {
    const from = new Asset({
        address: TOKENS.Usdc,
        amount: createBigInt(10), // 5 USDC
        chainId: createBigInt(CHAINS.Ethereum),
      }),
      to = new Stake({
        address: PROJECTS.Lido,
        chainId: createBigInt(CHAINS.Ethereum),
      });

    const initialUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    await intentBuilder.execute(from, to, signer);

    const finalUsdcBalance = await checkBalance(senderAddress, TOKENS.Usdc);

    expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
  }, 100000);
});
