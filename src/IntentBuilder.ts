import { ethers, BytesLike } from 'ethers'
import { Intent } from './InterfaceIntent'
import { BUNDLER_URL, factoryAddr, entryPointAddr, chainID } from './Constants'
import { Presets, Client, UserOperationBuilder } from 'userop'



export class IntentBuilder {

  public async getSender(signer: ethers.Signer, salt: BytesLike = '0'): Promise<string> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, BUNDLER_URL, {
      factory: factoryAddr,
      salt: salt,
    })
    const sender = simpleAccount.getSender()

    return sender
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchWithNodeFetch(url: string, options: any) {
    const isNode = typeof window === 'undefined';
    if (isNode) {
      const fetch = (await import('node-fetch')).default;
      return fetch(url, options);
    } else {
      return window.fetch(url, options);
    }
  }

  async execute(intents: Intent, signer: ethers.Signer, nodeUrl: string): Promise<void> {
    let ownerAddress = await signer.getAddress()
    ownerAddress = ownerAddress.substring(2, ownerAddress.length) //remove 0x value
    const sender = intents.sender;

    const intent = ethers.utils.toUtf8Bytes(JSON.stringify(intents))
    const nonce = await this.getNonce(sender, nodeUrl)
    const initCode = await this.getInitCode(nonce, ownerAddress)

    const builder = new UserOperationBuilder()
      .useDefaults({ sender })
      .setCallData(intent)
      .setPreVerificationGas('0x493E0')
      .setMaxFeePerGas('0x493E0')
      .setMaxPriorityFeePerGas('0')
      .setVerificationGasLimit('0x493E0')
      .setCallGasLimit('0xC3500')
      .setNonce(nonce)
      .setInitCode(initCode)

    const signature = await this.getSignature(signer, builder)
    builder.setSignature(signature)

    const client = await Client.init(BUNDLER_URL)

    const res = await client.sendUserOperation(builder, {
      onBuild: op => console.log('Signed UserOperation:', op),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const solvedHash = (res as any).userOpHash.solved_hash

    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json'
    };

    const body = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getUserOperationReceipt',
      params: [
        solvedHash
      ]
    });

    const resReceipt = await this.fetchWithNodeFetch(BUNDLER_URL, {
      method: 'POST',
      headers: headers,
      body: body
    })

    const reciept = await resReceipt.json()
    console.log(reciept)
  }


  private async getInitCode(nonce: string, ownerAddress: string) {
    return nonce !== '0x0'
      ? '0x'
      : `${factoryAddr}5fbfb9cf000000000000000000000000${ownerAddress}0000000000000000000000000000000000000000000000000000000000000000`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getSignature(signer: ethers.Signer, builder: any) {
    const packedData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32'],
      [
        builder.getSender(),
        builder.getNonce(),
        ethers.utils.keccak256(builder.getInitCode()),
        ethers.utils.keccak256(builder.getCallData()),
        builder.getCallGasLimit(),
        builder.getVerificationGasLimit(),
        builder.getPreVerificationGas(),
        builder.getMaxFeePerGas(),
        builder.getMaxPriorityFeePerGas(),
        ethers.utils.keccak256(builder.getPaymasterAndData()),
      ]
    )

    const enc = ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'address', 'uint256'],
      [ethers.utils.keccak256(packedData), entryPointAddr, chainID]
    )

    const userOpHash = ethers.utils.keccak256(enc)
    const signature = await signer.signMessage(ethers.utils.arrayify(userOpHash))
    return signature
  }

  private async getNonce(sender: string, nodeUrl: string) {
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl)
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
    ]

    // Create a contract instance
    const contract = new ethers.Contract(entryPointAddr, abi, provider)

    try {
      const nonce = await contract.getNonce(sender, '0')
      console.log('Nonce:', nonce.toString())
      return nonce.toString()
    } catch (error) {
      console.error('Error getting nonce:', error)
    }
  }

  public async faucet(address: string, amount: string, nodeUrl: string): Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

    // Define the JSON-RPC request for the tenderly_addBalance method
    const method = 'tenderly_addBalance';
    const params = [[address], amount];
    const jsonRpcRequest = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1, // The ID can be any number or string
    };

    try {
      const response = await provider.send(jsonRpcRequest.method, jsonRpcRequest.params);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  public async checkBalance(address: string, nodeUrl: string, tokenAddress?: string): Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

    try {
      if (tokenAddress) {
        // ERC20 balance check
        const abi = [
          {
            constant: true,
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            type: 'function',
          },
        ];

        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const balance = await contract.balanceOf(address);
        console.log(`ERC20 Balance: ${ethers.utils.formatUnits(balance, 18)}`);
      } else {
        // ETH balance check
        const balance = await provider.getBalance(address);
        console.log(`ETH Balance: ${ethers.utils.formatEther(balance)}`);
      }
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  }

}
