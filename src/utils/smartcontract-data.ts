import { ethers } from  "ethers";

export enum TYPES {
    UINT8,
    UINT256,
    ADDRESS,
    DECIMAL_18, 
    DECIMAL_6,
    RAW
}

/**
 * @description Checks that value is according to the Smartcontract Type
 * Necessary before converting JS type to Smartcontract type otherwise it will fail
 * @param type TYPES
 * @param value any
 * @returns boolean 
 */
let validValue = (type: TYPES, value: any): boolean => {
    if (type === TYPES.UINT8 || type === TYPES.UINT256 || type === TYPES.DECIMAL_18 || type === TYPES.DECIMAL_6) {
        let num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            return false;
        }
    }

    if ((type === TYPES.ADDRESS || type === TYPES.RAW) && value.indexOf("0x") !== 0) {
        return false;
    }

    return true;
};

/**
 * @description Encode the value into hex format (JS type to Smartcontract type)
 * @param type TYPES
 * @param value any
 * @returns string representation in hexstring format
 */
let abiEncode = (type: TYPES, value: any): string => {
    if (type === TYPES.UINT8) {
        return ethers.utils.hexZeroPad(ethers.utils.hexlify(value), 1);
    } else if (type === TYPES.UINT256) {
        return ethers.utils.defaultAbiCoder.encode(["uint256"], [value]);
    } else if (type === TYPES.ADDRESS) {
        return value;
    } else if (type === TYPES.DECIMAL_18) {
        let wei = ethers.utils.parseEther(value.toString());
        return ethers.utils.defaultAbiCoder.encode(["uint256"], [wei]);
    } else if (type === TYPES.DECIMAL_6) {
        let wei = ethers.utils.parseUnits(value.toString(), 6);
        return ethers.utils.defaultAbiCoder.encode(["uint256"], [wei]);
    } else if (type === TYPES.RAW) {
        return value;
    }

    throw Error(`No encoding implementation of Smartcontract Type ${type}`);
}

export default class SmartcontractData {
    type: TYPES;
    value: string | number;
    public hex: string;

    constructor(type: TYPES, value: any) {
        if (!validValue(type, value)) {
            throw Error(`Invalid value ${value} of type ${type}`);
        }

        this.type = type;
        this.value = value;
        this.hex = abiEncode(type, value);
    }

    hash(): string {
        return ethers.utils.keccak256(this.hex);
    }

    static concat(params: Array<SmartcontractData>): SmartcontractData {
        let hex: string = "0x";

        for (let param of params) {
            hex += param.hex.substring(2);
        }

        // The address is not checked
        let data = new SmartcontractData(TYPES.RAW, hex);

        return data;
    } 
}