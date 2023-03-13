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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.SmartcontractDeveloperRequest = void 0;
var request_1 = require("./request");
var stringify = require('json-stable-stringify');
/**
 * The message that's send by Smartcontract Developer to the SeascapeSDS.
 * This message is derived from message.Request() with additional parameters:
 * - params
 */
var SmartcontractDeveloperRequest = /** @class */ (function (_super) {
    __extends(SmartcontractDeveloperRequest, _super);
    function SmartcontractDeveloperRequest(address, command, params) {
        var _this = _super.call(this, command, params) || this;
        _this.address = address;
        _this.set_nonce();
        return _this;
    }
    /**
     * Whether the message included signature or not
     */
    SmartcontractDeveloperRequest.prototype.is_signed = function () {
        return this.signature.length > 0;
    };
    SmartcontractDeveloperRequest.prototype.toJSON = function () {
        // Clone the parameters.
        var parameters = __assign({}, this.parameters);
        parameters['_address'] = this.address;
        parameters['_signature'] = this.signature;
        parameters['_nonce_timestamp'] = this.nonce_timestamp;
        var request = new request_1.Request(this.command, parameters);
        return request.toJSON();
    };
    SmartcontractDeveloperRequest.prototype.set_nonce = function () {
        this.nonce_timestamp = Math.round(new Date().getTime() * 1000000);
    };
    // serialize the message
    // for signature generetion
    SmartcontractDeveloperRequest.prototype.digest = function () {
        var obj = this.toJSON();
        delete obj["parameters"]["_signature"];
        var message = stringify(obj);
        return message;
    };
    SmartcontractDeveloperRequest.prototype.set_signature = function (signature) {
        this.signature = signature;
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
            return new SmartcontractDeveloperRequest("", request_1.Request.NO_COMMAND, {});
        }
        if (!obj.command || !obj.params) {
            return new SmartcontractDeveloperRequest("", request_1.Request.NO_COMMAND, {});
        }
        var request = new SmartcontractDeveloperRequest(obj.address, obj.command, obj.params);
        request.nonce_timestamp = obj.nonce_timestamp;
        request.signature = obj.signature;
        return request;
    };
    return SmartcontractDeveloperRequest;
}(request_1.Request));
exports.SmartcontractDeveloperRequest = SmartcontractDeveloperRequest;
//# sourceMappingURL=smartcontract_developer_request.js.map