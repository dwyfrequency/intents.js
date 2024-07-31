import { Asset, Loan, CHAINS, IntentBuilder, PROJECTS, toBigInt, Account } from '../src';
import { TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';

describe('Loan', () => {
  let intentBuilder: IntentBuilder, account: Account;

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'LidoETH',
    async () => {
      const from = new Asset({
          address: TOKENS.ETH,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        to = new Loan({
          address: PROJECTS.Aave,
          asset: TOKENS.ETH,
          chainId: toBigInt(CHAINS.Ethereum),
        });

      const initialEthBalance = await account.getBalance(TOKENS.ETH);
      await intentBuilder.execute(from, to, account);

      const finalEthBalance = await account.getBalance(TOKENS.ETH);
      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    },
    TIMEOUT,
  );

  // it(
  //   'CompoundETH',
  //   async () => {
  //     const from = new Asset({
  //         address: TOKENS.ETH,
  //         amount: toBigInt(0.1 * 10 ** 18),
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       }),
  //       to = new Loan({
  //         address: PROJECTS.Compound,
  //         asset: TOKENS.ETH,
  //         chainId: toBigInt(CHAINS.Ethereum),
  //       });
  //
  //     const initialEthBalance = await account.getBalance(TOKENS.ETH);
  //     await intentBuilder.execute(from, to, account);
  //
  //     const finalEthBalance = await account.getBalance(TOKENS.ETH);
  //     expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  //   },
  //   TIMEOUT,
  // );
});
