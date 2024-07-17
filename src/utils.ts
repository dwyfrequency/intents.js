import { ethers } from 'ethers';
import { NODE_URL } from './constants';

export async function faucet(address: string, supply = 0.5): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

  const method = 'tenderly_addBalance';
  const params = [[address], '0x' + supply.toString(16)];
  const jsonRpcRequest = {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 1,
  };

  try {
    const response = await provider.send(jsonRpcRequest.method, jsonRpcRequest.params);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getBalance(address: string, tokenAddress?: string): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

  if (!tokenAddress || tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    // Handle ETH balance
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
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
  return ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals for simplicity
}
