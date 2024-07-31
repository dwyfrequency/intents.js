import { Asset, Loan, CHAINS, IntentBuilder, PROJECTS, toBigInt, Account } from '../src';
import { TIMEOUT, TOKENS } from './constants';
import { initTest } from './testUtils';

describe('Loan', () => {
  let intentBuilder: IntentBuilder, account: Account;

  const loanWETH = async function (project: string, asset: string) {
    const assetETH = new Asset({
        address: TOKENS.ETH,
        amount: toBigInt(0.1 * 10 ** 18),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      assetWETH = new Asset({
        address: asset,
        amount: toBigInt(0.1 * 10 ** 18),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      loanAaveWETH = new Loan({
        address: project,
        asset: asset,
        chainId: toBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await account.getBalance(TOKENS.ETH);
    await intentBuilder.execute(assetETH, assetWETH, account);
    await intentBuilder.execute(assetWETH, loanAaveWETH, account);

    const finalEthBalance = await account.getBalance(TOKENS.ETH);
    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  };

  const ethToLoanWEth = async function (project: string, tokenAddress: string) {
    const assetETH = new Asset({
        address: TOKENS.ETH,
        amount: toBigInt(0.1 * 10 ** 18),
        chainId: toBigInt(CHAINS.Ethereum),
      }),
      loanAaveWETH = new Loan({
        address: project,
        asset: tokenAddress,
        chainId: toBigInt(CHAINS.Ethereum),
      });

    const initialEthBalance = await account.getBalance(TOKENS.ETH);
    await intentBuilder.execute(assetETH, loanAaveWETH, account);

    const finalEthBalance = await account.getBalance(TOKENS.ETH);
    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  };

  beforeAll(async () => {
    ({ account, intentBuilder } = await initTest());
    await account.faucet(1);
  });

  it(
    'AaveETH',
    async () => {
      const assetETH = new Asset({
          address: TOKENS.ETH,
          amount: toBigInt(0.1 * 10 ** 18),
          chainId: toBigInt(CHAINS.Ethereum),
        }),
        loanAaveETH = new Loan({
          address: PROJECTS.Aave,
          asset: TOKENS.ETH,
          chainId: toBigInt(CHAINS.Ethereum),
        });

      const initialEthBalance = await account.getBalance(TOKENS.ETH);
      await intentBuilder.execute(assetETH, loanAaveETH, account);

      const finalEthBalance = await account.getBalance(TOKENS.ETH);
      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    },
    TIMEOUT,
  );
  // AAVE
  it('AaveWETH', async () => loanWETH(PROJECTS.Aave, TOKENS.Weth), TIMEOUT);
  // it('AaveWstETH', async () => loanWETH(PROJECTS.Aave, TOKENS.WstETH), TIMEOUT);
  // it('AaveRETH', async () => loanWETH(PROJECTS.Aave, TOKENS.RETH), TIMEOUT);

  it('ETH->AaveWETH', async () => ethToLoanWEth(PROJECTS.Aave, TOKENS.Weth), TIMEOUT);
  // it('ETH->AaveWstETH', async () => ethToLoanWEth(PROJECTS.Aave, TOKENS.WstETH), TIMEOUT);
  // it('ETH->AaveRETH', async () => ethToLoanWEth(PROJECTS.Aave, TOKENS.RETH), TIMEOUT);

  // LIDO
  // it('LidoWETH', async () => loanWETH(PROJECTS.Lido, TOKENS.Weth), TIMEOUT);
  // it('LidoWstETH', async () => loanWETH(PROJECTS.Lido, TOKENS.WstETH), TIMEOUT);
  // it('LidoRETH', async () => loanWETH(PROJECTS.Lido, TOKENS.RETH), TIMEOUT);

  // it('ETH->LidoWETH', async () => ethToLoanWEth(PROJECTS.Lido, TOKENS.Weth), TIMEOUT);
  // it('ETH->LidoWstETH', async () => ethToLoanWEth(PROJECTS.Lido, TOKENS.WstETH), TIMEOUT);
  // it('ETH->LidoRETH', async () => ethToLoanWEth(PROJECTS.Lido, TOKENS.RETH), TIMEOUT);
});
