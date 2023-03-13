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
  private deployer: ethers.Signer;
  private contract: ethers.ContractFactory;
  private abi: any;

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
  constructor(group: string, name: string, deployer: ethers.Signer, contract: ethers.ContractFactory) {
    super(group, name);

    this.deployer = deployer;
    this.contract = contract;

    this.abi = this.load_abi_file(this.topic.name);
    if (this.abi === false) {
      throw `error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ${this.topic.name}`;
    }
  }

  /** 
   * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
   */
  async deploy(constructorArguments: Array<any>) {
    this.set_network_id((await this.deployer.getChainId()).toString());

    let deployed = await this.contract.connect(this.deployer).deploy(...constructorArguments);    /// Argument '1' means deploy in Test mode

    console.log(`Smartcontract is deploying... Please wait...`);
    await deployed.deployed();
    console.log(`${this.topic.name} deployed successfully!`);

    let address = deployed.address;
    let txid = deployed.deployTransaction.hash;
    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let deployer = await this.deployer.getAddress();

    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest(deployer, 'smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: this.abi,
    });
    let digest = message.digest();
    let signature = await this.sign(digest);
    message.set_signature(signature);

    console.log(`Sending 'register_smartcontract' command to SDS Gateway`);
    console.log(`The message to send to the user: `, message.toJSON());
    
    let reply = await this.gateway.send(message);
    if (!reply.is_ok()) {
      console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
    }

    console.log(`'${topic_string}' was registered in SDS Gateway!`)
    console.log(reply);
  }

  private load_abi_file = (smartcontractName: string) => {
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
   */
  async register(address: string, txid: string) {
    this.topic.network_id = (await this.deployer.getChainId()).toString();

    console.log(`'${this.topic.name}' address ${address}`);
    console.log(`'${this.topic.name}' txid    ${txid}`);

    let deployer = await this.deployer.getAddress();

    let topic_string = this.topic.to_string(Topic.LEVEL_NAME);
    let message = new MsgRequest(deployer, 'smartcontract_register', {
      topic_string: topic_string,
      txid: txid,
      abi: this.abi,
    });
    let digest = message.digest();
    let signature = await this.sign(digest);
    message.set_signature(signature);

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
    async enableBundling(signerAddress: string, method: string, options: BundleOptions) {
      this.topic.network_id = (await this.deployer.getChainId()).toString();
      this.topic.method = method;
  
      let bundle = options.toJSON();
      
      bundle.topic_string = this.topic.to_string(Topic.LEVEL_FULL);
      bundle.smartcontract_developer = await this.deployer.getAddress();
      bundle.signer_address = signerAddress;
  
      let deployer = await this.deployer.getAddress();

      let message = new MsgRequest(deployer, 'smartcontract_register', bundle);
      let digest = message.digest();
      let signature = await this.sign(digest);
      message.set_signature(signature);
  
      console.log(`Sending 'enable_bundling' command to SDS Gateway`);
      
      let reply = await this.gateway.send(message);
      if (!reply.is_ok()) {
        console.error(`error: couldn't request data from SDS Gateway: `+reply.message);
      }
  
      console.log(`Bundling was enabled for '${bundle.topic_string}'.`);
      console.log(reply)
    }

    async sign(message: string): Promise<string> {
      var message_hash = ethers.utils.arrayify(ethers.utils.id(message));
      var signature = await this.deployer.signMessage(message_hash);

      return signature;
  }
}
