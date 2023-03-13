import { ethers } from "ethers";
import { verify_env } from "./env";
import { Topic } from "./common/topic";
import { Gateway } from "./sdk/gateway";

/** @description Smartcontract handles the registration of the smartcontract on SeascapeSDS.
 */
export class Smartcontract {
  topic: Topic;
  gateway: Gateway;
  
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
    verify_env();

    let organization = process.env.SDS_ORGANIZATION_NAME as string;
    let project = process.env.SDS_PROJECT_NAME as string;

    this.topic = new Topic(organization, project, '', group, name);

    this.gateway = new Gateway();
  }

  // Set the network id
  protected set_network_id(network_id: string) {
    this.topic.network_id = network_id;
  }

  /**
   * Returns the Smartcontract interface
   * @param data JSON string or object
   * @returns ethers.ContractInterface
   * @throws error is data is string and can not be parsed as a JSON
   */
  static loadAbi(data: string | object | Array<object>): ethers.ContractInterface {
    if (typeof data === 'string') {
      return JSON.parse(data) as ethers.ContractInterface;
    }
  
    return data as ethers.ContractInterface;
  }

}
