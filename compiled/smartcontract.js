"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Smartcontract = void 0;
var ethers_1 = require("ethers");
var hardhat_1 = require("./utils/hardhat");
var env_1 = require("./env");
var topic_1 = require("./sdk/topic");
var smartcontract_developer_request_1 = require("./sdk/message/smartcontract_developer_request");
var gateway_1 = require("./sdk/gateway");
var Smartcontract = /** @class */ (function () {
    function Smartcontract(group, name) {
        (0, env_1.verify_env)();
        var organization = process.env.SDS_ORGANIZATION_NAME;
        var project = process.env.SDS_PROJECT_NAME;
        this.topic = new topic_1.Topic(organization, project, '', group, name);
    }
    /**
     * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
     */
    Smartcontract.prototype.deployInHardhat = function (deployer, contract, constructorArguments) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, abi, deployed, address, txid, topic_string, message, reply;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, deployer.getChainId()];
                    case 1:
                        _a.network_id = (_c.sent()).toString();
                        return [4 /*yield*/, (0, hardhat_1.abiFile)(this.topic.name)];
                    case 2:
                        abi = _c.sent();
                        if (abi === false) {
                            throw "error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ".concat(this.topic.name);
                        }
                        return [4 /*yield*/, (_b = contract.connect(deployer)).deploy.apply(_b, constructorArguments)];
                    case 3:
                        deployed = _c.sent();
                        console.log("Smartcontract is deploying... Please wait...");
                        // waiting for transaction confirmation...
                        return [4 /*yield*/, deployed.deployed()];
                    case 4:
                        // waiting for transaction confirmation...
                        _c.sent();
                        console.log("".concat(this.topic.name, " deployed successfully!"));
                        address = deployed.address;
                        txid = deployed.deployTransaction.hash;
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        topic_string = this.topic.toString(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest('smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        return [4 /*yield*/, message.sign(deployer)];
                    case 5:
                        message = _c.sent();
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        console.log("The message to send to the user: ", message.toJSON());
                        return [4 /*yield*/, (0, gateway_1.request)(message)];
                    case 6:
                        reply = _c.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                        }
                        console.log("'".concat(topic_string, "' was registered in SDS Gateway!"));
                        console.log(reply);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deploys smartcontract on the blockchain, then registers it on SeascapeSDS.
     * @param deployer The passed Truffle.Deployer object in the migration file
     * @param contract The artifact
     * @param constructorArguments
     */
    Smartcontract.prototype.deployInTruffle = function (deployer, contract, web3, deployer_address, constructorArguments) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, abi, address, txid, topic_string, message, reply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, web3.eth.net.getId()];
                    case 1:
                        _a.network_id = (_b.sent()).toString();
                        // deploying smartcontract.
                        return [4 /*yield*/, deployer.deploy.apply(deployer, __spreadArray([contract], constructorArguments, false))];
                    case 2:
                        // deploying smartcontract.
                        _b.sent();
                        abi = contract.abi;
                        if (!abi) {
                            throw "error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ".concat(this.topic.name);
                        }
                        console.log("".concat(this.topic.name, " deployed successfully!"));
                        address = contract.address;
                        txid = contract.transactionHash;
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        topic_string = this.topic.toString(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest('smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        return [4 /*yield*/, message.sign(deployer_address, web3)];
                    case 3:
                        message = _b.sent();
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        console.log("The message to send to the user: ", message.toJSON());
                        return [4 /*yield*/, (0, gateway_1.request)(message)];
                    case 4:
                        reply = _b.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                        }
                        console.log("'".concat(topic_string, "' was registered in SDS Gateway!"));
                        console.log(reply);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Register already deployed smartcontract in SDS.
     * @param network_id NetworkID where contract is deployed
     * @param address Smartcontract address
     * @param txid contract creation transaction hash
     * @param abi ABI directly compatible with JSON encoding
     */
    Smartcontract.prototype.registerInHardhat = function (deployer, address, txid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, abi, topic_string, message, reply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, deployer.getChainId()];
                    case 1:
                        _a.network_id = (_b.sent()).toString();
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        return [4 /*yield*/, (0, hardhat_1.abiFile)(this.topic.name)];
                    case 2:
                        abi = _b.sent();
                        if (abi === false) {
                            throw "error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ".concat(this.topic.name);
                        }
                        topic_string = this.topic.toString(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest('smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        return [4 /*yield*/, message.sign(deployer)];
                    case 3:
                        message = _b.sent();
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        return [4 /*yield*/, (0, gateway_1.request)(message)];
                    case 4:
                        reply = _b.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                        }
                        console.log("'".concat(topic_string, "' was registered in SDS Gateway!"));
                        console.log(reply);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Registers already deployed smartcontract on SeascapeSDS
     * @param address Smartcontract address
     * @param txid Smartcontract deployment transaction hash
     * @param network_id The network id where the smartcontract was deployed on
     * @param deployer_address of the address that deployed the smartcontract
     * @param contract Smartcontract artifact
     */
    Smartcontract.prototype.registerInTruffle = function (address, txid, web3, deployer_address, contract) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, abi, topic_string, message, reply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, web3.eth.net.getId()];
                    case 1:
                        _a.network_id = (_b.sent()).toString();
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        abi = contract.abi;
                        if (!abi) {
                            throw "failed to get the smartcontract abi";
                        }
                        topic_string = this.topic.toString(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest('smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        return [4 /*yield*/, message.sign(deployer_address, web3)];
                    case 2:
                        message = _b.sent();
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        return [4 /*yield*/, (0, gateway_1.request)(message)];
                    case 3:
                        reply = _b.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                        }
                        console.log("'".concat(topic_string, "' was registered in SDS Gateway!"));
                        console.log(reply);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Its tested in Hardhat framework.
     * @warning Only supported in Hardhat framework
     * @param smartcontractDeveloper The developer
     * @param signerAddress
     * @param method
     * @param options
     */
    Smartcontract.prototype.enableBundling = function (smartcontractDeveloper, signerAddress, method, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bundle, _b, message, reply;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(smartcontractDeveloper instanceof ethers_1.ethers.Signer)) {
                            throw "the bundling not supported in truffle framework, yet!";
                        }
                        _a = this.topic;
                        return [4 /*yield*/, smartcontractDeveloper.getChainId()];
                    case 1:
                        _a.network_id = (_c.sent()).toString();
                        this.topic.method = method;
                        bundle = options.toJSON();
                        bundle.topic_string = this.topic.toString(topic_1.Topic.LEVEL_FULL);
                        _b = bundle;
                        return [4 /*yield*/, smartcontractDeveloper.getAddress()];
                    case 2:
                        _b.smartcontract_developer = _c.sent();
                        bundle.signer_address = signerAddress;
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest('smartcontract_register', bundle);
                        return [4 /*yield*/, message.sign(smartcontractDeveloper)];
                    case 3:
                        message = _c.sent();
                        console.log("Sending 'enable_bundling' command to SDS Gateway");
                        return [4 /*yield*/, (0, gateway_1.request)(message)];
                    case 4:
                        reply = _c.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                        }
                        console.log("Bundling was enabled for '".concat(bundle.topic_string, "'."));
                        console.log(reply);
                        return [2 /*return*/];
                }
            });
        });
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