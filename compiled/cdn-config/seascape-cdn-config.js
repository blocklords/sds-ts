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
var CdnUtil = require("./util");
var json_1 = require("../utils/json");
var alicloud_1 = require("./alicloud");
var SeascapeCdnConfig = /** @class */ (function () {
    function SeascapeCdnConfig(seascapeCdnConfig, project) {
        var _this = this;
        this.setSmartcontract = function (cdnClient, smartcontractPath, obj) { return __awaiter(_this, void 0, void 0, function () {
            var idString, category, i, uploaded;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        idString = smartcontractPath.network_id.toString();
                        category = smartcontractPath.category;
                        if (!this.seascapeCdnConfig[idString]) {
                            this.seascapeCdnConfig[idString] = {};
                        }
                        if (!this.seascapeCdnConfig[idString][category]) {
                            this.seascapeCdnConfig[idString][category] = [];
                        }
                        i = this.contractIndex(idString, category, obj.name);
                        if (i === false) {
                            this.seascapeCdnConfig[idString][category].push(obj);
                        }
                        else {
                            this.seascapeCdnConfig[idString][category][i] = obj;
                        }
                        return [4 /*yield*/, (0, alicloud_1.uploadConfig)(cdnClient, this)];
                    case 1:
                        uploaded = _b.sent();
                        if (uploaded === null) {
                            console.log({
                                error_path: 'src/cdn-config/write.setSmartcontract',
                                line: 'no_upload',
                                message: "Please fix the Alicloud credentials"
                            });
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.projectPath = function () {
            return _this.project;
        };
        this.toJSON = function () {
            return _this.seascapeCdnConfig;
        };
        this.toString = function () {
            return JSON.stringify(_this.seascapeCdnConfig, null, 4);
        };
        this.seascapeCdnConfig = seascapeCdnConfig;
        this.project = project;
    }
    SeascapeCdnConfig.ValidateConfNetwork = function (seascapeCdnConfig, network_id) {
        if (seascapeCdnConfig === undefined || seascapeCdnConfig === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'noseascapeCdnConfig',
                message: "Please define global file"
            });
            return false;
        }
        if (seascapeCdnConfig[network_id] === undefined || seascapeCdnConfig[network_id] === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'no_network_id',
                message: "Invalid network id '".concat(network_id, "'")
            });
            return false;
        }
        return true;
    };
    /**
     * Return the Address of the Contract
     * @requires Global CDN config to be initialized
     * @param network_id where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns string
     */
    SeascapeCdnConfig.prototype.contractAddress = function (network_id, type, name) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }
        if (this.seascapeCdnConfig[network_id][type] === undefined || this.seascapeCdnConfig[network_id][type] === null) {
            console.log({
                error_path: 'SeascapeCdnConfig.contractAddress',
                line: 'no_type',
                message: "Invalid address type '".concat(type, "'")
            });
            return false;
        }
        for (var i = 0; i < this.seascapeCdnConfig[network_id][type].length; i++) {
            var contract = this.seascapeCdnConfig[network_id][type][i];
            if (contract.name.toString() === name) {
                return contract.address.toString();
            }
        }
        console.log({
            error_path: 'SeascapeCdnConfig.contractAddress',
            line: 'no_found',
            message: "Could not find network_id: '".concat(network_id, "', type: '").concat(type, "', name: '").concat(name, "'")
        });
        return false;
    };
    /**
     * Returns the index of a contract information in the CDN Config
     * @requires Global CDN configuration to be initialized
     * @param network_id where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns a number
     */
    SeascapeCdnConfig.prototype.contractIndex = function (network_id, type, name) {
        if (this.seascapeCdnConfig[network_id][type] === undefined || this.seascapeCdnConfig[network_id][type] === null) {
            return false;
        }
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }
        for (var i = 0; i < this.seascapeCdnConfig[network_id][type].length; i++) {
            var contract = this.seascapeCdnConfig[network_id][type][i];
            if (contract.name.toString() === name) {
                return i;
            }
        }
        console.log({
            error_path: 'src/utils/config.contractIndex',
            line: 'no_found',
            message: "Could not find network_id: '".concat(network_id, "', type: '").concat(type, "', name: '").concat(name, "'")
        });
        return false;
    };
    /**
     * Returns list of the contracts of the certain type in the certain network
     * @requires Global CDN config to be initialized
     * @param network_id where contracts are deployed
     * @param type of the contracts
     * @returns false in case of an error, otherwise it returns the list of ContractConfigs
     */
    SeascapeCdnConfig.prototype.availableContracts = function (network_id, category) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, network_id)) {
            return false;
        }
        if (this.seascapeCdnConfig[network_id][category] === undefined || this.seascapeCdnConfig[network_id][category] === null) {
            console.log({
                error_path: 'src/utils/config.availableContracts',
                line: 'no_type',
                message: "Invalid address category '".concat(category, "'")
            });
            return false;
        }
        return this.seascapeCdnConfig[network_id][category];
    };
    var _a;
    _a = SeascapeCdnConfig;
    SeascapeCdnConfig.New = function (projectPath) { return __awaiter(void 0, void 0, void 0, function () {
        var url, config;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    url = CdnUtil.cdnConfigUrl(projectPath);
                    return [4 /*yield*/, (0, json_1.loadRemote)(url, projectPath.empty)];
                case 1:
                    config = _b.sent();
                    if (config === false) {
                        if (projectPath.empty) {
                            return [2 /*return*/, new SeascapeCdnConfig({}, projectPath)];
                        }
                        else {
                            throw "Failed to load the Seascape CDN Config from the remote path";
                        }
                    }
                    else {
                        return [2 /*return*/, new SeascapeCdnConfig(config, projectPath)];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return SeascapeCdnConfig;
}());
exports["default"] = SeascapeCdnConfig;
//# sourceMappingURL=seascape-cdn-config.js.map