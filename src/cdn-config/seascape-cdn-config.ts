import * as CdnUtil from './util';
import { loadRemote } from '../utils/json';
import { uploadConfig } from './alicloud';

export default class SeascapeCdnConfig {
    private seascapeCdnConfig: any;
    private project: any;

    constructor(seascapeCdnConfig: any, project: CdnUtil.ProjectPath) {
        this.seascapeCdnConfig = seascapeCdnConfig;
        this.project = project;
    }

    public static New = async (projectPath: CdnUtil.ProjectPath): Promise<SeascapeCdnConfig> => {
        let url = CdnUtil.cdnConfigUrl(projectPath);

        let config = await loadRemote(url, projectPath.empty);
        if (config === false) {
            if (projectPath.empty) {
               return new SeascapeCdnConfig({}, projectPath);
            } else {
                throw `Failed to load the Seascape CDN Config from the remote path`;
            }
        } else {
            return new SeascapeCdnConfig(config, projectPath);
        }
    }

    static ValidateConfNetwork (seascapeCdnConfig: any, network_id: string): boolean {
        if (seascapeCdnConfig === undefined || seascapeCdnConfig === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'noseascapeCdnConfig',
                message: `Please define global file`
            });
            return false;
        }
    
        if (seascapeCdnConfig[network_id] === undefined || seascapeCdnConfig[network_id] === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'no_network_id',
                message: `Invalid network id '${network_id}'`
            });
            return false;
        }
    
        return true;
    }

    /**
     * Return the Address of the Contract
     * @requires Global CDN config to be initialized
     * @param network_id where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns string
     */
    contractAddress (network_id: string, type: string, name: string) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }

        if (this.seascapeCdnConfig[network_id][type] === undefined || this.seascapeCdnConfig[network_id][type] === null) {
            console.log({
                error_path: 'SeascapeCdnConfig.contractAddress',
                line: 'no_type',
                message: `Invalid address type '${type}'`
            });
            return false;
        }

        for (var i = 0; i < this.seascapeCdnConfig[network_id][type].length; i++ ) {
            let contract = this.seascapeCdnConfig[network_id][type][i];
            if (contract.name.toString() === name) {
                return contract.address.toString();
            }
        }

        console.log({
            error_path: 'SeascapeCdnConfig.contractAddress',
            line: 'no_found',
            message: `Could not find network_id: '${network_id}', type: '${type}', name: '${name}'`
        });
        return false;
    }

    /**
     * Returns the index of a contract information in the CDN Config
     * @requires Global CDN configuration to be initialized
     * @param network_id where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns a number
     */
    contractIndex (network_id: string, type: string, name: string) {
        if (this.seascapeCdnConfig[network_id][type] === undefined || this.seascapeCdnConfig[network_id][type] === null) {
            return false;
        }

        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }

        for (var i = 0; i < this.seascapeCdnConfig[network_id][type].length; i++ ) {
            let contract = this.seascapeCdnConfig[network_id][type][i];
            if (contract.name.toString() === name) {
                return i;
            }
        }

        console.log({
            error_path: 'src/utils/config.contractIndex',
            line: 'no_found',
            message: `Could not find network_id: '${network_id}', type: '${type}', name: '${name}'`
        });
        return false;
    }


    /**
     * Returns list of the contracts of the certain type in the certain network
     * @requires Global CDN config to be initialized
     * @param network_id where contracts are deployed
     * @param type of the contracts
     * @returns false in case of an error, otherwise it returns the list of ContractConfigs
     */
    availableContracts (network_id: string, category: string) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }

        if (this.seascapeCdnConfig[network_id][category] === undefined || this.seascapeCdnConfig[network_id][category] === null) {
            console.log({
                error_path: 'src/utils/config.availableContracts',
                line: 'no_type',
                message: `Invalid address category '${category}'`
            });
            return false;
        }

        return this.seascapeCdnConfig[network_id][category];
    }

    setSmartcontract = async (cdnClient: any, smartcontractPath: CdnUtil.SmartcontractPath, obj: CdnUtil.SmartcontractParams) => {
        let idString = smartcontractPath.network_id.toString();
        let category = smartcontractPath.category;
    
        if (!this.seascapeCdnConfig[idString]) {
            this.seascapeCdnConfig[idString] = {};
        }
    
        if (!this.seascapeCdnConfig[idString][category]) {
            this.seascapeCdnConfig[idString][category] = [];
        }
    
        let i = this.contractIndex(idString, category, obj.name);
        if (i === false) {
            this.seascapeCdnConfig[idString][category].push(obj);
        } else {
            this.seascapeCdnConfig[idString][category][i] = obj;
        }
    
        let uploaded = await uploadConfig(cdnClient, this);
        if (uploaded === null) {
            console.log({
                error_path: 'src/cdn-config/write.setSmartcontract',
                line: 'no_upload',
                message: `Please fix the Alicloud credentials`
            });
            return false;
        }
        return true;
    };

    public projectPath = () => {
        return this.project;
    }

    public toJSON = () => {
        return this.seascapeCdnConfig;
    }

    public toString = () : string => {
        return JSON.stringify(this.seascapeCdnConfig, null, 4);
    }
}