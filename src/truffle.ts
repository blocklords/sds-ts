import { Topic } from "./common/topic";
import { SmartcontractDeveloperRequest as MsgRequest } from "./sdk/message/smartcontract_developer_request";
import { Smartcontract } from "./smartcontract";

/** @description Interact with SeascapeSDS using Truffle Framework.
 * 
 * https://trufflesuite.com/truffle/
 */
export class Truffle extends Smartcontract {
  /**
   * Create a new smartcontract with the topic.
   * The topic's organization and project parameters are fetched from environment variables.
   * @param group Smartcontract Group
   * @param name Smartcontract Name should match to the name as its defined in the code.
   * @example Assume that "SomeErc20.sol" file has `contract SomeErc20 {}`
   * Then the `name` parameter should be `SomeErc20`.
   * @throws exception if the environment variables are missing.
   * @requires SDS_ORGANIZATION_NAME environment variable. Example: seascape.
   * @requires SDS_PROJECT_NAME environment variable. Example: `uniswap`.
   * @requires SDS_GATEWAY_HOST environment variable. Example: tcp://localhost:4001
   */
  constructor(group: string, name: string) {
    super(group, name);
  }

  /**
   * Deploys smartcontract on the blockchain, then registers it on SeascapeSDS.
   * @param deployer The passed Truffle.Deployer object in the migration file
   * @param contract The smartcontract artifact
   * @param web3 a Web3js library initiated and ready to use
   * @param constructorArguments 
   */
  async deploy(deployer: any, contract: any, web3: any, deployer_address: string, constructorArguments: Array<any>) {
    let network_id = (await web3.eth.net.getId()).toString();
    this.set_network_id(network_id);

    // deploying smartcontract.
    await deployer.deploy(contract, ...constructorArguments);

    let abi = contract.abi;
    if (!abi) {
      throw `error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ${this.topic.name}`;
    }

    console.log(`${this.topic.name} deployed successfully!`);

    let address = contract.address;
    let txid = contract.transactionHash;
    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });
    message = await message.sign(deployer_address, web3);

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    console.log(`The message to send to the user: `, message.toJSON());

    let reply = await this.gateway.send(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  /**
   * Registers already deployed smartcontract on SeascapeSDS
   * @param address Smartcontract address
   * @param txid Smartcontract deployment transaction hash
   * @param network_id The network id where the smartcontract was deployed on
   * @param deployer_address of the address that deployed the smartcontract
   * @param contract Smartcontract artifact
   */
  async register(address: string, txid: string, web3: any, deployer_address: string, contract: any) {
    this.topic.network_id = (await web3.eth.net.getId()).toString();

    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let abi = contract.abi;
    if (!abi) {
      throw `failed to get the smartcontract abi`;
    }
    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });
    message = await message.sign(deployer_address, web3);

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    
    let reply = await this.gateway.send(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
      return;
    }

    console.log(`'${topic_string}' was registered in SeascapeSDS!`)
  }
}
