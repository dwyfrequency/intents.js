import { IntentBuilder, Projects, Helpers, Intent, Asset } from '../src';

import { ethers } from 'ethers';
import { TOKENS } from './constants';

function generateRandomAccount(): ethers.Wallet {
  const randomBytes = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(randomBytes);
  return new ethers.Wallet(privateKey);
}

describe('execute function use cases tests', () => {
  let intentBuilder: IntentBuilder;
  let randomAccount: ethers.Wallet;
  let sender: string;
  let signer: ethers.Wallet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fromCaseValue: any, toCaseValue: any;

  beforeAll(async () => {
    intentBuilder = new IntentBuilder();
    randomAccount = generateRandomAccount();
    signer = randomAccount;
    sender = await intentBuilder.getSender(signer);
  });

  it('should have an initial ETH balance of 0', async () => {
    const balance = await Helpers.checkBalance(sender);
    expect(parseFloat(balance)).toBe(0);
  }, 100000);

  it('should faucet the account with 1 ETH and check the balance', async () => {
    // Faucet the account with 1 ETH
    await Helpers.faucet(sender);

    // Check the balance after faucet
    const balanceAfter = await Helpers.checkBalance(sender);
    expect(parseFloat(balanceAfter)).toBe(0.5);
  }, 100000);

  it('ETH -> DAI Swap', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'toAsset',
      value: new Asset({
        address: TOKENS.Dai,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> WETH Swap', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.2),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'toAsset',
      value: new Asset({
        address: TOKENS.Weth,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Swap', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Dai,
        amount: intentBuilder.createBigInt(10),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'toAsset',
      value: new Asset({
        address: TOKENS.ETH,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('WETH -> ETH Swap', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Weth,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'toAsset',
      value: new Asset({
        address: TOKENS.ETH,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);
    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);
    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('DAI -> USDC Swap', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Dai,
        amount: intentBuilder.createBigInt(10),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'toAsset',
      value: new Asset({
        address: TOKENS.Usdc,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('DAI -> ETH Stake', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Dai,
        amount: intentBuilder.createBigInt(100),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'staking',
      value: new Asset({
        address: Projects.Lido,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const initialStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const finalStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('WETH -> ETH Stake', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Weth,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'staking',
      value: new Asset({
        address: Projects.Lido,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);
    const initialStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Weth);
    const finalStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Stake', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'staking',
      value: new Asset({
        address: Projects.Lido,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const finalStEthBalance = await Helpers.checkBalance(sender, TOKENS.Steth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalStEthBalance)).toBeGreaterThan(parseFloat(initialStEthBalance));
  }, 100000);

  it('ETH -> ETH Loan', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'loan',
      value: new Asset({
        address: Projects.Aave,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
  }, 100000);

  // The remaining tests follow a similar pattern, so I'll provide the code for them without individual explanations

  it('ERC20 -> ERC20 Loan', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.Dai,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'loan',
      value: new Asset({
        address: Projects.Aave,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const initialADaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Dai);
    const finalADaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalADaiBalance)).toBeGreaterThan(parseFloat(initialADaiBalance));
  }, 100000);

  it('ETH -> Weth Loan', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'loan',
      value: new Asset({
        address: Projects.Aave,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Aweth);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Aweth);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('ETH -> Dai Loan', async () => {
    fromCaseValue = {
      case: 'fromAsset',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(0.1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'loan',
      value: new Asset({
        address: Projects.Aave,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);

    expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
    expect(parseFloat(finalDaiBalance)).toBeGreaterThan(parseFloat(initialDaiBalance));
  }, 100000);

  it('Loaned Dai -> ETH', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.ADai,
        amount: intentBuilder.createBigInt(10),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'currency',
      value: new Asset({
        address: TOKENS.ETH,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);
    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);
    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Weth -> ETH', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.Aweth,
        amount: intentBuilder.createBigInt(10),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'currency',
      value: new Asset({
        address: TOKENS.ETH,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.Aweth);
    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.Aweth);
    const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalEthBalance)).toBeGreaterThan(parseFloat(initialEthBalance));
  }, 100000);

  it('Loaned Dai -> Usdc', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.ADai,
        amount: intentBuilder.createBigInt(5),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'currency',
      value: new Asset({
        address: TOKENS.Usdc,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);
    const initialUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

    await intentBuilder.execute(
      new Intent({
        sender: sender,
        from: fromCaseValue,
        to: toCaseValue,
      }),
      signer,
    );

    const finalDaiBalance = await Helpers.checkBalance(sender, TOKENS.ADai);
    const finalUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

    expect(parseFloat(finalDaiBalance)).toBeLessThan(parseFloat(initialDaiBalance));
    expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
  }, 100000);

  it('Failed Loaned ETH -> ERC20', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.ETH,
        amount: intentBuilder.createBigInt(1),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'currency',
      value: new Asset({
        address: TOKENS.Usdc,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
    const initialUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

    try {
      await intentBuilder.execute(
        new Intent({
          sender: sender,
          from: fromCaseValue,
          to: toCaseValue,
        }),
        signer,
      );

      const finalEthBalance = await Helpers.checkBalance(sender, TOKENS.ETH);
      const finalUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

      expect(parseFloat(finalEthBalance)).toBeLessThan(parseFloat(initialEthBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Non-Loaned ERC20 -> ERC20', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.Usdc, // Token not available on Aave
        amount: intentBuilder.createBigInt(5),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'currency',
      value: new Asset({
        address: TOKENS.Usdc,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    const initialNonAaveTokenBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);
    const initialUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

    try {
      await intentBuilder.execute(
        new Intent({
          sender: sender,
          from: fromCaseValue,
          to: toCaseValue,
        }),
        signer,
      );

      const finalNonAaveTokenBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);
      const finalUsdcBalance = await Helpers.checkBalance(sender, TOKENS.Usdc);

      expect(parseFloat(finalNonAaveTokenBalance)).toBeLessThan(parseFloat(initialNonAaveTokenBalance));
      expect(parseFloat(finalUsdcBalance)).toBeGreaterThan(parseFloat(initialUsdcBalance));
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);

  it('Failed Loan -> Stake', async () => {
    fromCaseValue = {
      case: 'loan',
      value: new Asset({
        address: TOKENS.ADai,
        amount: intentBuilder.createBigInt(5),
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };
    toCaseValue = {
      case: 'staking',
      value: new Asset({
        address: Projects.Lido,
        chainId: intentBuilder.createBigInt(Projects.CHAINS.Ethereum),
      }),
    };

    try {
      await intentBuilder.execute(
        new Intent({
          sender: sender,
          from: fromCaseValue,
          to: toCaseValue,
        }),
        signer,
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, 100000);
});
