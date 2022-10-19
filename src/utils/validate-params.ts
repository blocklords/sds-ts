import SmartcontractData from "./smartcontract-data";

/**
  * @description Validates the parameters before signing
  * @param params is the array of params. 
  * @returns true if succeed, otherwise false.
 */
export let validateParams = (params: Array<SmartcontractData>): boolean => {
    if (params.length === 0) {
        return false;
    }
 
    return true;
};
