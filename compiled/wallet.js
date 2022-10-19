"use strict";
exports.__esModule = true;
exports.fromPrivateKey = void 0;
/**
 * @module Wallet works with wallets. It initializes them from the privatekey.
 */
var ethers_1 = require("ethers");
/**
 * @description Init a wallet that will sign messages or send transactions.
 * @param privateKey that will be used to create a wallet.
 * @returns ethers.Wallet
 * @throws error if Privatekey is invalid.
 */
var fromPrivateKey = function (privateKey) {
    try {
        return new ethers_1.ethers.Wallet(privateKey);
    }
    catch (error) {
        throw Error("Incorrect Private Key. Make sure it's right");
    }
};
exports.fromPrivateKey = fromPrivateKey;
exports["default"] = {
    fromPrivateKey: fromPrivateKey
};
//# sourceMappingURL=wallet.js.map