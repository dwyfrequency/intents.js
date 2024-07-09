import { ethers } from 'ethers';
import { NODE_URL } from './constants';

export async function faucet(address: string): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

  const method = 'tenderly_addBalance';
  const params = [[address], '0xDE0B6B3A7640000'];
  const jsonRpcRequest = {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 1,
  };

  try {
    const response = await provider.send(jsonRpcRequest.method, jsonRpcRequest.params);
    // console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function checkBalance(address: string, tokenAddress?: string): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

  try {
    if (tokenAddress) {
      if (tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        // Handle ETH balance
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balance);
        // console.log(`Ethereum Balance: ${formattedBalance}`);
        return formattedBalance;
      } else {
        // ERC-20 token balance
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
        const formattedBalance = ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals for simplicity
        // console.log(`ERC20 Balance: ${formattedBalance}`);
        return formattedBalance;
      }
    } else {
      // Default to ETH balance if no token address is provided
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);
      // console.log(`Ethereum Balance: ${formattedBalance}`);
      return formattedBalance;
    }
  } catch (error) {
    console.error('Error checking balance:', error);
    return '0';
  }
}
