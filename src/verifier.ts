/**
 * @module Signer signs a message using Wallet module.
 */
import { ethers } from  "ethers";
import SmartcontractData from "./utils/smartcontract-data";
import { validateParams } from './utils/validate-params';


/**
 * @description Verifies the signature signature that proofs that data was approved by the Server.
 * Its for the data that client will send to blockchain network.
 * @param params list of parameters to sign
 * @param wallet The signer
 * @returns the generated address or empty string
 */ 
export default async (params: Array<SmartcontractData>, signature: string): Promise<String> => {
    if (!validateParams(params)) {
        console.error(`Invalid parameters given!`);
        return "";
    }

    let hash = SmartcontractData.concat(params).hash();

    const message = ethers.utils.solidityKeccak256(['string', 'bytes32'], ['\x19Ethereum Signed Message:\n32', hash]);
    let arr = ethers.utils.arrayify(message);
 
    try {
        let address = await ethers.utils.recoverAddress(arr, signature);
        return address;
    } catch (error) {
        console.error(error);
        console.error(params);
        console.error(`Error during the verification of the messaget'`);
        return "";
    }
}
