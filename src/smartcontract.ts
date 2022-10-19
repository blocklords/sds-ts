import { ethers } from "ethers";
import { abiFile as hardhatAbiFile } from "./utils/hardhat";
import { BundleOptions } from "./bundle-options"
import { verify_env } from "./env";
import { Topic } from "./sdk/topic";
import { Request as MsgRequest } from "./sdk/message/request";
import { request } from "./sdk/gateway";

export class Smartcontract {
  topic: Topic;
  
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

    let topic_string = this.topic.toString(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    
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

    let topic_string = this.topic.toString(Topic.LEVEL_NAME);
    let message = new MsgRequest('smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: abi,
    });

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  async enableBundling(smartcontractDeveloper: ethers.Signer, signerAddress: string, method: string, options: BundleOptions) {
    this.topic.network_id = (await smartcontractDeveloper.getChainId()).toString();
    this.topic.method = method;

    let bundle = options.toJSON();
    
    bundle.topic_string = this.topic.toString(Topic.LEVEL_FULL);
    bundle.smartcontract_developer = await smartcontractDeveloper.getAddress();
    bundle.signer_address = signerAddress;

    let message = new MsgRequest('smartcontract_register', bundle);

    console.log(`Sending 'enable_bundling' command to SDS Gateway`);
    
    let reply = await request(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`Bundling was enabled for '${bundle.topic_string}'.`);
    console.log(reply)
  }

  /**
   * @description Returns a Contract interface
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
