import SeascapeAbiConfig from './seascape-abi-config';

const SEASCAPE_CDN = 'https://cdn.seascape.network';
const SEASCAPE_TEMP_CDN = 'https://cdn-temp.seascape.network';

const SEASCAPE_CDN_BUCKET = 'seascape-cdn';
const SEASCAPE_TEMP_CDN_BUCKET = 'seascape-cdn-temp';


export interface FullAddressParam {
    name: string,
    fullAddress: boolean,
    temp?: boolean
}


export class SmartcontractParams {
    name: string;
    abi: any;
    address: string;
    txid?: string;
    owner?: string;
    verifier?: string;
    fund?: string;

    constructor (
        name: string, 
        abi: any, 
        address: string, 
        txid: string, 
        owner: string = "", 
        verifier: string = "", 
        fund: string = "") 
    {
        this.name = name;
        this.abi = abi;
        this.address = address;
        this.txid = txid;
        this.owner = owner;
        this.verifier = verifier;
        this.fund = fund;
    }
}


export class ProjectPath {
    public project: string;
    public env: string;
    public empty: boolean;
    public temp: boolean;

    constructor (project: string, env: string, empty: boolean, temp: boolean) {
        this.project = project;
        this.env = env;
        this.empty = empty;
        this.temp = temp;
    }
}


export class SmartcontractPath {
    public network_id: number;
    public category: string;

    constructor (network_id: number, category: string) {
        this.network_id = network_id;
        this.category = category;
    }
}

export const cdnUrl = function (temp: any): string {
    if (!temp) {
        return SEASCAPE_CDN;
    }
    return SEASCAPE_TEMP_CDN;
}

export const cdnBucket = function (temp: any): string {
    if (!temp) {
        return SEASCAPE_CDN_BUCKET;
    }
    return SEASCAPE_TEMP_CDN_BUCKET;
}

export let cdnConfigUrl = (path: ProjectPath): string => {
    return `${cdnUrl(path.temp)}/${path.project}/${path.env}/config.json`;
}

export const cdnReadAbiConfigUrl = (name: string, temp: Boolean) : string => {
    return `${cdnUrl(temp)}/abi/${name}/info.json`;
}

export const cdnWriteAbiConfigUrl = (name: string) : string => {
    return `/abi/${name}/info.json`;
}

export const cdnReadAbiUrl = (temp: Boolean, config: SeascapeAbiConfig): string => {
    return `${cdnUrl(temp)}/abi/${config.name()}/${config.version().toString()}.json`;
}

export const cdnWriteAbiUrl = (config: SeascapeAbiConfig): string => {
    return `/abi/${config.name()}/${config.version().toString()}.json`;
}

