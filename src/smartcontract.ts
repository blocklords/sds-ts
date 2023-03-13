import { ethers } from "ethers";
import { abiFile as hardhatAbiFile } from "./utils/hardhat";
import { BundleOptions } from "./bundle-options"
import { verify_env } from "./env";
import { Topic } from "./common/topic";
import { SmartcontractDeveloperRequest as MsgRequest } from "./sdk/message/smartcontract_developer_request";
import { request } from "./sdk/gateway";

/** @description Smartcontract handles the registration of the smartcontract on SeascapeSDS.
 */
export class Smartcontract {
  topic: Topic;
  
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

    let organization = process.env.SDS_ORGANIZATION_NAME;
    let project = process.env.SDS_PROJECT_NAME;

    this.topic = new Topic(organization, project, '', group, name);
  }

  /** 
   * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
   */
  async deployInHardhat(deployer: ethers.Signer, contract: ethers.ContractFactory, constructorArguments: Array<any>) {
    this.topic.network_id = (await deployer.getChainId()).toString();

    let abi = await hardhatAbiFile(this.topic.name);
    if (abi === false) {
      throw `error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ${this.topic.name}`;
    }

    let deployed = await contract.connect(deployer).deploy(...constructorArguments);    /// Argument '1' means deploy in Test mode
    console.log(`Smartcontract is deploying... Please wait...`);

    // waiting for transaction confirmation...
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
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  /**
   * Deploys smartcontract on the blockchain, then registers it on SeascapeSDS.
   * @param deployer The passed Truffle.Deployer object in the migration file
   * @param contract The artifact
   * @param constructorArguments 
   */
  async deployInTruffle(deployer: any, contract: any, web3: any, deployer_address: string, constructorArguments: Array<any>) {
    this.topic.network_id = (await web3.eth.net.getId()).toString();
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
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  /**
   * Register already deployed smartcontract in SDS.
   * @param network_id NetworkID where contract is deployed
   * @param address Smartcontract address
   * @param txid contract creation transaction hash
   * @param abi ABI directly compatible with JSON encoding
   */
  async registerInHardhat(deployer: ethers.Signer, address: string, txid: string) {
    this.topic.network_id = (await deployer.getChainId()).toString();

    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let abi = await hardhatAbiFile(this.topic.name);
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
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
      return;
    }

    console.log(`'${topic_string}' was registered in SeascapeSDS!`)
  }

  /**
   * Registers already deployed smartcontract on SeascapeSDS
   * @param address Smartcontract address
   * @param txid Smartcontract deployment transaction hash
   * @param network_id The network id where the smartcontract was deployed on
   * @param deployer_address of the address that deployed the smartcontract
   * @param contract Smartcontract artifact
   */
  async registerInTruffle(address: string, txid: string, web3: any, deployer_address: string, contract: any) {
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
    
    let reply = await request(message);
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
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`Bundling was enabled for '${bundle.topic_string}'.`);
    console.log(reply)
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
