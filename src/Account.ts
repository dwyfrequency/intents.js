import { BytesLike, ethers, Signer } from 'ethers';
import { ENTRY_POINT, FACTORY } from './constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Presets } from 'userop';

export class Account {
  /**
   * Private constructor to prevent direct instantiation.
   * @param signer The Signer object used for transaction signing.
   * @param sender The Ethereum address of the sender.
   * @param _provider The JSON RPC Provider for network interactions.
   */
  private constructor(
    public signer: Signer,
    public sender: string,
    private _provider: JsonRpcProvider,
  ) {}

  /**
   * Asynchronously creates an instance of Account.
   * @param signer The ethers Signer for signing transactions.
   * @param bundlerUrl URL of the bundler for transaction bundling.
   * @param nodeUrl URL of the Ethereum node for network communication.
   * @returns An instance of the Account class.
   */
  static async createInstance(signer: ethers.Signer, bundlerUrl: string, nodeUrl: string) {
    const sender = await Account.getSender(signer, bundlerUrl);
    return new Account(signer, sender, new ethers.providers.JsonRpcProvider(nodeUrl));
  }

  /**
   * Retrieves the sender's Ethereum address using a predefined builder preset.
   * @param signer The ethers Signer for signing transactions.
   * @param bundlerUrl URL of the bundler.
   * @param salt A nonce or unique identifier to customize the sender address generation.
   * @returns The sender's Ethereum address.
   */
  static async getSender(signer: ethers.Signer, bundlerUrl: string, salt: BytesLike = '0'): Promise<string> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, bundlerUrl, {
      factory: FACTORY,
      salt: salt,
    });
    return simpleAccount.getSender();
  }

  /**
   * Generates initialization code for smart contract interactions.
   * @param nonce The nonce to use for generating the init code.
   * @returns The initialization code as a hexadecimal string.
   */
  async getInitCode(nonce: string) {
    let ownerAddress = await this.signer.getAddress();
    // console.log('ownerAddress ' + ownerAddress);
    ownerAddress = ownerAddress.substring(2); // Remove 0x value
    // console.log('nonce ' + nonce);
    return nonce !== '0'
      ? '0x'
      : `${FACTORY}5fbfb9cf000000000000000000000000${ownerAddress}0000000000000000000000000000000000000000000000000000000000000000`;
  }

  /**
   * Fetches the current nonce for a given sender address from a smart contract.
   * @param sender The sender's address to query the nonce for.
   * @returns The nonce as a string.
   * @throws Will throw an error if the smart contract call fails.
   */
  async getNonce(sender: string): Promise<string> {
    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint192',
            name: 'key',
            type: 'uint192',
          },
        ],
        name: 'getNonce',
        outputs: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const contract = new ethers.Contract(ENTRY_POINT, abi, this._provider);

    try {
      const nonce = await contract.getNonce(sender, '0');
      return nonce.toString();
    } catch (error) {
      console.error('Error getting nonce:', error);
      throw error;
    }
  }

  /**
   * Adds balance to the account for testing purposes (likely on test networks).
   * @param supply The amount of ETH to add to the account, default is 0.5 ETH.
   */
  async faucet(supply = 0.5): Promise<void> {
    const method = 'tenderly_addBalance';
    const params = [[this.sender], '0x' + (supply * 10 ** 18).toString(16)];
    const jsonRpcRequest = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1,
    };

    try {
      const response = await this._provider.send(jsonRpcRequest.method, jsonRpcRequest.params);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Retrieves the balance of the account, either in ETH or a specified ERC-20 token.
   * @param tokenAddress The address of the ERC-20 token contract, or undefined for ETH.
   * @returns The balance as a string formatted to a human-readable format.
   */
  async getBalance(tokenAddress?: string): Promise<number> {
    if (!tokenAddress || tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // Handle ETH balance
      const balance = await this._provider.getBalance(this.sender);
      return parseFloat(ethers.utils.formatEther(balance));
    }

    const abi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const contract = new ethers.Contract(tokenAddress, abi, this._provider);
    const [balance, decimals] = await Promise.all([await contract.balanceOf(this.sender), await contract.decimals()]);
    return balance / 10 ** decimals; // Assuming 18 decimals for simplicity
  }
}
