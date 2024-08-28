import { IntentBuilder, CHAINS, PROJECTS, toBigInt, Asset, Stake, Account, amountToBigInt } from '../src';

import { ChainID, TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';

describe('Stake', () => {
  let intentBuilder: IntentBuilder, account: Account;

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(ChainID, 1);
  });

  it(
    'LidoETH',
    async () => {
      const from = new Asset({
          address: TOKENS.ETH.address,
          amount: amountToBigInt(0.1, TOKENS.ETH.decimal),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        to = new Stake({
          address: PROJECTS.Lido,
          amount: amountToBigInt(0.1, TOKENS.ETH.decimal),
          chainId: toBigInt(CHAINS.Ethereum),
        });
      const initialDaiBalance = await account.getBalance(ChainID, TOKENS.ETH.address);
      const initialStEthBalance = await account.getBalance(ChainID, TOKENS.STETH.address);

      await intentBuilder.execute(from, to, account, ChainID);

      const finalDaiBalance = await account.getBalance(ChainID, TOKENS.ETH.address);
      const finalStEthBalance = await account.getBalance(ChainID, TOKENS.STETH.address);

      expect(finalDaiBalance).toBeLessThan(initialDaiBalance);
      expect(finalStEthBalance).toBeGreaterThan(initialStEthBalance);
    },
    TIMEOUT,
  );
});
