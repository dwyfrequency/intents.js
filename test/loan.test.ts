// import { Asset, CHAINS, getBalance, IntentBuilder, PROJECTS, toBigInt } from '../src';
// import { ethers } from 'ethers';
// import { TIMEOUT, TOKENS } from './constants';
// import { initTest } from './testUtils';
//
// describe('Loan', () => {
//   let intentBuilder: IntentBuilder;
//   let senderAddress: string;
//   let signer: ethers.Wallet;
//
//   beforeAll(async () => {
//     ({ signer, senderAddress, intentBuilder } = await initTest());
//   });
//
//   it(
//     'ETH -> ETH Loan',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ETH,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Aave,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       await intentBuilder.execute(from, to, signer);
//
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'ERC20 -> ERC20 Loan',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Dai,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Aave,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const initialADaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Dai);
//       const finalADaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'Loaned Dai -> ETH',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ADai,
//           amount: toBigInt(10),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: TOKENS.ETH,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'Loaned Weth -> ETH',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Aweth,
//           amount: toBigInt(10),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: TOKENS.ETH,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Aweth);
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Aweth);
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'Loaned Dai -> Usdc',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ADai,
//           amount: toBigInt(5),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: TOKENS.Usdc,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//       const initialUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//       const finalUsdcBalance = await getBalance(senderAddress, TOKENS.Usdc);
//
//       expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
//       expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'ETH -> Weth Loan',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ETH,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Aave,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.Aweth);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.Aweth);
//
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//       expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'ETH -> Dai Loan',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.ETH,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Asset({
//           address: PROJECTS.Aave,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//       const initialEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const initialDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//
//       await intentBuilder.execute(from, to, signer);
//
//       const finalEthBalance = await getBalance(senderAddress, TOKENS.ETH);
//       const finalDaiBalance = await getBalance(senderAddress, TOKENS.ADai);
//
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//       expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
//     },
//     TIMEOUT,
//   );
// });
//
// describe('Failed Loan', () => {
//   let intentBuilder: IntentBuilder;
//   let senderAddress: string;
//   let signer: ethers.Wallet;
//
//   beforeAll(async () => {
//     ({ signer, senderAddress, intentBuilder } = await initTest());
//   });
// });
