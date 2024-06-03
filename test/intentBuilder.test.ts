import { IntentBuilder } from '../src/IntentBuilder';
import { Projects } from '../src/Projects';
import { CHAINS, NODE_URL } from '../src/Constants';
import { TOKENS } from './constants';

import { Intent } from '../src/index';
import { ethers } from 'ethers';


function randomToBytesLike(): ethers.BytesLike {
  // Generate a random number using Math.random() and convert it to a hex string
  const randomNum = Math.random();

  // Convert the random number to a string representing its hexadecimal value
  // Scale the random number to a larger integer range to get more bytes
  const hexString = ethers.utils.hexlify(Math.floor(randomNum * Number.MAX_SAFE_INTEGER));

  // Pad the hex string to ensure it represents a full byte sequence if necessary
  // ethers.utils.hexZeroPad ensures that the hex string has at least 32 bytes (64 hex characters)
  return ethers.utils.hexZeroPad(hexString, 32);
}

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

  beforeAll(async () => {
    intentBuilder = new IntentBuilder();
    randomAccount = generateRandomAccount();
    signer = randomAccount;
    sender = await intentBuilder.getSender(signer);
  });

  it('should have an initial ETH balance of 0', async () => {
    console.log("sender: " + sender)
    const balance = await intentBuilder.checkBalance(sender, NODE_URL);
    expect(parseFloat(balance)).toBe(0);
  }, 100000);

  // it('should faucet the account with 1 ETH and check the balance', async () => {
  //   const oneEthInWei = ethers.utils.parseEther('1').toHexString();

  //   // Faucet the account with 1 ETH
  //   await intentBuilder.faucet(sender, "1", NODE_URL);

  //   // Check the balance after faucet
  //   const balanceAfter = await intentBuilder.checkBalance(sender, NODE_URL);
  //   expect(parseFloat(balanceAfter)).toBe(1);
  // }, 100000);

  // it('ETH -> ERC20 Swap', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ERC20 -> ETH Swap', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ERC20 -> ERC20 Swap', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "TOKEN",
  //       address: TOKENS.Usdc,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ERC20 -> ETH Stake', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "STAKE",
  //       address: Projects.Lido,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ETH -> ETH Stake', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "STAKE",
  //       address: Projects.Lido,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ETH -> ERC20 Stake', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "STAKE",
  //       address: TOKENS.Usdc,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ETH -> ETH Loan', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Ethereum,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ERC20 -> ERC20 Loan', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Dai,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ERC20 -> ETH Loan', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Ethereum,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('ETH -> ERC20 Loan', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Dai,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('Loaned ERC20 -> ETH', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "TOKEN",
  //       address: TOKENS.Ethereum,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);

  // it('Loaned ERC20 -> ERC20', async () => {
  //   const intents = {
  //     sender: sender,
  //     from: {
  //       type: "LOAN",
  //       address: Projects.Aave,
  //       asset: TOKENS.Dai,
  //       amount: 0.1,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //     to: {
  //       type: "TOKEN",
  //       address: TOKENS.Usdc,
  //       chainId: CHAINS.ethereum.id,
  //     },
  //   } as Intent;

  //   try {
  //     const intentBuilder = new IntentBuilder();
  //     await intentBuilder.execute(intents, signer, NODE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }, 100000);
});
