import { Intent } from '../src';
import { IntentBuilder } from '../src';
import ethers from 'ethers';
import { CHAINS } from '../src/constants';
import { TOKENS } from './constants';

const nodeUrl = 'https://virtual.mainnet.rpc.tenderly.co/c4100609-e3ff-441b-a803-5a4e95de809f';
const privateKey = 'c19fd3899ccdefe8914b9d47a0178fb54869b3951b208c953571c88b9db1b820';
const provider = new ethers.providers.InfuraProvider('mainnet', nodeUrl);
const signer = new ethers.Wallet(privateKey, provider);

describe('execute function use cases tests', () => {
  it('ETH -> ERC20 Swap', async () => {
    const intents: Intent = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: TOKENS.Ethereum,
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: TOKENS.Dai,
        chainId: CHAINS.ethereum.id,
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
  it('ERC20 -> ETH Swap', async () => {
    const intents = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '0.1',
        chainId: '1',
      },
      to: {
        type: 'TOKEN',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        asset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        // amount: toAmount,
        chainId: '1',
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
  it('ERC20 -> ETH Stake', async () => {
    const intents = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '0.1',
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'STAKE',
        address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', //Lido
        // asset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        // amount: toAmount,
        chainId: CHAINS.ethereum.id,
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
  it('ETH -> ETH Stake', async () => {
    const intents = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        amount: '0.1',
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'STAKE',
        address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', //Lido
        // asset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        // amount: toAmount,
        chainId: CHAINS.ethereum.id,
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);

  // it('TOKEN ERC20 -> ETH Loan', async () => {
  //   const intents = {
  //     sender: "0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9",
  //     from: {
  //       type: "TOKEN",
  //       address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  //       amount: "0.1",
  //       chainId: '1',
  //     },
  //     to: {
  //       type: "LOAN",
  //       address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", //Aave
  //       asset: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //       // amount: toAmount,
  //       chainId: '1',
  //     },
  //   }

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     const result = await intentBuilder.execute(intents, signer, nodeUrl);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 1000000);
  it('TOKEN ETH -> ETH Loan', async () => {
    const intents = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        amount: '0.1',
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', //Aave
        asset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        // amount: toAmount,
        chainId: CHAINS.ethereum.id,
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
  it('TOKEN ERC20 -> ERC20 Loan', async () => {
    const intents = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'TOKEN',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '0.1',
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'LOAN',
        address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', //Aave
        asset: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        // amount: toAmount,
        chainId: CHAINS.ethereum.id,
      },
    };

    try {
      const intentBuilder = new IntentBuilder();
      const result = await intentBuilder.execute(intents, signer, nodeUrl);
    } catch (error) {
      throw error;
    }
  }, 100000);
  it('Loan ERC20 -> ERC20 Token', async () => {
    const intent: Intent = {
      sender: '0x790625d89fC0b624DFaEFc9d175F2b79fF4444c9',
      from: {
        type: 'LOAN',
        asset: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', //Aave
        amount: 0.1,
        chainId: CHAINS.ethereum.id,
      },
      to: {
        type: 'TOKEN',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //Aave
        // asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        // amount: toAmount,
        chainId: CHAINS.ethereum.id,
      },
    };

    const intentBuilder = new IntentBuilder();
    await intentBuilder.execute(intent, signer, nodeUrl);
  }, 100000);
});

function tests() {
  let formProjectAddrs = '';
  let toProjectAddrs = '';

  //TODO: Hack
  if (fromMode === 'currency') {
    fromMode = 'TOKEN';
  }
  //TODO: Hack
  if (toMode === 'currency') {
    toMode = 'TOKEN';
  }
  if (toMode === 'staking') {
    toMode = 'STAKE';
  }

  const intents = {
    sender: addresses[0],
    from: {
      type: fromMode.toUpperCase(),
      address: fromSelectedToken?.address,
      amount: inputValue,
      chainId: CHAINS.ethereum.id,
    },
    to: {
      type: toMode.toUpperCase(),
      address: toMode === 'STAKE' ? '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' : toSelectedToken?.address,
      asset: toMode === 'STAKE' ? undefined : toSelectedToken?.address,
      // amount: toAmount,
      chainId: CHAINS.ethereum.id,
    },
  };

  if (intent.from.type === 'LOAN') {
    if (typeof fromSelectedProject === 'string') {
      const key = capitalize(fromSelectedProject);
      formProjectAddrs = Projects[key];
      intent.from.address = formProjectAddrs;
    }
  }

  if (intent.to.type === 'LOAN') {
    if (typeof toSelectedProject === 'string') {
      const key = capitalize(toSelectedProject);
      toProjectAddrs = Projects[key];
      intent.to.address = toProjectAddrs;
    }
  }

  if (fromExpiration) {
    if (!intent.extraData) {
      intent.extraData = {};
    }
    intent.extraData.expirationDate = addTimeToDate(fromExpiration);
  }
}
