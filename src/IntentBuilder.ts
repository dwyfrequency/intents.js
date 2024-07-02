import { ethers } from 'ethers';
import { CHAIN_ID, ENTRY_POINT } from './constants';
import { Client, UserOperationBuilder } from 'userop';
import { FromState, getSender, State, ToState } from './index';
import { Asset, Intent, Loan, Stake } from './';
import { getInitCode, getNonce } from './walletUtils';

export class IntentBuilder {
  private constructor(
    private _client: Client,
    private _bundlerUrl: string,
  ) {}

  static async createInstance(bundlerUrl: string) {
    return new IntentBuilder(await Client.init(bundlerUrl), bundlerUrl);
  }

  async execute(from: State, to: State, signer: ethers.Signer): Promise<void> {
    try {
      const intents = new Intent({
        from: this.setFrom(from),
        to: this.setTo(to),
      });

      const sender = await getSender(signer, this._bundlerUrl);

      const intent = ethers.utils.toUtf8Bytes(JSON.stringify(intents));
      const nonce = await getNonce(sender);
      const initCode = await getInitCode(nonce, signer);

      const builder = new UserOperationBuilder()
        .useDefaults({ sender })
        .setCallData(intent)
        .setPreVerificationGas('0x493E0')
        .setMaxFeePerGas('0x493E0')
        .setMaxPriorityFeePerGas('0')
        .setVerificationGasLimit('0x493E0')
        .setCallGasLimit('0xC3500')
        .setNonce(nonce)
        .setInitCode(initCode);

      const signature = await this.getSignature(signer, builder);
      builder.setSignature(signature);

      const res = await this._client.sendUserOperation(builder, {
        onBuild: op => console.log('Signed UserOperation:', op),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const solvedHash = (res as any).userOpHash.solved_hash;

      console.log(await this.getReceipt(solvedHash));
    } catch (error) {
      console.error('Error executing intent:', error);
    }
  }

  private setFrom(state: State): FromState {
    switch (true) {
      case state instanceof Asset:
        return { case: 'fromAsset', value: state };
      case state instanceof Loan:
        return { case: 'fromLoan', value: state };
      case state instanceof Stake:
        return { case: 'fromStake', value: state };
      default:
        return { case: undefined };
    }
  }

  private setTo(state: State): ToState {
    switch (true) {
      case state instanceof Asset:
        return { case: 'toAsset', value: state };
      case state instanceof Stake:
        return { case: 'toStake', value: state };
      case state instanceof Loan:
        return { case: 'toLoan', value: state };
      default:
        return { case: undefined };
    }
  }

  private async getSignature(signer: ethers.Signer, builder: UserOperationBuilder) {
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
      ],
    );

    const enc = ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'address', 'uint256'],
      [ethers.utils.keccak256(packedData), ENTRY_POINT, CHAIN_ID],
    );

    const userOpHash = ethers.utils.keccak256(enc);
    return await signer.signMessage(ethers.utils.arrayify(userOpHash));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetchWithNodeFetch(url: string, options: any) {
    const isNode = typeof window === 'undefined';
    if (isNode) {
      const fetchModule = await import('node-fetch');
      const fetch = fetchModule.default;
      return fetch(url, options);
    } else {
      return window.fetch(url, options);
    }
  }

  private async getReceipt(solvedHash: string) {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const body = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getUserOperationReceipt',
      params: [solvedHash],
    });

    const resReceipt = await this.fetchWithNodeFetch(this._bundlerUrl, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    return await resReceipt.json();
  }
}
