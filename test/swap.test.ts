import { IntentBuilder, CHAINS, getBalance, faucet, toBigInt, getSender, Asset, PROJECTS } from '../src';

import { ethers } from 'ethers';
import { TIMEOUT, TOKENS } from './constants';
import { generateRandomAccount, initTest } from './testUtils';

describe('basics', () => {
  let senderAddress: string;

  beforeAll(async () => {
    ({ senderAddress } = await initTest());
  });

  it(
    'Empty wallet check',
    async () => {
      const balance = await getBalance(senderAddress);
      expect(parseFloat(balance)).toBe(0);
    },
    TIMEOUT,
  );

  it(
    'Faucet validation',
    async () => {
      // Faucet the account with 1 ETH
      await faucet(senderAddress, 1);

      // Check the balance after faucet
      const balanceAfter = await getBalance(senderAddress);
      expect(parseFloat(balanceAfter)).toBe(1); // 1ETH fueled
    },
    TIMEOUT,
  );
});

describe('swap', () => {
  let intentBuilder: IntentBuilder;
  let senderAddress: string;
  let signer: ethers.Wallet;

  beforeAll(async () => {
    ({ signer, senderAddress, intentBuilder } = await initTest());
    await faucet(senderAddress, 1);
  });

  it(
    'ETH -> WETH Swap',
    async () => {
      const from = new Asset({
          address: TOKENS.ETH,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        to = new Asset({
          address: TOKENS.Weth,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        });

      const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
      const initialDaiBalance = await getBalance(senderAddress, TOKENS.Weth);

      await intentBuilder.execute(from, to, signer);

      const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
      const finalDaiBalance = await getBalance(senderAddress, TOKENS.Weth);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
    },
    TIMEOUT,
  );

  it(
    'WETH -> ETH Swap',
    async () => {
      const from = new Asset({
          address: TOKENS.Weth,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        to = new Asset({
          address: TOKENS.ETH,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        });

      const initialDaiBalance = await getBalance(senderAddress, TOKENS.Weth);
      const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
      await intentBuilder.execute(from, to, signer);

      const finalDaiBalance = await getBalance(senderAddress, TOKENS.Weth);
      const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
    },
    TIMEOUT,
  );

  // it(
  //   'ETH -> wBTC Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.ETH,
  //         amount: toBigInt(0.1 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.Wbtc,
  //         amount: toBigInt(1),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //     const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //     const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //     expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   },
  //   TIMEOUT,
  // );
  //
  // it(
  //   'ETH -> DAI Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.ETH,
  //         amount: toBigInt(0.1 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.Dai,
  //         // amount: toBigInt(0.1 * 10 ** 18),
  //         amount: toBigInt(5000 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //     const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //     const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //     expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   },
  //   TIMEOUT,
  // );
  //
  // it(
  //   'DAI -> ETH Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.Dai,
  //         amount: toBigInt(200 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.ETH,
  //         amount: toBigInt(0.1 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //     const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //     const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //
  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //     expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  //   },
  //   TIMEOUT,
  // );
  //
  // it(
  //   'DAI -> USDC Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.Dai,
  //         amount: toBigInt(50 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.Usdc,
  //         amount: toBigInt(50 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  //   },
  //   TIMEOUT,
  // );
  //
  // it(
  //   'WBTC -> ETH Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.Wbtc,
  //         amount: toBigInt(0.1), // 1 WBTC (8 decimals)
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.ETH,
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialWbtcBalance = await getBalance(senderAddress, TOKENS.Wbtc);
  //     const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalWbtcBalance = await getBalance(senderAddress, TOKENS.Wbtc);
  //     const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
  //
  //     expect(parseFloat(finalWbtcBalance)).toBeLessThan(parseFloat(initialWbtcBalance));
  //     expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  //   },
  //   TIMEOUT,
  // );
  //
  // it(
  //   'USDC -> DAI Swap',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.Usdc,
  //         amount: toBigInt(10000000000000000000),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Asset({
  //         address: TOKENS.Dai,
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //     const initialUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
  //     const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     await intentBuilder.execute(from, to, signer);
  //
  //     const finalUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
  //     const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
  //
  //     expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
  //     expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  //   },
  //   TIMEOUT,
  // );
});

// describe('execute function use cases tests', () => {
//   let intentBuilder: IntentBuilder;
//   let senderAddress: string;
//   let signer: ethers.Wallet;
//
//   beforeAll(async () => {
//     ({ signer, senderAddress, intentBuilder } = await initTest());
//   });
//
//   it(
//     'Empty wallet check',
//     async () => {
//       const balance = await getBalance(senderAddress);
//       console.log('balance', balance);
//       expect(parseFloat(balance)).toBe(0);
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'Faucet validation',
//     async () => {
//       // Faucet the account with 1 ETH
//       await faucet(senderAddress);
//
//       // Check the balance after faucet
//       const balanceAfter = await getBalance(senderAddress);
//       console.log('balanceAfter', balanceAfter);
//       expect(parseFloat(balanceAfter)).toBe(1); // 1ETH fueled
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'DAI -> ETH Swap with Maximum Precision',
//     async () => {
//       const maxPrecisionAmount = toBigInt(Number('1'.padEnd(19, '0'))); // 18 decimals
//       const from = new Asset({
//           address: TOKENS.Dai,
//           amount: maxPrecisionAmount,
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: TOKENS.ETH,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
//     },
//     TIMEOUT,
//   );
// });
//
// describe('Negative tests with extreme amounts', () => {
//   it('should fail with negative amount', async () => {
//     const amount = toBigInt(-1); // Invalid negative amount
//     expect(() => {
//       new Asset({
//         address: TOKENS.ETH,
//         amount: amount,
//         chainId: toBigInt(CHAINS.Ethereum),
//       });
//     }).toThrowError();
//   });
//
//   it('should fail with zero amount', async () => {
//     const from = new Asset({
//         address: TOKENS.ETH,
//         amount: toBigInt(0), // Zero amount
//         chainId: toBigInt(CHAINS.Ethereum),
//       }),
//       to = new Asset({
//         address: TOKENS.Dai,
//         chainId: toBigInt(CHAINS.Ethereum),
//       });
//
//     try {
//       await intentBuilder.execute(from, to, signer);
//     } catch (error) {
//       expect(error).toBeDefined();
//     }
//   });
//
//   it('should handle high amount', async () => {
//     const highAmount = toBigInt(10000000000000000000000); // High amount
//     const from = new Asset({
//         address: TOKENS.ETH,
//         amount: highAmount,
//         chainId: toBigInt(CHAINS.Ethereum),
//       }),
//       to = new Asset({
//         address: TOKENS.Dai,
//         chainId: toBigInt(CHAINS.Ethereum),
//       });
//     // Assuming this might fail due to lack of balance or other reasons
//     try {
//       await intentBuilder.execute(from, to, signer);
//     } catch (error) {
//       expect(error).toBeDefined();
//     }
//   });
// });
