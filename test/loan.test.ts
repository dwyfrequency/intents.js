// import { Asset, CHAINS, IntentBuilder, PROJECTS, toBigInt } from '../src';
// import { TIMEOUT, TOKENS } from './constants';
// import { initTest } from './testUtils';
// import { Loan } from 'blndgs-model/dist/asset_pb';
// import { Account } from '../src/Account';
//
// describe('Loan', () => {
//   let intentBuilder: IntentBuilder, account: Account;
//
//   beforeAll(async () => {
//     ({ account, intentBuilder } = await initTest());
//     await account.faucet(1);
//   });
//
//   it(
//     'ETH->ETH(Loan)',
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
//       const initialEthBalance = await account.getBalance(TOKENS.ETH);
//       await intentBuilder.execute(from, to, account);
//
//       const finalEthBalance = await account.getBalance(TOKENS.ETH);
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//     },
//     TIMEOUT,
//   );
//
//   it(
//     'DAI -> DAI(Loan)',
//     async () => {
//       const from = new Asset({
//           address: TOKENS.Dai,
//           amount: toBigInt(0.1),
//           chainId: toBigInt(CHAINS.Ethereum),
//         }),
//         to = new Loan({
//           address: PROJECTS.Aave,
//           amount: toBigInt(0.1),
//           asset: TOKENS.Dai,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialDaiBalance = await account.getBalance(TOKENS.Dai);
//       const initialADaiBalance = await account.getBalance(TOKENS.ADai);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalDaiBalance = await account.getBalance(TOKENS.Dai);
//       const finalADaiBalance = await account.getBalance(TOKENS.ADai);
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
//       const initialDaiBalance = await account.getBalance(TOKENS.ADai);
//       const initialEthBalance = await account.getBalance(TOKENS.ETH);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalDaiBalance = await account.getBalance(TOKENS.ADai);
//       const finalEthBalance = await account.getBalance(TOKENS.ETH);
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
//       const initialDaiBalance = await account.getBalance(TOKENS.Aweth);
//       const initialEthBalance = await account.getBalance(TOKENS.ETH);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalDaiBalance = await account.getBalance(TOKENS.Aweth);
//       const finalEthBalance = await account.getBalance(TOKENS.ETH);
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
//       const initialDaiBalance = await account.getBalance(TOKENS.ADai);
//       const initialUsdcBalance = await account.getBalance(TOKENS.Usdc);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalDaiBalance = await account.getBalance(TOKENS.ADai);
//       const finalUsdcBalance = await account.getBalance(TOKENS.Usdc);
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
//         to = new Loan({
//           address: PROJECTS.Aave,
//           chainId: toBigInt(CHAINS.Ethereum),
//         });
//
//       const initialEthBalance = await account.getBalance(TOKENS.ETH);
//       const initialDaiBalance = await account.getBalance(TOKENS.Aweth);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalEthBalance = await account.getBalance(TOKENS.ETH);
//       const finalDaiBalance = await account.getBalance(TOKENS.Aweth);
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
//       const initialEthBalance = await account.getBalance(TOKENS.ETH);
//       const initialDaiBalance = await account.getBalance(TOKENS.ADai);
//
//       await intentBuilder.execute(from, to, account);
//
//       const finalEthBalance = await account.getBalance(TOKENS.ETH);
//       const finalDaiBalance = await account.getBalance(TOKENS.ADai);
//
//       expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
//       expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
//     },
//     TIMEOUT,
//   );
// });
//
// describe('Failed Loan', () => {
//   let intentBuilder: IntentBuilder, account: Account;
//
//   beforeAll(async () => {
//     ({ account, intentBuilder } = await initTest());
//     await account.faucet(1);
//   });
// });
