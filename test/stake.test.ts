// import { Asset, CHAINS, faucet, getBalance, IntentBuilder, PROJECTS, toBigInt } from '../src';
// import { TIMEOUT, TOKENS } from './constants';
// import { initTest } from './testUtils';
// import { ethers } from 'ethers';
// import { Stake } from 'blndgs-model/dist/asset_pb';
//
// describe('Stake', () => {
//   let intentBuilder: IntentBuilder;
//   let senderAddress: string;
//   let signer: ethers.Wallet;
//
//   beforeAll(async () => {
//     ({ signer, senderAddress, intentBuilder } = await initTest());
//     await faucet(senderAddress, 1);
//   });
//
//   it(
//     'DAI -> ETH Stake',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Dai,
//           amount: toBigInt(100),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Lido,
//           amount: toBigInt(100),
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const initialStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const finalStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'WETH -> ETH Stake',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Weth,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Lido,
//           amount: toBigInt(100),
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Weth);
//       const initialStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Weth);
//       const finalStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'ETH -> ETH Stake',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ETH,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Lido,
//           amount: toBigInt(100),
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const initialStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const finalStEthBalance = await getBalance(senderAddress, TOKENS.Steth);
//
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//       expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'USDC Staking',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Usdc,
//           amount: toBigInt(10000000000000000000),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Stake({
//           address: PROJECTS.Lido,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
//
//       expect(parseFloat(finalUsdcBalance)).toBeLessThan(parseFloat(initialUsdcBalance));
//     },
//     TIMEOUT,
//   );
// });
