import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

export class Provider {
  private internalProvider: JsonRpcProvider;

  constructor(remoteHttp: string) {
    this.internalProvider      = new ethers.providers.JsonRpcProvider(remoteHttp);
  }

  internal(): JsonRpcProvider {
    return this.internalProvider;
  }

  /**
   * @description Returns the time when the block was confirmed
   * @param {Integer} blockNumber block height for which need to return the timestamp 
   * @returns Integer the timestamp in seconds
   * @throws exception if failed to fetch the block data from the blockchain.
   */
  async getBlockTimestamp(blockNumber: number) {
    try {
      let block = await this.internalProvider.getBlock(blockNumber);

      return block.timestamp;
    } catch (error) {
      throw error;
    }
  };
}