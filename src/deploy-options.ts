import { ethers } from "ethers";
import { abiFile as hardhatAbiFile } from "./utils/hardhat";
const axios = require('axios').default;

export class DeployOptions {
  signerEnabled: boolean;
  signerAddress: string;
  
  constructor(signerEnabled: boolean = false, signerAddress: string = "") {
    this.signerEnabled = signerEnabled;
    this.signerAddress = signerAddress;
  }
}
