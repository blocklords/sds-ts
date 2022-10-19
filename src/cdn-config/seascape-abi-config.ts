import * as CdnUtil from './util';
import { loadRemote } from '../utils/json';
import { uploadAbiConfig } from './alicloud';

export default class SeascapeAbiConfig {
    private seascapeAbiConfig: any;
    private _name: any;


    constructor(name: string, seascapeAbiConfig: any) {
        this.seascapeAbiConfig = seascapeAbiConfig;
        this._name = name;
    }

    
    public static DefaultAbiConfig = (version: Number = 0) => {
        return {
            version: version
        };
    }


    /**
     * 
     * @param url URL where the address is located at. It should be a full URL
     * @param name of the smartcontract
     * @returns SeascapeAbiConfig
     */
    public static New = async (temp: Boolean, name: string): Promise<SeascapeAbiConfig> => {
        let abiConfigUrl = CdnUtil.cdnReadAbiConfigUrl(name, temp);

        let config = await loadRemote(abiConfigUrl, true);
        if (config === false) {
            return new SeascapeAbiConfig(name, this.DefaultAbiConfig());
        } else {
            return new SeascapeAbiConfig(name, config);
        }
    }


    private save = async (cdnClient: any) => {
        let uploaded = await uploadAbiConfig(cdnClient, this._name, this);
        if (uploaded === null) {
            console.log({
                error_path: 'SeascapeAbiConfig.save',
                line: 'no_upload',
                message: `Please fix the Alicloud credentials`
            });
            return false;
        }
        return true;
    }


    /**
     * Increment and update Abi Configuration
     * @param client 
     * @returns 
     */
    public async incrementVersion(client: any) {
        this.seascapeAbiConfig.version++;

        return await this.save(client);
    }


    public version = () => {
        return this.seascapeAbiConfig.version;
    }


    public name = () => {
        return this._name;
    }


    public toJSON = () => {
        return this.seascapeAbiConfig;
    }


    public toString = () : string => {
        return JSON.stringify(this.seascapeAbiConfig, null, 4);
    }


}