"use strict";
exports.__esModule = true;
exports.TYPES = void 0;
var ethers_1 = require("ethers");
var TYPES;
(function (TYPES) {
    TYPES[TYPES["UINT8"] = 0] = "UINT8";
    TYPES[TYPES["UINT256"] = 1] = "UINT256";
    TYPES[TYPES["ADDRESS"] = 2] = "ADDRESS";
    TYPES[TYPES["DECIMAL_18"] = 3] = "DECIMAL_18";
    TYPES[TYPES["DECIMAL_6"] = 4] = "DECIMAL_6";
    TYPES[TYPES["RAW"] = 5] = "RAW";
})(TYPES = exports.TYPES || (exports.TYPES = {}));
/**
 * @description Checks that value is according to the Smartcontract Type
 * Necessary before converting JS type to Smartcontract type otherwise it will fail
 * @param type TYPES
 * @param value any
 * @returns boolean
 */
var validValue = function (type, value) {
    if (type === TYPES.UINT8 || type === TYPES.UINT256 || type === TYPES.DECIMAL_18 || type === TYPES.DECIMAL_6) {
        var num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            return false;
        }
    }
    if ((type === TYPES.ADDRESS || type === TYPES.RAW) && value.indexOf("0x") !== 0) {
        return false;
    }
    return true;
};
/**
 * @description Encode the value into hex format (JS type to Smartcontract type)
 * @param type TYPES
 * @param value any
 * @returns string representation in hexstring format
 */
var abiEncode = function (type, value) {
    if (type === TYPES.UINT8) {
        return ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.utils.hexlify(value), 1);
    }
    else if (type === TYPES.UINT256) {
        return ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256"], [value]);
    }
    else if (type === TYPES.ADDRESS) {
        return value;
    }
    else if (type === TYPES.DECIMAL_18) {
        var wei = ethers_1.ethers.utils.parseEther(value.toString());
        return ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256"], [wei]);
    }
    else if (type === TYPES.DECIMAL_6) {
        var wei = ethers_1.ethers.utils.parseUnits(value.toString(), 6);
        return ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256"], [wei]);
    }
    else if (type === TYPES.RAW) {
        return value;
    }
    throw Error("No encoding implementation of Smartcontract Type ".concat(type));
};
var SmartcontractData = /** @class */ (function () {
    function SmartcontractData(type, value) {
        if (!validValue(type, value)) {
            throw Error("Invalid value ".concat(value, " of type ").concat(type));
        }
        this.type = type;
        this.value = value;
        this.hex = abiEncode(type, value);
    }
    SmartcontractData.prototype.hash = function () {
        return ethers_1.ethers.utils.keccak256(this.hex);
    };
    SmartcontractData.concat = function (params) {
        var hex = "0x";
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            hex += param.hex.substring(2);
        }
        // The address is not checked
        var data = new SmartcontractData(TYPES.RAW, hex);
        return data;
    };
    return SmartcontractData;
}());
exports["default"] = SmartcontractData;
//# sourceMappingURL=smartcontract-data.js.map