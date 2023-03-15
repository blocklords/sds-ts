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
exports.Truffle = void 0;
var topic_1 = require("./common/topic");
var smartcontract_developer_request_1 = require("./sdk/message/smartcontract_developer_request");
var smartcontract_1 = require("./smartcontract");
/** @description Interact with SeascapeSDS using Truffle Framework.
 *
 * https://trufflesuite.com/truffle/
 */
var Truffle = /** @class */ (function (_super) {
    __extends(Truffle, _super);
    /**
     * Create a new smartcontract with the topic.
     * The topic's organization and project parameters are fetched from environment variables.
     * @param group Smartcontract Group
     * @param name Smartcontract Name should match to the name as its defined in the code.
     * @param deployer The passed Truffle.Deployer object in the migration file
     * @param contract The smartcontract artifact
     * @param web3 a Web3js library initiated and ready to use
     * @example Assume that "SomeErc20.sol" file has `contract SomeErc20 {}`
     * Then the `name` parameter should be `SomeErc20`.
     * @throws exception if the environment variables are missing.
     * @requires SDS_ORGANIZATION_NAME environment variable. Example: seascape.
     * @requires SDS_PROJECT_NAME environment variable. Example: `uniswap`.
     * @requires SDS_GATEWAY_HOST environment variable. Example: tcp://localhost:4001
     */
    function Truffle(group, name, deployer, contract, web3) {
        var _this = _super.call(this, group, name) || this;
        _this.deployer = deployer;
        _this.contract = contract;
        _this.web3 = web3;
        return _this;
    }
    /**
     * Deploys smartcontract on the blockchain, then registers it on SeascapeSDS.
     * @param constructorArguments
     */
    Truffle.prototype.deploy = function (constructorArguments) {
        return __awaiter(this, void 0, void 0, function () {
            var network_id, abi, address, txid, topic_string, message, digest, signature, reply;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.web3.eth.net.getId()];
                    case 1:
                        network_id = (_b.sent()).toString();
                        this.set_network_id(network_id);
                        // deploying smartcontract.
                        return [4 /*yield*/, (_a = this.deployer).deploy.apply(_a, __spreadArray([this.contract], constructorArguments, false))];
                    case 2:
                        // deploying smartcontract.
                        _b.sent();
                        abi = this.contract.abi;
                        if (!abi) {
                            throw "error: can not find a smartcontract ABI. Make sure that smartcontrat name in .sol file is ".concat(this.topic.name);
                        }
                        console.log("".concat(this.topic.name, " deployed successfully!"));
                        address = this.contract.address;
                        txid = this.contract.transactionHash;
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        topic_string = this.topic.to_string(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(this.deployer.options.from, 'smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        digest = message.digest();
                        return [4 /*yield*/, this.sign(digest)];
                    case 3:
                        signature = _b.sent();
                        message.set_signature(signature);
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        console.log("The message to send to the user: ", message.toJSON());
                        return [4 /*yield*/, this.gateway.send(message)];
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
     */
    Truffle.prototype.register = function (address, txid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, abi, topic_string, message, digest, signature, reply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.topic;
                        return [4 /*yield*/, this.web3.eth.net.getId()];
                    case 1:
                        _a.network_id = (_b.sent()).toString();
                        console.log("'".concat(this.topic.name, "' address ").concat(address));
                        console.log("'".concat(this.topic.name, "' txid    ").concat(txid));
                        abi = this.contract.abi;
                        if (!abi) {
                            throw "failed to get the smartcontract abi";
                        }
                        topic_string = this.topic.to_string(topic_1.Topic.LEVEL_NAME);
                        message = new smartcontract_developer_request_1.SmartcontractDeveloperRequest(this.deployer.options.from, 'smartcontract_register', {
                            topic_string: topic_string,
                            txid: txid,
                            abi: abi
                        });
                        digest = message.digest();
                        return [4 /*yield*/, this.sign(digest)];
                    case 2:
                        signature = _b.sent();
                        message.set_signature(signature);
                        console.log("Sending 'register_smartcontract' command to SDS Gateway");
                        return [4 /*yield*/, this.gateway.send(message)];
                    case 3:
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
    Truffle.prototype.sign = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var message_hash, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message_hash = this.web3.utils.keccak256(message);
                        return [4 /*yield*/, this.web3.eth.sign(message_hash, this.deployer.options.from)];
                    case 1:
                        signature = _a.sent();
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    return Truffle;
}(smartcontract_1.Smartcontract));
exports.Truffle = Truffle;
//# sourceMappingURL=truffle.js.map