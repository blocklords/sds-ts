import * as CdnUtil from './util';
import { loadRemote } from '../utils/json';
import SeascapeAbiConfig from './seascape-abi-config';
import { uploadAbi } from './alicloud';

export default class SeascapeAbi {
    public static New = async (temp: Boolean, name: string, version: Number = -1): Promise<SeascapeAbi> => {
        let abiConfig;
        if (version >= 0) {
            abiConfig = new SeascapeAbiConfig(name, SeascapeAbiConfig.DefaultAbiConfig(version));
        } else {
            abiConfig = await SeascapeAbiConfig.New(temp, name);
        }
        
        let url = CdnUtil.cdnReadAbiUrl(temp, abiConfig);
        
        return await loadRemote(url);
    }

    public static NewWithAbiConfig = async (temp: Boolean, abiConfig: SeascapeAbiConfig): Promise<SeascapeAbi> => {
        let url = CdnUtil.cdnReadAbiUrl(temp, abiConfig);
        
        return await loadRemote(url);
    }

    /**
     * Set Abi
     * @param cdnClient 
     * @param abiConfig 
     * @param abi 
     */
    public static SetAbi = async (cdnClient: any, abiConfig: SeascapeAbiConfig, abi: Object) => {
        let uploaded = await uploadAbi(cdnClient, abiConfig, abi);
        if (uploaded === null) {
            console.log({
                error_path: 'src/cdn-config/write.setAbi',
                line: 'no_upload',
                message: `Please fix the Alicloud credentials`
            });
            return false;
        }
        return true;
    };
}