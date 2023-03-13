"use strict";
exports.__esModule = true;
exports.Smartcontract = void 0;
var env_1 = require("./env");
var topic_1 = require("./common/topic");
var gateway_1 = require("./sdk/gateway");
/** @description Smartcontract handles the registration of the smartcontract on SeascapeSDS.
 */
var Smartcontract = /** @class */ (function () {
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
    function Smartcontract(group, name) {
        (0, env_1.verify_env)();
        var organization = process.env.SDS_ORGANIZATION_NAME;
        var project = process.env.SDS_PROJECT_NAME;
        this.topic = new topic_1.Topic(organization, project, '', group, name);
        this.gateway = new gateway_1.Gateway();
    }
    // Set the network id
    Smartcontract.prototype.set_network_id = function (network_id) {
        this.topic.network_id = network_id;
    };
    /**
     * Returns the Smartcontract interface
     * @param data JSON string or object
     * @returns ethers.ContractInterface
     * @throws error is data is string and can not be parsed as a JSON
     */
    Smartcontract.loadAbi = function (data) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    };
    return Smartcontract;
}());
exports.Smartcontract = Smartcontract;
//# sourceMappingURL=smartcontract.js.map