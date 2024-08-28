import { IntentBuilder, PROJECTS, CHAINS, Asset, Stake, toBigInt, Account, amountToBigInt } from './src';
import { ethers } from 'ethers';
import { ChainConfigs } from './src/types';

const signer = new ethers.Wallet('private key');

const amount = 0.1;
const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const ethDecimals = 18;

const from = new Asset({
  address: ethAddress,
  amount: amountToBigInt(amount, ethDecimals),
  chainId: toBigInt(CHAINS.Ethereum),
});

const to = new Stake({
  amount: amountToBigInt(amount, ethDecimals),
  address: PROJECTS.Lido,
  chainId: toBigInt(CHAINS.Ethereum),
});

async function executeIntent() {
  const chainConfigs: ChainConfigs = {
    888: {
      rpcUrl: 'https://virtual.mainnet.rpc.tenderly.co/13d45a24-2474-431e-8f19-31f251f6cd2a',
      bundlerUrl: 'https://eth.bundler.dev.balloondogs.network',
    },
    890: {
      rpcUrl: 'https://virtual.binance.rpc.tenderly.co/4e9d15b6-3c42-43b7-a254-359a7893e8e6',
      bundlerUrl: 'https://bsc.bundler.dev.balloondogs.network',
    },
  };

  const account = await Account.createInstance(signer, chainConfigs);
  const intentBuilder = await IntentBuilder.createInstance(chainConfigs);

  try {
    await intentBuilder.execute(from, to, account, 888);
    console.log('Intent executed successfully.');
  } catch (error) {
    console.error('Error executing intent:', error);
  }
}

executeIntent();
