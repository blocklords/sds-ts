const OSS = require('ali-oss');
import { ProjectPath, cdnBucket, cdnUrl, cdnWriteAbiUrl, cdnWriteAbiConfigUrl } from './util';
import SeascapeAbiConfig from './seascape-abi-config';
import SeascapeCdnConfig from './seascape-cdn-config';

export const connection = async (temp: Boolean, accessId: any, secret: any) => {
    let client = new OSS({
        accessKeyId: accessId,
        accessKeySecret: secret,
        cname: true,
        endpoint: cdnUrl(temp)
    });
    client.useBucket(cdnBucket(temp));

    return client;
}

export const connectionByEnvironment = async (temp: Boolean) => {
    if (!process.env.ALIBABA_ACCESSID) {
        console.error(`Missing ALIBABA_ACCESSID env. variable`);
        return undefined;
    }
    if (!process.env.ALIBABA_SECRET) {
        console.error(`Missing ALIBABA_SECRET env. variable`);
        return undefined;
    }

    return connection(
        temp, 
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET
    );
}

export async function uploadConfig(oss: any, config: SeascapeCdnConfig) {
    let str = config.toString();
    let buff = Buffer.alloc(str.length, str);
    try {
        const result = await oss.put(`/${config.projectPath().project}/${config.projectPath().env}/config.json`, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function uploadAbiConfig(oss: any, name: string, config: SeascapeAbiConfig) {
    let str = config.toString();
    let buff = Buffer.alloc(str.length, str);

    let url = cdnWriteAbiConfigUrl(name);

    try {
        const result = await oss.put(url, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function uploadAbi(oss: any, config: SeascapeAbiConfig, abi: Object) {
    let str = JSON.stringify(abi, null, 4);
    let buff = Buffer.alloc(str.length, str);

    let url = cdnWriteAbiUrl(config);

    try {
        const result = await oss.put(url, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}
