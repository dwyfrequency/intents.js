import { IntentBuilder, CHAINS, toBigInt, Asset, Account } from '../src';

import { TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';

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

describe('swap', () => {
  let intentBuilder: IntentBuilder, account: Account;

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'ETH->WETH',
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

      const initialEthBalance = await account.getBalance(TOKENS.ETH);
      const initialDaiBalance = await account.getBalance(TOKENS.Weth);

      await intentBuilder.execute(from, to, account);

      const finalEthBalance = await account.getBalance(TOKENS.ETH);
      const finalDaiBalance = await account.getBalance(TOKENS.Weth);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
    },
    TIMEOUT,
  );

  it(
    'WETH->ETH',
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

      const initialDaiBalance = await account.getBalance(TOKENS.Weth);
      const initialEthBalance = await account.getBalance(TOKENS.ETH);
      await intentBuilder.execute(from, to, account);

      const finalDaiBalance = await account.getBalance(TOKENS.Weth);
      const finalEthBalance = await account.getBalance(TOKENS.ETH);
      expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
      expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
    },
    TIMEOUT,
  );
});
