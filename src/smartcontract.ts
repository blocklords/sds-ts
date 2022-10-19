import { ethers } from "ethers";
import { abiFile as hardhatAbiFile } from "./utils/hardhat";
import { DeployOptions } from "./deploy-options"
import { BundleOptions } from "./bundle-options"
const axios = require('axios').default;

export class Smartcontract {
  name: string;
  group: string;
  
  constructor(name: string, group: string) {
    this.name = name;
    this.group = group;
  }

  /** 
   * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
   */
  async deployInHardhat(deployer: ethers.Signer, contract: ethers.ContractFactory, constructorArguments: Array<any>, options: DeployOptions) {
    let abi = await hardhatAbiFile(this.name);
    if (abi === false) {
      throw 'SMARTCONTRACT_NAME_INVALID: can not find a smartcontract ABI. Make sure that Smartcontract name matches in the source code as well';
    }

    if (!process.env.SDS_ORGANIZATION_NAME) {
      throw 'Missing SDS_ORGANIZATION_NAME environment variable';
    }
    if (!process.env.SDS_PROJECT_NAME) {
      throw 'Missing SDS_PROJECT_NAME environment variable';
    }

    let deployed           = await contract.connect(deployer).deploy(...constructorArguments);    /// Argument '1' means deploy in Test mode
    console.log(`Smartcontract is deploying... Please wait...`);

    // waiting for transaction confirmation...
    await deployed.deployed();
    console.log(`'${this.name}' smartcontract was deployed on ${deployed.address}!`);
    console.log(`Txhash: ${deployed.deployTransaction.hash}`);

    let address = deployed.address;
    let txid = deployed.deployTransaction.hash;

    let network_id = await deployer.getChainId();
    let smartcontract_developer = await deployer.getAddress();

    let topic_string = `${process.env.SDS_ORGANIZATION_NAME}.${process.env.SDS_PROJECT_NAME}.${network_id}.${this.group}.${this.name}`;

    let register = {
      topic_string: topic_string,
      address: address,
      smartcontract_developer: smartcontract_developer,
      txid: txid,
      abi: abi,
      options: options
    }

    let res = await axios({
      url: `http://${process.env.SDS_REMOTE_HTTP}:${process.env.LISTENER_HTTP_SERVER_PORT}/register-smartcontract`, 
      method: 'post',
      // transformRequest: (data, _headers) => {
      //   return JSON.stringify(data);
      // },
      data: register
    }).catch(e => {
      console.error(e);
      process.exit(0);
    });
    console.log("Result");

    if (res.data && res.data.status === 'OK') {
      console.log("Successfully registered.");
      console.log("CDN available at: the url");
      console.log("Check the backend for the API");
    } else if (res.data) {
      console.error(res.data);
    } else {
      console.error(res);
    }
  }

  async enableBundling(smartcontractDeveloper: ethers.Signer, signerAddress: string, method: string, options: BundleOptions) {
    if (!process.env.SDS_ORGANIZATION_NAME) {
      throw 'Missing SDS_ORGANIZATION_NAME environment variable';
    }
    if (!process.env.SDS_PROJECT_NAME) {
      throw 'Missing SDS_PROJECT_NAME environment variable';
    }

    let bundle = options.toJSON();
    bundle.topic_string = `${process.env.SDS_ORGANIZATION_NAME}.${process.env.SDS_PROJECT_NAME}.${await smartcontractDeveloper.getChainId()}.${this.group}.${this.name}.${method}`;
    bundle.smartcontract_developer = await smartcontractDeveloper.getAddress();
    bundle.signer_address = signerAddress;

    let res = await axios({
      url: `http://${process.env.SDS_REMOTE_HTTP}:${process.env.LISTENER_HTTP_SERVER_PORT}/enable-bundling`, 
      method: 'post',
      data: bundle
    }).catch(e => {
      if (!e.response) {
        console.error(`Server might be down. Connection refused!`);
      } else {
        console.error(`Error http code: ${e.response.status}, data: ${JSON.stringify(e.response.data, null, 4)}`);
      }
      process.exit(0);
    });

    if (res.data && res.data.status === 'OK') {
      console.log("Successfully registered.");
      console.log("CDN available at: the url");
      console.log("Check the backend for the API");
    } else if (res.data) {
      console.log(`Data is returned`);
      console.error(res.data);
    } else {
      console.error(`${JSON.stringify(res, null, 4)}`);
    }
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
