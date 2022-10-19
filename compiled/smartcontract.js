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
exports.__esModule = true;
exports.Smartcontract = void 0;
var hardhat_1 = require("./utils/hardhat");
var axios = require('axios')["default"];
var Smartcontract = /** @class */ (function () {
    function Smartcontract(name, group) {
        this.name = name;
        this.group = group;
    }
    /*let Token               = await ethers.getContractFactory("Token");
      let deployer            = await ethers.getSigner();
      let smartcontract       = new Smartcontract({name: 'my-sample-token', group: 'erc20'});
  
      // The last two parameters are constructor arguments.
      await smartcontract.deployInHardhat(deployer, Token, deployer.address, 1).catch(console.error);
    */
    Smartcontract.prototype.deployInHardhat = function (deployer, contract, constructorArguments, options) {
        return __awaiter(this, void 0, void 0, function () {
            var abi, deployed, address, txid, network_id, smartcontract_developer, topic_string, register, res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, hardhat_1.abiFile)(this.name)];
                    case 1:
                        abi = _b.sent();
                        if (abi === false) {
                            throw 'SMARTCONTRACT_NAME_INVALID: can not find a smartcontract ABI. Make sure that Smartcontract name matches in the source code as well';
                        }
                        if (!process.env.SDS_ORGANIZATION_NAME) {
                            throw 'Missing SDS_ORGANIZATION_NAME environment variable';
                        }
                        if (!process.env.SDS_PROJECT_NAME) {
                            throw 'Missing SDS_PROJECT_NAME environment variable';
                        }
                        return [4 /*yield*/, (_a = contract.connect(deployer)).deploy.apply(_a, constructorArguments)];
                    case 2:
                        deployed = _b.sent();
                        console.log("Smartcontract is deploying... Please wait...");
                        // waiting for transaction confirmation...
                        return [4 /*yield*/, deployed.deployed()];
                    case 3:
                        // waiting for transaction confirmation...
                        _b.sent();
                        console.log("'".concat(this.name, "' smartcontract was deployed on ").concat(deployed.address, "!"));
                        console.log("Txhash: ".concat(deployed.deployTransaction.hash));
                        address = deployed.address;
                        txid = deployed.deployTransaction.hash;
                        return [4 /*yield*/, deployer.getChainId()];
                    case 4:
                        network_id = _b.sent();
                        return [4 /*yield*/, deployer.getAddress()];
                    case 5:
                        smartcontract_developer = _b.sent();
                        topic_string = "".concat(process.env.SDS_ORGANIZATION_NAME, ".").concat(process.env.SDS_PROJECT_NAME, ".").concat(network_id, ".").concat(this.group, ".").concat(this.name);
                        register = {
                            topic_string: topic_string,
                            address: address,
                            smartcontract_developer: smartcontract_developer,
                            txid: txid,
                            abi: abi,
                            options: options
                        };
                        return [4 /*yield*/, axios({
                                url: "http://".concat(process.env.SDS_REMOTE_HTTP, ":").concat(process.env.LISTENER_HTTP_SERVER_PORT, "/register-smartcontract"),
                                method: 'post',
                                // transformRequest: (data, _headers) => {
                                //   return JSON.stringify(data);
                                // },
                                data: register
                            })["catch"](function (e) {
                                console.error(e);
                                process.exit(0);
                            })];
                    case 6:
                        res = _b.sent();
                        console.log("Result");
                        if (res.data && res.data.status === 'OK') {
                            console.log("Successfully registered.");
                            console.log("CDN available at: the url");
                            console.log("Check the backend for the API");
                        }
                        else if (res.data) {
                            console.error(res.data);
                        }
                        else {
                            console.error(res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Smartcontract.prototype.enableBundling = function (smartcontractDeveloper, signerAddress, method, options) {
        return __awaiter(this, void 0, void 0, function () {
            var bundle, _a, _b, _c, _d, res;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!process.env.SDS_ORGANIZATION_NAME) {
                            throw 'Missing SDS_ORGANIZATION_NAME environment variable';
                        }
                        if (!process.env.SDS_PROJECT_NAME) {
                            throw 'Missing SDS_PROJECT_NAME environment variable';
                        }
                        bundle = options.toJSON();
                        _a = bundle;
                        _c = (_b = "".concat(process.env.SDS_ORGANIZATION_NAME, ".").concat(process.env.SDS_PROJECT_NAME, ".")).concat;
                        return [4 /*yield*/, smartcontractDeveloper.getChainId()];
                    case 1:
                        _a.topic_string = _c.apply(_b, [_e.sent(), "."]).concat(this.group, ".").concat(this.name, ".").concat(method);
                        _d = bundle;
                        return [4 /*yield*/, smartcontractDeveloper.getAddress()];
                    case 2:
                        _d.smartcontract_developer = _e.sent();
                        bundle.signer_address = signerAddress;
                        return [4 /*yield*/, axios({
                                url: "http://".concat(process.env.SDS_REMOTE_HTTP, ":").concat(process.env.LISTENER_HTTP_SERVER_PORT, "/enable-bundling"),
                                method: 'post',
                                data: bundle
                            })["catch"](function (e) {
                                if (!e.response) {
                                    console.error("Server might be down. Connection refused!");
                                }
                                else {
                                    console.error("Error http code: ".concat(e.response.status, ", data: ").concat(JSON.stringify(e.response.data, null, 4)));
                                }
                                process.exit(0);
                            })];
                    case 3:
                        res = _e.sent();
                        if (res.data && res.data.status === 'OK') {
                            console.log("Successfully registered.");
                            console.log("CDN available at: the url");
                            console.log("Check the backend for the API");
                        }
                        else if (res.data) {
                            console.log("Data is returned");
                            console.error(res.data);
                        }
                        else {
                            console.error("".concat(JSON.stringify(res, null, 4)));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Returns a Contract interface
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