"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.Hardhat = void 0;
var topic_1 = require("./common/topic");
var smartcontract_developer_request_1 = require("./sdk/message/smartcontract_developer_request");
var smartcontract_1 = require("./smartcontract");
var fs = require('fs');
var Account = require("./sdk/account");
var ethers_1 = require("ethers");
/** @description Interact with SeascapeSDS using Hardhat Framework.
 *
 * https://hardhat.org
 */
var Hardhat = /** @class */ (function (_super) {
    __extends(Hardhat, _super);
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
    function Hardhat(group, name, deployer, contract) {
        var _this = _super.call(this, group, name) || this;
        /** Returns a curve keypair that's used for the backend developers.
         * @param private_key is the smartcontract developer's account key
         */
        _this.generate_key = function (private_key) {
            return __awaiter(this, void 0, void 0, function () {
                var deployer, message, digest, signature, reply, public_key, secret_key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.developer = new ethers_1.ethers.Wallet(private_key);
                            return [4 /*yield*/, this.deployer.getAddress()];
                        case 1:
                            deployer = _a.sent();
                            message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(deployer, 'generate_key', {});
                            digest = message.digest();
                            return [4 /*yield*/, this.sign(digest)];
                        case 2:
                            signature = _a.sent();
                            message.set_signature(signature);
                            return [4 /*yield*/, this.gateway.send(message)];
                        case 3:
                            reply = _a.sent();
                            if (!reply.is_ok()) {
                                return [2 /*return*/, reply];
                            }
                            return [4 /*yield*/, Account.decrypt(this.developer, reply.parameters["public_key"])];
                        case 4:
                            public_key = _a.sent();
                            return [4 /*yield*/, Account.decrypt(this.developer, reply.parameters["secret_key"])];
                        case 5:
                            secret_key = _a.sent();
                            reply.parameters["public_key"] = public_key.toString();
                            reply.parameters["secret_key"] = secret_key.toString();
                            return [2 /*return*/, reply];
                    }
                });
            });
        };
        _this.load_abi_file = function (smartcontractName) {
            var contractPath = "./artifacts/contracts/".concat(smartcontractName, ".sol/").concat(smartcontractName, ".json");
            var rawdata = fs.readFileSync(contractPath, 'utf-8');
            try {
                var json = JSON.parse(rawdata);
                if (!json.abi) {
                    console.error("No 'abi' property found.");
                    return false;
                }
                return json.abi;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        };
        _this.deployer = deployer;
        _this.contract = contract;
        _this.abi = _this.load_abi_file(_this.topic.name);
        if (_this.abi === false) {
            throw "error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ".concat(_this.topic.name);
        }
        return _this;
    }
    /**
     * @description Deploy smartcontract using hardhat framework and at the same time register it on SDS.
     */
    Hardhat.prototype.deploy = function (constructorArguments) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, deployed, address, txid, deployer, topic_string, message, digest, signature, reply;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.set_network_id;
                        return [4 /*yield*/, this.deployer.getChainId()];
                    case 1:
                        _a.apply(this, [(_c.sent()).toString()]);
                        return [4 /*yield*/, (_b = this.contract.connect(this.deployer)).deploy.apply(_b, constructorArguments)];
                    case 2:
                        deployed = _c.sent();
                        console.log("Smartcontract is deploying... Please wait...");
                        return [4 /*yield*/, deployed.deployed()];
                    case 3:
                        _c.sent();
                        console.log("".concat(this.topic.name, " deployed successfully!"));
                        address = deployed.address;
                        txid = deployed.deployTransaction.hash;
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        return [4 /*yield*/, this.deployer.getAddress()];
                    case 4:
                        deployer = _c.sent();
                        topic_string = this.topic.to_string(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(deployer, 'smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: this.abi
                        });
                        digest = message.digest();
                        return [4 /*yield*/, this.sign(digest)];
                    case 5:
                        signature = _c.sent();
                        message.set_signature(signature);
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        console.log("The message to send to the user: ", message.toJSON());
                        return [4 /*yield*/, this.gateway.send(message)];
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
     * Register already deployed smartcontract in SDS.
     * @param network_id NetworkID where contract is deployed
     * @param address Smartcontract address
     * @param txid contract creation transaction hash
     */
    Hardhat.prototype.register = function (address, txid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, deployer, topic_string, message, digest, signature, reply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, this.deployer.getChainId()];
                    case 1:
                        _a.network_id = (_b.sent()).toString();
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        return [4 /*yield*/, this.deployer.getAddress()];
                    case 2:
                        deployer = _b.sent();
                        topic_string = this.topic.to_string(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(deployer, 'smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: this.abi
                        });
                        digest = message.digest();
                        return [4 /*yield*/, this.sign(digest)];
                    case 3:
                        signature = _b.sent();
                        message.set_signature(signature);
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        return [4 /*yield*/, this.gateway.send(message)];
                    case 4:
                        reply = _b.sent();
                        if (!reply.is_ok()) {
                            console.error("error: couldn't request data from SDS Gateway: " + reply.message);
                            return [2 /*return*/];
                        }
                        console.log("'".concat(topic_string, "' was registered in SeascapeSDS!"));
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
    Hardhat.prototype.enableBundling = function (signerAddress, method, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bundle, _b, deployer, message, digest, signature, reply;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, this.deployer.getChainId()];
                    case 1:
                        _a.network_id = (_c.sent()).toString();
                        this.topic.method = method;
                        bundle = options.toJSON();
                        bundle.topic_string = this.topic.to_string(topic_1.Topic.LEVEL_FULL);
                        _b = bundle;
                        return [4 /*yield*/, this.deployer.getAddress()];
                    case 2:
                        _b.smartcontract_developer = _c.sent();
                        bundle.signer_address = signerAddress;
                        return [4 /*yield*/, this.deployer.getAddress()];
                    case 3:
                        deployer = _c.sent();
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(deployer, 'smartcontract_register', bundle);
                        digest = message.digest();
                        return [4 /*yield*/, this.sign(digest)];
                    case 4:
                        signature = _c.sent();
                        message.set_signature(signature);
                        console.log("Sending 'enable_bundling' command to SDS Gateway");
                        return [4 /*yield*/, this.gateway.send(message)];
                    case 5:
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
    Hardhat.prototype.sign = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var message_hash, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message_hash = ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.id(message));
                        return [4 /*yield*/, this.deployer.signMessage(message_hash)];
                    case 1:
                        signature = _a.sent();
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    return Hardhat;
}(smartcontract_1.Smartcontract));
exports.Hardhat = Hardhat;
//# sourceMappingURL=hardhat.js.map