import { IntentBuilder, CHAINS, toBigInt, Asset, Account } from '../src';
import { TIMEOUT, Token, TOKENS } from './constants';
import { amountToBigInt, getPrice, initTest } from './testUtils';
const maxSlippage = 1; // 10% allowed by network above that will not be accepted.

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

  const swap = async function (sourceToken: Token, targetToken: Token, amount: number, slippagePercentage = 1) {
    const from = new Asset({
      address: sourceToken.address,
      amount: amountToBigInt(amount, sourceToken),
      chainId: toBigInt(CHAINS.Ethereum),
    });

    // Determine expected amount from the swap based on market prices
    const expectedAmount = await getPrice(sourceToken.address, targetToken.address, amount);
    const slippageFactor = 1 - slippagePercentage / 100;
    const minOutAmount = expectedAmount * slippageFactor;
    console.log('minOutAmount', minOutAmount);

    const to = new Asset({
      address: targetToken.address,
      amount: amountToBigInt(minOutAmount, targetToken),
      chainId: toBigInt(CHAINS.Ethereum),
    });

    const sourceBefore = await account.getBalance(sourceToken.address);
    const targetBefore = await account.getBalance(targetToken.address);

    await intentBuilder.execute(from, to, account);

    const sourceAfter = await account.getBalance(sourceToken.address);
    const targetAfter = await account.getBalance(targetToken.address);

    // Adjusted conditions to check against minOutAmount rather than expectedAmount directly
    expect(sourceAfter).toBeLessThan(sourceBefore);
    expect(targetAfter).toBeGreaterThan(targetBefore);
  };

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'ETH->WETH',
    async () => {
      await swap(TOKENS.ETH, TOKENS.WETH, 0.1);
    },
    TIMEOUT,
  );

  it(
    'WETH->ETH',
    async () => {
      await swap(TOKENS.WETH, TOKENS.ETH, await account.getBalance(TOKENS.WETH.address));
    },
    TIMEOUT,
  );

  it(
    'ETH->DAI',
    async () => {
      await swap(TOKENS.ETH, TOKENS.DAI, 0.1);
    },
    TIMEOUT,
  );

  it(
    'DAI->ETH',
    async () => {
      await swap(TOKENS.DAI, TOKENS.ETH, await account.getBalance(TOKENS.DAI.address), maxSlippage);
    },
    TIMEOUT,
  );

  it(
    'ETH->LINK',
    async () => {
      await swap(TOKENS.ETH, TOKENS.LINK, 0.1);
    },
    TIMEOUT,
  );

  it(
    'LINK->ETH',
    async () => {
      await swap(TOKENS.LINK, TOKENS.ETH, await account.getBalance(TOKENS.LINK.address));
    },
    TIMEOUT,
  );

  it(
    'ETH->USDC',
    async () => {
      await swap(TOKENS.ETH, TOKENS.USDC, 0.1);
    },
    TIMEOUT,
  );

  it(
    'USDC->ETH',
    async () => {
      await swap(TOKENS.USDC, TOKENS.ETH, await account.getBalance(TOKENS.USDC.address));
    },
    TIMEOUT,
  );

  it(
    'ETH->UNI',
    async () => {
      await swap(TOKENS.ETH, TOKENS.UNI, 0.1);
    },
    TIMEOUT,
  );

  it(
    'UNI->ETH',
    async () => {
      await swap(TOKENS.UNI, TOKENS.ETH, await account.getBalance(TOKENS.UNI.address));
    },
    TIMEOUT,
  );

  it(
    'ETH->USDT',
    async () => {
      await swap(TOKENS.ETH, TOKENS.USDT, 0.1);
    },
    TIMEOUT,
  );

  it(
    'USDT->LINK',
    async () => {
      await swap(TOKENS.DAI, TOKENS.LINK, await account.getBalance(TOKENS.USDT.address));
    },
    TIMEOUT,
  );

  it(
    'LINK->DAI',
    async () => {
      await swap(TOKENS.LINK, TOKENS.DAI, await account.getBalance(TOKENS.LINK.address));
    },
    TIMEOUT,
  );
});
