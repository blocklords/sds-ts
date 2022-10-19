/**
 * @module Wallet works with wallets. It initializes them from the privatekey.
 */
import { ethers } from "ethers";

/**
 * @description Init a wallet that will sign messages or send transactions.
 * @param privateKey that will be used to create a wallet.
 * @returns ethers.Wallet
 * @throws error if Privatekey is invalid.
 */
let fromPrivateKey = (privateKey: string): ethers.Wallet => {
    try {
        return new ethers.Wallet(privateKey);
    } catch (error) {
        throw Error(`Incorrect Private Key. Make sure it's right`);
    }
};

export {
    fromPrivateKey
}

export default {
    fromPrivateKey
}