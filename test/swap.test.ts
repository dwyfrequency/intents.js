import { IntentBuilder, CHAINS, toBigInt, Asset, Account, floatToToken, weiToFloat, amountToBigInt } from '../src';
import { TIMEOUT, Token, TOKENS } from './constants';
import { getPrice, initTest } from './testUtils';
import { ethers } from 'ethers';

/** Maximum allowed slippage for swaps (2%) */
const DEFAULT_SLIPPAGE = 0.02;

/** Minimum amount allowed for a swap operation */
const MINIMUM_SWAP_AMOUNT = 0.000001;

/** Buffer to prevent "insufficient balance" errors (99.99% of balance) */
const BALANCE_BUFFER = 0.9999;

/** Threshold for considering balances equal, handles floating-point imprecision */
const BALANCE_THRESHOLD = 1e-15;

describe('swap', () => {
  let intentBuilder: IntentBuilder, account: Account;

  /**
   * Executes a token swap operation.
   * @param sourceToken The token to swap from
   * @param targetToken The token to swap to
   * @param amount The amount to swap
   * @param slippage Maximum allowed slippage, defaults to DEFAULT_SLIPPAGE
   */
  const swap = async function (sourceToken: Token, targetToken: Token, amount: number, slippage = DEFAULT_SLIPPAGE) {
    // Apply buffer to amount
    const bufferedAmount = amount * BALANCE_BUFFER;
    if (bufferedAmount < MINIMUM_SWAP_AMOUNT) {
      console.log(`Skipping swap due to amount (${bufferedAmount}) being below minimum (${MINIMUM_SWAP_AMOUNT})`);
      return;
    }

    // Create 'from' asset using amountToBigInt for precise conversion
    const from = new Asset({
      address: sourceToken.address,
      amount: amountToBigInt(bufferedAmount, sourceToken.decimal),
      chainId: toBigInt(CHAINS.Ethereum),
    });

    // Get expected amount and calculate minimum amount with slippage
    const expectedTargetAmount = await getPrice(
      sourceToken,
      targetToken,
      floatToToken(bufferedAmount, sourceToken.decimal),
    );
    const minTargetAmount = expectedTargetAmount
      .mul(ethers.BigNumber.from(Math.floor((1 - slippage) * 10000)))
      .div(10000);

    // Log swap details
    console.log('sourceToken', sourceToken);
    console.log('targetToken', targetToken);
    console.log('sourceAmount', bufferedAmount);
    console.log('expectedTargetAmount', weiToFloat(expectedTargetAmount));
    console.log('minTargetAmount', weiToFloat(minTargetAmount));
    console.log('sender', account.sender);
    console.log('source balance', await account.getBalance(sourceToken.address));
    console.log('targetToken balance', await account.getBalance(targetToken.address));

    // Create 'to' asset using amountToBigInt for precise conversion
    const to = new Asset({
      address: targetToken.address,
      amount: amountToBigInt(weiToFloat(minTargetAmount), targetToken.decimal),
      chainId: toBigInt(CHAINS.Ethereum),
    });

    // Execute swap
    try {
      await intentBuilder.execute(from, to, account);
    } catch (error) {
      console.error(`Swap failed: ${error}`);
    }
  };

  /**
   * Checks balance and executes swap if conditions are met.
   * @param sourceToken The token to swap from
   * @param targetToken The token to swap to
   * @param amount The amount to swap
   */
  const checkAndSwap = async (sourceToken: Token, targetToken: Token, amount: number) => {
    if (amount <= 0) {
      console.log(`Skipping ${sourceToken.address} -> ${targetToken.address} due to non-positive amount (${amount})`);
      return;
    }

    const balance = await account.getBalance(sourceToken.address);
    const bufferedAmount = Math.min(balance * BALANCE_BUFFER, amount);

    if (bufferedAmount <= 0 || bufferedAmount < MINIMUM_SWAP_AMOUNT) {
      console.log(
        `Skipping ${sourceToken.address} -> ${targetToken.address} due to amount (${bufferedAmount}) being below minimum (${MINIMUM_SWAP_AMOUNT})`,
      );
      return;
    }

    if (bufferedAmount < MINIMUM_SWAP_AMOUNT) {
      console.log(
        `Skipping ${sourceToken.address} -> ${targetToken.address} due to amount (${bufferedAmount}) being below minimum (${MINIMUM_SWAP_AMOUNT})`,
      );
      return;
    }

    if (Math.abs(balance - bufferedAmount) < BALANCE_THRESHOLD) {
      // If the difference is very small, use the exact balance
      await swap(sourceToken, targetToken, balance);
    } else {
      await swap(sourceToken, targetToken, bufferedAmount);
    }
  };

  // Initialize test environment
  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it('ETH->WETH', async () => await checkAndSwap(TOKENS.ETH, TOKENS.WETH, 0.1), TIMEOUT);

  it(
    'WETH->ETH',
    async () => {
      const balance = await account.getBalance(TOKENS.WETH.address);
      await checkAndSwap(TOKENS.WETH, TOKENS.ETH, balance);
    },
    TIMEOUT,
  );

  it('ETH->DAI', async () => await checkAndSwap(TOKENS.ETH, TOKENS.DAI, 0.1), TIMEOUT);

  it(
    'DAI->ETH',
    async () => {
      const balance = await account.getBalance(TOKENS.DAI.address);
      await checkAndSwap(TOKENS.DAI, TOKENS.ETH, balance);
    },
    TIMEOUT,
  );

  it('ETH->LINK', async () => await checkAndSwap(TOKENS.ETH, TOKENS.LINK, 0.1), TIMEOUT);

  it(
    'LINK->ETH',
    async () => {
      const balance = await account.getBalance(TOKENS.LINK.address);
      await checkAndSwap(TOKENS.LINK, TOKENS.ETH, balance);
    },
    TIMEOUT,
  );

  it('ETH->USDC', async () => await checkAndSwap(TOKENS.ETH, TOKENS.USDC, 0.1), TIMEOUT);

  it(
    'USDC->ETH',
    async () => {
      const balance = await account.getBalance(TOKENS.USDC.address);
      await checkAndSwap(TOKENS.USDC, TOKENS.ETH, balance);
    },
    TIMEOUT,
  );

  it('ETH->UNI', async () => await checkAndSwap(TOKENS.ETH, TOKENS.UNI, 0.1), TIMEOUT);

  it(
    'UNI->ETH',
    async () => {
      const balance = await account.getBalance(TOKENS.UNI.address);
      await checkAndSwap(TOKENS.UNI, TOKENS.ETH, balance);
    },
    TIMEOUT,
  );

  it('ETH->USDT', async () => await checkAndSwap(TOKENS.ETH, TOKENS.USDT, 0.1), TIMEOUT);

  it(
    'USDT->LINK',
    async () => {
      const balance = await account.getBalance(TOKENS.USDT.address);
      await checkAndSwap(TOKENS.USDT, TOKENS.LINK, balance);
    },
    TIMEOUT,
  );

  it(
    'LINK->DAI',
    async () => {
      const balance = await account.getBalance(TOKENS.LINK.address);
      await checkAndSwap(TOKENS.LINK, TOKENS.DAI, balance);
    },
    TIMEOUT,
  );

  it(
    'Should skip swap for small amounts',
    async () => {
      await checkAndSwap(TOKENS.ETH, TOKENS.USDC, 0.0005);
    },
    TIMEOUT,
  );
});
