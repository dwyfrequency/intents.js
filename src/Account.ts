import { BytesLike, ethers, Signer } from 'ethers';
import { ENTRY_POINT, FACTORY } from './constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Presets } from 'userop';
import { tokenToFloat, weiToFloat } from './utils';
import { ChainConfig } from './types';

export class Account {
  /**
   * Private constructor to prevent direct instantiation.
   * @param signer The Signer object used for transaction signing.
   * @param sender The Ethereum address of the sender.
   * @param _providers A map of chain IDs to JSON RPC Providers for network interactions.
   */
  private constructor(
    public signer: Signer,
    public sender: string,
    private _providers: Map<number, JsonRpcProvider>,
  ) {}

  /**
   * Asynchronously creates an instance of Account using provided signer and chain configurations.
   * @param signer The ethers Signer for signing transactions.
   * @param chainConfigs Configuration mapping chain IDs to their configurations.
   * @returns An instance of the Account class.
   */
  static async createInstance(signer: Signer, chainConfigs: Record<number, ChainConfig>) {
    const providers = new Map<number, JsonRpcProvider>();
    Object.entries(chainConfigs).forEach(([chainId, config]) => {
      providers.set(Number(chainId), new ethers.providers.JsonRpcProvider(config.rpcUrl));
    });

    const sender = await signer.getAddress();
    return new Account(signer, sender, providers);
  }

  /**
   * Retrieves the sender's Ethereum address using a builder preset.
   * @param signer The ethers Signer for signing transactions.
   * @param bundlerUrl URL of the bundler.
   * @param salt Optional nonce or unique identifier to customize the sender address generation.
   * @returns The sender's Ethereum address.
   */
  static async getSender(signer: Signer, bundlerUrl: string, salt: BytesLike = '0'): Promise<string> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, bundlerUrl, {
      factory: FACTORY,
      salt: salt,
    });
    return simpleAccount.getSender();
  }

  /**
   * Generates initialization code for smart contract interactions.
   * @param nonce The nonce to use for generating the initialization code.
   * @returns The initialization code as a hexadecimal string.
   */
  async getInitCode(nonce: string): Promise<string> {
    const ownerAddress = await this.signer.getAddress();
    return nonce !== '0' ? `0x${FACTORY}5fbfb9cf${ownerAddress.substring(2).padStart(64, '0')}` : '0x';
  }

  /**
   * Fetches the current nonce for a given sender address from a smart contract.
   * @param chainId The chain ID where the query should be executed.
   * @param sender The sender's address to query the nonce for.
   * @returns The nonce as a string.
   */
  async getNonce(chainId: number, sender: string): Promise<string> {
    const abi = [
      {
        inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
        name: 'getNonce',
        outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const provider = this._providers.get(chainId);
    if (!provider) throw new Error(`Provider for chain ID ${chainId} not found`);

    const contract = new ethers.Contract(ENTRY_POINT, abi, provider);
    const nonce = await contract.getNonce(sender, '0');
    return nonce.toString();
  }

  /**
   * Adds balance to the account for testing purposes, default is 0.5 ETH.
   * @param chainId The chain ID where the operation should be executed.
   * @param supply The amount of ETH to add to the account.
   */
  async faucet(chainId: number, supply = 0.5): Promise<void> {
    const method = 'tenderly_addBalance';
    const params = [[this.sender], '0x' + (supply * 10 ** 18).toString(16)];
    const provider = this._providers.get(chainId);
    if (!provider) throw new Error(`Provider for chain ID ${chainId} not found`);

    await provider.send(method, params);
  }

  /**
   * Retrieves the balance of the account in ETH or a specified ERC-20 token.
   * @param chainId The chain ID to fetch the balance from.
   * @param tokenAddress Optional address of the ERC-20 token contract, defaults to ETH.
   * @returns The balance as a number formatted to a human-readable format.
   */
  async getBalance(chainId: number, tokenAddress?: string): Promise<number> {
    const provider = this._providers.get(chainId);
    if (!provider) throw new Error(`Provider for chain ID ${chainId} not found`);

    if (!tokenAddress || tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      const balance = await provider.getBalance(this.sender);
      return weiToFloat(balance);
    }

    const abi = [
      {
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
      },
    ];

    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const [balance, decimals] = await Promise.all([contract.balanceOf(this.sender), contract.decimals()]);
    return tokenToFloat(balance, decimals);
  }
}
