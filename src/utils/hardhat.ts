let fs = require('fs');

export const abiFile = async (smartcontractName: string) => {
    let contractPath = `./artifacts/contracts/${smartcontractName}.sol/${smartcontractName}.json`;
    let rawdata = fs.readFileSync(contractPath, 'utf-8');
    try {
        let json = JSON.parse(rawdata);
        if (!json.abi) {
            console.error(`No 'abi' property found.`);
            return false;
        }
        return json.abi;
    } catch (error) {
        console.error(error);
        return false;
    }
};
