import { IntentBuilder, CHAINS, PROJECTS, toBigInt, Asset, Stake } from '../src';

import { TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';
import { Account } from '../src/Account';

describe('basics', () => {
  let senderAddress: string, account: Account;

  beforeAll(async () => {
    ({ account } = await initTest());
  });

  it(
    'Empty wallet check',
    async () => {
      const balance = await account.getBalance(senderAddress);
      expect(parseFloat(balance)).toBe(0);
    },
    TIMEOUT,
  );

  it(
    'Faucet validation',
    async () => {
      // Faucet the account with 1 ETH
      await account.faucet(1);

      // Check the balance after faucet
      const balanceAfter = await account.getBalance(senderAddress);
      expect(parseFloat(balanceAfter)).toBe(1); // 1ETH fueled
    },
    TIMEOUT,
  );
});

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
