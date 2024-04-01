import { ethers, BytesLike } from 'ethers'
import { Intent } from './InterfaceIntent'
import { rpcBundlerUrl, factoryAddr, entryPointAddr, chainID } from './Constants'
import { Presets, Client, UserOperationBuilder } from 'userop'

export class IntentBuilder {
  public async getSender(signer: ethers.Signer, salt: BytesLike = '0'): Promise<string> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, rpcBundlerUrl, {
      factory: factoryAddr,
      salt: salt,
    })
    const sender = simpleAccount.getSender()

    return sender
  }

  async execute(intents: Intent, signer: ethers.Signer, nodeUrl: string, salt: BytesLike = '0'): Promise<void> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, rpcBundlerUrl, {
      factory: factoryAddr,
      salt: salt,
    })
    let ownerAddress = await signer.getAddress()
    ownerAddress = ownerAddress.substring(2, ownerAddress.length) //remove 0x value
    const sender = simpleAccount.getSender()

    const intent = ethers.utils.toUtf8Bytes(JSON.stringify(intents))
    const nonce = await this.getNonce(sender, nodeUrl)
    const initCode = await this.getInitCode(ownerAddress, sender, nodeUrl)

    const builder = new UserOperationBuilder()
      .useDefaults({ sender })
      .setCallData(intent)
      .setPreVerificationGas('0x493E0')
      .setMaxFeePerGas('0')
      .setMaxPriorityFeePerGas('0')
      .setVerificationGasLimit('0x493E0')
      .setCallGasLimit('0xC3500')
      .setNonce(nonce)
      .setInitCode(initCode)

    const signature = await this.getSignature(signer, builder)
    builder.setSignature(signature)

    const client = await Client.init(rpcBundlerUrl)

    const res = await client.sendUserOperation(builder, {
      onBuild: op => console.log('Signed UserOperation:', op),
    })

    console.log(`UserOpHash: ${res.userOpHash}`)
    console.log('Waiting for transaction...')

  }


  private async getInitCode(ownerAddress: string, sender: string, nodeUrl: string) {
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl)
    const code = await provider.getCode(sender)
    return code !== '0x'
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
}
