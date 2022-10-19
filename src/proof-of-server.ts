/**
 * @module Signer signs a message using Wallet module.
 */
import { ethers } from  "ethers";
import SmartcontractData from "./utils/smartcontract-data";
import { validateParams } from './utils/validate-params';

/**
 * @description Generate a signature that proofs that data was approved by the Server.
 * Its for the data that client will send to blockchain network.
 * @param params list of parameters to sign
 * @param wallet The signer
 * @returns the generated signature
 * @throws Error if no Method Params
 */ 
export default async (params: Array<SmartcontractData>, wallet: ethers.Wallet): Promise<string> => {
    if (!validateParams(params)) {
        throw Error(`Empty data`);
    }

    let hash = SmartcontractData.concat(params).hash();
    let arr = ethers.utils.arrayify(hash);
 
    try {
        return await wallet.signMessage(arr);
    } catch (error) {
        console.error(error);
        console.error(params);
        console.error(`Error during signing the message by wallet '${wallet.address}'`);
        return "";
    }
}
