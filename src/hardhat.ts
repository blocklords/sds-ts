import { Topic } from "./common/topic";
import { SmartcontractDeveloperRequest as MsgRequest } from "./sdk/message/smartcontract_developer_request";
import { Smartcontract } from "./smartcontract";
import { ethers } from "ethers";
import { BundleOptions } from "./bundle-options"
let fs = require('fs');

/** @description Interact with SeascapeSDS using Hardhat Framework.
 * 
 * https://hardhat.org
 */
export class Hardhat extends Smartcontract {
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
   * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
   */
  async deploy(deployer: ethers.Signer, contract: ethers.ContractFactory, constructorArguments: Array<any>) {
    this.topic.network_id = (await deployer.getChainId()).toString();

    let abi = await this.load_abi_file(this.topic.name);
    if (abi === false) {
      throw `error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ${this.topic.name}`;
    }

    let deployed = await contract.connect(deployer).deploy(...constructorArguments);    /// Argument '1' means deploy in Test mode

    console.log(`Smartcontract is deploying... Please wait...`);
    await deployed.deployed();
    console.log(`${this.topic.name} deployed successfully!`);

    let address = deployed.address;
    let txid = deployed.deployTransaction.hash;
    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });
    message = await message.sign(deployer);

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    console.log(`The message to send to the user: `, message.toJSON());
    
    let reply = await this.gateway.send(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  private load_abi_file = async (smartcontractName: string) => {
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

  /**
   * Register already deployed smartcontract in SDS.
   * @param network_id NetworkID where contract is deployed
   * @param address Smartcontract address
   * @param txid contract creation transaction hash
   * @param abi ABI directly compatible with JSON encoding
   */
  async register(deployer: ethers.Signer, address: string, txid: string) {
    this.topic.network_id = (await deployer.getChainId()).toString();

    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let abi = await this.load_abi_file(this.topic.name);
    if (abi === false) {
      throw `error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ${this.topic.name}`;
    }

    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });
    message = await message.sign(deployer);

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    
    let reply = await this.gateway.send(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
      return;
    }

    console.log(`'${topic_string}' was registered in SeascapeSDS!`)
  }

    /**
   * Its tested in Hardhat framework.
   * @warning Only supported in Hardhat framework
   * @param smartcontractDeveloper The developer
   * @param signerAddress 
   * @param method 
   * @param options 
   */
    async enableBundling(smartcontractDeveloper: any, signerAddress: string, method: string, options: BundleOptions) {
      if (!(smartcontractDeveloper instanceof ethers.Signer)) {
        throw `the bundling not supported in truffle framework, yet!`;
      }
  
      this.topic.network_id = (await smartcontractDeveloper.getChainId()).toString();
      this.topic.method = method;
  
      let bundle = options.toJSON();
      
      bundle.topic_string = this.topic.to_string(Topic.LEVEL_FULL);
      bundle.smartcontract_developer = await smartcontractDeveloper.getAddress();
      bundle.signer_address = signerAddress;
  
      let message = new MsgRequest('smartcontract_register', bundle);
      message = await message.sign(smartcontractDeveloper);
  
      console.log(`Sending 'enable_bundling' command to SDS Gateway`);
      
      let reply = await this.gateway.send(message);
      if (!reply.is_ok()) {
        console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
      }
  
      console.log(`Bundling was enabled for '${bundle.topic_string}'.`);
      console.log(reply)
    }
}
