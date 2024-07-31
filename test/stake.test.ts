import { IntentBuilder, CHAINS, PROJECTS, toBigInt, Asset, Stake, Account } from '../src';

import { TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';

describe('Stake', () => {
  let intentBuilder: IntentBuilder, account: Account;

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'ETH -> stETH',
    async () => {
      const from = new Asset({
          address: TOKENS.ETH,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        to = new Stake({
          address: PROJECTS.Lido,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        });
      const initialDaiBalance = await account.getBalance(TOKENS.ETH);
      const initialStEthBalance = await account.getBalance(TOKENS.Steth);

      await intentBuilder.execute(from, to, account);

      const finalDaiBalance = await account.getBalance(TOKENS.ETH);
      const finalStEthBalance = await account.getBalance(TOKENS.Steth);

      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
    },
    TIMEOUT,
  );
});
