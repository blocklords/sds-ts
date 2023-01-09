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
exports.SmartcontractDeveloperRequest = void 0;
var ethers_1 = require("ethers");
var request_1 = require("./request");
var stringify = require('json-stable-stringify');
var SmartcontractDeveloperRequest = /** @class */ (function (_super) {
    __extends(SmartcontractDeveloperRequest, _super);
    function SmartcontractDeveloperRequest(command, params) {
        return _super.call(this, command, params) || this;
    }
    SmartcontractDeveloperRequest.prototype.toJSON = function () {
        return {
            address: this.address,
            signature: this.signature,
            nonce_timestamp: this.nonce_timestamp,
            command: this.command,
            parameters: this.params
        };
    };
    SmartcontractDeveloperRequest.prototype.set_nonce = function () {
        this.nonce_timestamp = Math.round(new Date().getTime() * 1000000);
    };
    SmartcontractDeveloperRequest.prototype.sign = function (developer, web3) {
        if (web3 === void 0) { web3 = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var message, message_hash, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (developer instanceof ethers_1.ethers.Signer) {
                            return [2 /*return*/, this.ethers_sign(developer)];
                        }
                        this.address = developer;
                        this.set_nonce();
                        message = stringify(this.toJSON());
                        // for the signature we don't need the signature
                        delete message.signature;
                        message_hash = web3.utils.keccak256(message);
                        return [4 /*yield*/, web3.eth.sign(message_hash, developer)];
                    case 1:
                        signature = _a.sent();
                        this.signature = signature;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    SmartcontractDeveloperRequest.prototype.ethers_sign = function (developer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message, message_hash, signature;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, developer.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        this.set_nonce();
                        message = stringify(this.toJSON());
                        // for the signature we don't need the signature
                        delete message.signature;
                        message_hash = ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.id(message));
                        return [4 /*yield*/, developer.signMessage(message_hash)];
                    case 2:
                        signature = _b.sent();
                        this.signature = signature;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    SmartcontractDeveloperRequest.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    SmartcontractDeveloperRequest.fromBuffer = function (buffer) {
        var raw = buffer.toString();
        var obj;
        try {
            obj = JSON.parse(raw);
        }
        catch (error) {
            return new SmartcontractDeveloperRequest(request_1.Request.NO_COMMAND, {});
        }
        if (!obj.command || !obj.params) {
            return new SmartcontractDeveloperRequest(request_1.Request.NO_COMMAND, {});
        }
        var request = new SmartcontractDeveloperRequest(obj.command, obj.params);
        request.address = obj.address;
        request.nonce_timestamp = obj.nonce_timestamp;
        request.signature = obj.signature;
        return request;
    };
    return SmartcontractDeveloperRequest;
}(request_1.Request));
exports.SmartcontractDeveloperRequest = SmartcontractDeveloperRequest;
//# sourceMappingURL=smartcontract_developer_request.js.map