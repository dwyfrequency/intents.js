import { IntentBuilder, CHAINS, toBigInt, Asset, Account } from '../src';

import { TIMEOUT, TOKENS } from './constants';
import { getPrice, getUsdPrice, initTest } from './testUtils';

describe('basics', () => {
  let senderAddress: string, account: Account;

  beforeAll(async () => {
    ({ account } = await initTest());
  });

  it(
    'Empty wallet check',
    async () => {
      const balance = await account.getBalance(senderAddress);
      expect(balance).toBe(0);
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
      expect(balanceAfter).toBe(1); // 1ETH fueled
    },
    TIMEOUT,
  );
});

describe('swap', () => {
  let intentBuilder: IntentBuilder, account: Account;

  const swap = async function (sourceAddress: string, targetAddress: string, amount: number) {
    const from = new Asset({
        address: sourceAddress,
        amount: toBigInt(amount * 10 ** 18),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      to = new Asset({
        address: targetAddress,
        amount: toBigInt((await getPrice(sourceAddress, targetAddress, amount)) * 10 ** 18),
        chainId: toBigInt(CHAINS.Ethereum),
      });

    const sourceBefore = await account.getBalance(sourceAddress);
    const targetBefore = await account.getBalance(targetAddress);

    await intentBuilder.execute(from, to, account);

    const sourceAfter = await account.getBalance(sourceAddress);
    const targetAfter = await account.getBalance(targetAddress);

    expect(sourceAfter).toBeLessThan(sourceBefore);
    expect(targetAfter).toBeGreaterThan(targetBefore);
  };

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it('ETH->WETH', async () => swap(TOKENS.ETH, TOKENS.Weth, 0.1), TIMEOUT);
  it('WETH->ETH', async () => swap(TOKENS.Weth, TOKENS.ETH, await account.getBalance(TOKENS.Weth)), TIMEOUT);
  it('ETH->DAI', async () => swap(TOKENS.ETH, TOKENS.Dai, 0.1), TIMEOUT);
  it('DAI->ETH', async () => swap(TOKENS.Dai, TOKENS.ETH, await account.getBalance(TOKENS.Dai)), TIMEOUT);
  it('ETH->USDC', async () => swap(TOKENS.ETH, TOKENS.Usdc, 0.1), TIMEOUT);
  it('USDC->ETH', async () => swap(TOKENS.Usdc, TOKENS.ETH, await account.getBalance(TOKENS.Usdc)), TIMEOUT);
  it('ETH->UNI', async () => swap(TOKENS.ETH, TOKENS.UNI, 0.1), TIMEOUT);
  it('UNI->ETH', async () => swap(TOKENS.UNI, TOKENS.ETH, await account.getBalance(TOKENS.UNI)), TIMEOUT);
});
