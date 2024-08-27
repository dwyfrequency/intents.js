import { Asset, Loan, CHAINS, IntentBuilder, PROJECTS, toBigInt, Account, amountToBigInt } from '../src';
import { TIMEOUT, Token, TOKENS } from './constants';
import { initTest } from './testUtils';

describe('Loan', () => {
  let intentBuilder: IntentBuilder, account: Account;

  const loanWETH = async function (project: string, token: Token) {
    const assetETH = new Asset({
        address: token.address,
        amount: amountToBigInt(0.1, token.decimal),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      assetWETH = new Asset({
        address: token.address,
        amount: amountToBigInt(0.1, token.decimal),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      loanAaveWETH = new Loan({
        address: project,
        asset: token.address,
        chainId: toBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await account.getBalance(TOKENS.ETH.address);
    await intentBuilder.execute(assetETH, assetWETH, account);
    await intentBuilder.execute(assetWETH, loanAaveWETH, account);

    const finalEthBalance = await account.getBalance(TOKENS.ETH.address);
    expect(finalEthBalance).toBeLessThan(initialEthBalance);
  };

  const ethToLoanWEth = async function (project: string, token: Token) {
    const assetETH = new Asset({
        address: token.address,
        amount: amountToBigInt(0.1, token.decimal),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      loanAaveWETH = new Loan({
        address: project,
        asset: token.address,
        chainId: toBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await account.getBalance(token.address);
    await intentBuilder.execute(assetETH, loanAaveWETH, account);

    const finalEthBalance = await account.getBalance(token.address);
    expect(finalEthBalance).toBeLessThan(initialEthBalance);
  };

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'AaveETH',
    async () => {
      const assetETH = new Asset({
          address: TOKENS.ETH.address,
          amount: amountToBigInt(0.1, TOKENS.ETH.decimal),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        loanAaveETH = new Loan({
          address: PROJECTS.Aave,
          asset: TOKENS.ETH.address,
          chainId: toBigInt(CHAINS.Ethereum),
        });

      const initialEthBalance = await account.getBalance(TOKENS.ETH.address);
      await intentBuilder.execute(assetETH, loanAaveETH, account);

      const finalEthBalance = await account.getBalance(TOKENS.ETH.address);
      expect(finalEthBalance).toBeLessThan(initialEthBalance);
    },
    TIMEOUT,
  );

  // AAVE
  it('AaveWETH', async () => loanWETH(PROJECTS.Aave, TOKENS.WETH), TIMEOUT);
  // wrong token address WSTETH
  // it('AaveWstETH', async () => loanWETH(PROJECTS.Aave, TOKENS.WSTETH), TIMEOUT);

  it('ETH->AaveWETH', async () => ethToLoanWEth(PROJECTS.Aave, TOKENS.WETH), TIMEOUT);
  // wrong token address WSTETH
  // it('ETH->AaveWstETH', async () => ethToLoanWEth(PROJECTS.Aave, TOKENS.WSTETH), TIMEOUT);

  // Spark
  it('SparkWETH', async () => loanWETH(PROJECTS.Spark, TOKENS.WETH), TIMEOUT);
  // wrong token address WSTETH
  // it('SparkWstETH', async () => loanWETH(PROJECTS.Spark, TOKENS.WSTETH), TIMEOUT);

  it('ETH->SparkWETH', async () => ethToLoanWEth(PROJECTS.Spark, TOKENS.WETH), TIMEOUT);
  // wrong token address WSTETH
  // it('ETH->SparkWstETH', async () => ethToLoanWEth(PROJECTS.Spark, TOKENS.WSTETH), TIMEOUT);
  // compound either not supported by registry yet or there is some issue.
});
