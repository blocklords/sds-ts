import { promptString } from "./prompt/string";

let title_prefix = `Interactive mode:`;
let remote_service = "SeascapeSDS";

/**
   * Returns the parameters typed by user for 
   * smartcontract registration on SeascapeSDS.
   * @param network_id network id where the smartcontract deployed on
   * @returns address Smartcontract address
   * @returns transaction_id Smartcontract deployment transaction hash
   * @returns name of the smartcontract
   * @returns group where smartcontract is classified
 */
export const register = async(network_id: string|number): Promise<any> => {
    console.log(`${title_prefix} Register already deployed smartcontract ${remote_service}`);
    console.log(`Let's get the smartcontract parameters.\n`);

    let message = `Type the name of the smartcontract as its written in the solidity file: `;
    let name = await promptString(message, undefined);
    let name_message = name;
    let network_id_message = network_id;

    message = `\nType the smartcontract group name. ${'For example "nft", "ERC20", "marketplace"'}: `;
    let group = await promptString(message, undefined);

    message = `\nType the ${name_message} smartcontract address on network ${network_id_message}.\n`;
    message += "address starts with '0x' prefix: ";
    let address = await promptString(message, undefined);

    message = `\nType the ${name_message} smartcontract deployment transaction hash on network ${network_id_message}: `;
    message += "transaction hash with a '0x' prefix: ";
    let transaction_id = await promptString(message, undefined);

    return {
      name: name,
      group: group,
      address: address,
      transaction_id: transaction_id
    }
}
