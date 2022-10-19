/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { SmartcontractParams, ProjectPath, SmartcontractPath } from './util';
import { connection, connectionByEnvironment } from './alicloud';
import SeascapeCdnConfig from './seascape-cdn-config';
import SeascapeAbiConfig from './seascape-abi-config';
import SeascapeAbi from './seascape-abi';
import { CdnUtil } from '..';

export const setSmartcontract = async(projectPath: ProjectPath, smartcontractPath: SmartcontractPath, smartcontract: SmartcontractParams) => {
    let client = await connectionByEnvironment(projectPath.temp);
    if (client === undefined) {
        return false;
    }

    let abiConfig = await SeascapeAbiConfig.New(projectPath.temp, smartcontract.name);
    await abiConfig.incrementVersion(client);

    await SeascapeAbi.SetAbi(client, abiConfig, smartcontract.abi);

    smartcontract.abi = CdnUtil.cdnReadAbiUrl(projectPath.temp, abiConfig);

    let seascapeCdnConfig = await SeascapeCdnConfig.New(projectPath);
    return await seascapeCdnConfig.setSmartcontract(client, smartcontractPath, smartcontract);
}

export const connectCdn = connection;
export const connectCdnByEnv = connectionByEnvironment;