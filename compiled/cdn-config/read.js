"use strict";
/**
 * This module reads the contracts from the global CDN.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */
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
exports.abi = exports.abiConfig = exports.initConfig = exports.availableContracts = exports.contractIndex = exports.contractAddress = void 0;
var json_1 = require("../utils/json");
var util_1 = require("./util");
var contractAddress = function (networkId, type, name) {
    if (!(0, util_1.validateConfNetwork)(networkId)) {
        return false;
    }
    if (global.seascapeCdnConfig[networkId][type] === undefined || global.seascapeCdnConfig[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.contractAddress',
            line: 'no_type',
            message: "Invalid address type '".concat(type, "'")
        });
        return false;
    }
    for (var i = 0; i < global.seascapeCdnConfig[networkId][type].length; i++) {
        var contract = global.seascapeCdnConfig[networkId][type][i];
        if (contract.name.toString() === name) {
            return contract.address.toString();
        }
    }
    console.log({
        error_path: 'src/utils/config.contractAddress',
        line: 'no_found',
        message: "Could not find networkId: '".concat(networkId, "', type: '").concat(type, "', name: '").concat(name, "'")
    });
    return false;
};
exports.contractAddress = contractAddress;
var contractIndex = function (networkId, type, name) {
    if (!(0, util_1.validateConfNetwork)(networkId)) {
        return false;
    }
    if (global.seascapeCdnConfig[networkId][type] === undefined || global.seascapeCdnConfig[networkId][type] === null) {
        return false;
    }
    for (var i = 0; i < global.seascapeCdnConfig[networkId][type].length; i++) {
        var contract = global.seascapeCdnConfig[networkId][type][i];
        if (contract.name.toString() === name) {
            return i;
        }
    }
    console.log({
        error_path: 'src/utils/config.contractIndex',
        line: 'no_found',
        message: "Could not find networkId: '".concat(networkId, "', type: '").concat(type, "', name: '").concat(name, "'")
    });
    return false;
};
exports.contractIndex = contractIndex;
var availableContracts = function (networkId, type) {
    if (!(0, util_1.validateConfNetwork)(networkId)) {
        return false;
    }
    if (global.seascapeCdnConfig[networkId][type] === undefined || global.seascapeCdnConfig[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.availableContracts',
            line: 'no_type',
            message: "Invalid address type '".concat(type, "'")
        });
        return false;
    }
    return global.seascapeCdnConfig[networkId][type];
};
exports.availableContracts = availableContracts;
/**
 * Initialize the Config once only. The config loaded from CDN is set globally.
 * @param configUrl string link starting with http:// or https://
 * @param empty by default FALSE, if it's empty, then when the remote is not exists,
 * then it will be created in the repo as empty object
 * @returns TRUE or FALSE
 */
var initConfig = function (configPath, empty) {
    if (empty === void 0) { empty = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = (0, util_1.cdnConfigUrl)(configPath);
                    if (!(global.seascapeCdnConfig !== undefined && global.seascapeCdnConfig !== null)) return [3 /*break*/, 1];
                    return [2 /*return*/, true];
                case 1: return [4 /*yield*/, (0, json_1.loadRemote)(url, empty)];
                case 2:
                    config = _a.sent();
                    if (config === false) {
                        if (empty) {
                            global.seascapeCdnConfig = {};
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                    }
                    else {
                        global.seascapeCdnConfig = config;
                        return [2 /*return*/, true];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.initConfig = initConfig;
var abiConfig = function (smartcontractName, temp) {
    if (temp === void 0) { temp = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fullAddressParam, url, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullAddressParam = { fullAddress: false, temp: temp };
                    url = (0, util_1.cdnAbiConfigUrl)(smartcontractName, fullAddressParam);
                    return [4 /*yield*/, (0, json_1.loadRemote)(url, true)];
                case 1:
                    config = _a.sent();
                    if (config === false) {
                        return [2 /*return*/, (0, util_1.defaultAbiConfig)()];
                    }
                    else {
                        return [2 /*return*/, config];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.abiConfig = abiConfig;
var abi = function (contractName, config, temp) {
    if (temp === void 0) { temp = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fullAddressParam, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullAddressParam = { fullAddress: false, temp: temp };
                    url = (0, util_1.cdnAbiUrl)(contractName, config, fullAddressParam);
                    return [4 /*yield*/, (0, json_1.loadRemote)(url)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.abi = abi;
//# sourceMappingURL=read.js.map