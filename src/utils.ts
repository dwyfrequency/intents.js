import { BigInt as ProtoBigInt } from 'blndgs-model';
import { ethers } from 'ethers';
/**
 * Converts a number or bigint into a ProtoBigInt, suitable for serialization and transport in network requests.
 *
 * @param value The numerical value to convert. Must be a positive non-zero integer.
 * @returns A ProtoBigInt instance representing the provided value.
 * @throws Error if the provided value is zero or negative.
 */
export function toBigInt(value: ethers.BigNumber | number): ProtoBigInt {
  if (typeof value !== 'number' && !ethers.BigNumber.isBigNumber(value)) {
    throw new Error('Value must be a number or ethers.BigNumber');
  }
  // Convert all inputs to BigNumber to simplify handling inside the function
  const bigNumberValue = ethers.BigNumber.isBigNumber(value) ? value : ethers.BigNumber.from(value);

  let hexString = bigNumberValue.toHexString().substring(2); // remove the '0x' prefix
  hexString = hexString.length % 2 !== 0 ? '0' + hexString : hexString; // pad if necessary

  const byteArray = ethers.utils.arrayify('0x' + hexString); // create a Uint8Array
  const protoBigInt = new ProtoBigInt();
  protoBigInt.value = byteArray;
  return protoBigInt;
}
/**
 * Converts a floating-point number to Wei (the smallest unit of Ether).
 *
 * This function takes a floating-point number representing an Ether value
 * and converts it into Wei, which is represented as a `BigNumber`.
 *
 * @param {number} amount - The amount in Ether as a floating-point number.
 * @returns {ethers.BigNumber} - The corresponding amount in Wei as a `BigNumber`.
 */
export function floatToWei(amount: number, decimal: number): ethers.BigNumber {
  // Convert float to string with high precision
  const amountStr = amount.toFixed(decimal);
  return ethers.utils.parseEther(amountStr);
}

/**
 * Converts a Wei value (as a `BigNumber`) to a floating-point number representing Ether.
 *
 * This function takes a value in Wei and converts it to a floating-point number
 * representing the equivalent amount in Ether.
 *
 * @param {ethers.BigNumber} wei - The amount in Wei as a `BigNumber`.
 * @returns {number} - The corresponding amount in Ether as a floating-point number.
 */
export function weiToFloat(wei: ethers.BigNumber): number {
  // Convert wei to float, limiting to 18 decimal places
  return parseFloat(ethers.utils.formatEther(wei));
}

/**
 * Converts a token amount (as a `BigNumber`) to a floating-point number,
 * using the specified number of decimals for the token.
 *
 * This function is useful for converting token amounts to human-readable
 * floating-point numbers based on the token's decimals.
 *
 * @param {ethers.BigNumber} amount - The amount of tokens as a `BigNumber`.
 * @param {number} decimals - The number of decimal places the token uses.
 * @returns {number} - The corresponding amount as a floating-point number.
 */
export function tokenToFloat(amount: ethers.BigNumber, decimals: number): number {
  return parseFloat(ethers.utils.formatUnits(amount, decimals));
}

/**
 * Converts a floating-point number to a token amount represented as a `BigNumber`,
 * using the specified number of decimals for the token.
 *
 * This function takes a floating-point number and converts it into the smallest
 * unit of the token, based on the token's decimals.
 *
 * @param {number} amount - The amount as a floating-point number.
 * @param {number} decimals - The number of decimal places the token uses.
 * @returns {ethers.BigNumber} - The corresponding amount as a `BigNumber`.
 */
export function floatToToken(amount: number, decimals: number): ethers.BigNumber {
  const amountStr = amount.toFixed(decimals);
  return ethers.utils.parseUnits(amountStr, decimals);
}

/**
 * Converts a floating-point number to a ProtoBigInt representation.
 *
 * This function takes a numeric amount and the number of decimal places for a token,
 * converts it to the smallest unit of the token (considering the decimal places),
 * and then converts that to a ProtoBigInt format suitable for blockchain transactions.
 *
 * @param {number} amount - The amount to convert, as a floating-point number.
 * @param {number} decimal - The number of decimal places for the token (e.g., 18 for ETH).
 * @returns {ProtoBigInt} The amount converted to a ProtoBigInt format.
 *
 * @example
 * // Convert 0.1 ETH to ProtoBigInt
 * const bigIntAmount = amountToBigInt(0.1, 18);
 *
 * @example
 * // Convert 100 USDC to ProtoBigInt (USDC has 6 decimal places)
 * const bigIntAmount = amountToBigInt(100, 6);
 *
 * @throws {Error} If the input amount is negative or if the conversion fails.
 */
export function amountToBigInt(amount: number, decimal: number) {
  if (amount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  return toBigInt(floatToToken(amount, decimal));
}

// // normalizeChainId normalize the chain ID
// // important: not in use but need it in future
// export function normalizeChainId(chainId: ProtoBigInt | ethers.BigNumber | number): number {
//   if (typeof chainId === 'number') {
//     return chainId;
//   }
//   if (chainId instanceof ethers.BigNumber) {
//     return chainId.toNumber();
//   }
//   if ('value' in chainId && chainId.value instanceof Uint8Array) {
//     // Convert Uint8Array to number
//     return parseInt(Buffer.from(chainId.value).toString('hex'), 16);
//   }
//   throw new Error('Unsupported chainId format');
// }
