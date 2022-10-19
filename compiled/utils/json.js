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
exports.loadRemote = exports.loadLocalSync = void 0;
var fs = require("fs");
var axios_1 = require("axios");
/**
 * Load the local JSON file as a JS object.
 * @param path String
 * @requires JSON file should be in the same machine and in UTF-8 format.
 * @returns Object or FALSE
 */
var loadLocalSync = function (path) {
    var rawdata = '';
    try {
        rawdata = fs.readFileSync(path, 'utf-8');
    }
    catch (_a) {
        console.log({
            error_path: 'src/utils/json.loadLocalSync',
            line: 'reading_file',
            message: "failed to load the file\non path '".concat(path, "'")
        });
        return false;
    }
    try {
        return JSON.parse(rawdata);
    }
    catch (_b) {
        console.log({
            error_path: 'src/utils/json..loadLocalSync',
            line: 'parsing',
            message: "could not convert into the file\non path '".concat(path, "'")
        });
        return false;
    }
};
exports.loadLocalSync = loadLocalSync;
/**
 * Load the JSON file as a JS object from remote machine
 * @param url The remote path of the JSON file
 * @param noError The error is not shown if its set to true.
 * @returns Object or FALSE
 */
var loadRemote = function (url, noError) {
    if (noError === void 0) { noError = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: 'get',
                            url: url,
                            responseType: 'json'
                        })];
                case 1:
                    res = _a.sent();
                    if (typeof (res.data) !== 'object') {
                        throw "Invalid JSON was fetched from '".concat(url, "'. Please make sure that it's in the JSON format");
                    }
                    return [2 /*return*/, res.data];
                case 2:
                    error_1 = _a.sent();
                    if (axios_1["default"].isAxiosError(error_1)) {
                        if (!noError) {
                            console.log({
                                error_path: 'src/utils/json.loadRemote',
                                line: 'axios',
                                message: "could not fetch remote data\nfrom path '".concat(url, "'\nRemote handler error: ").concat(error_1.message)
                            });
                        }
                        return [2 /*return*/, false];
                    }
                    else {
                        console.log({
                            error_path: 'src/utils/json.loadRemote',
                            line: 'unknown',
                            message: "could not fetch remote data\nfrom path '".concat(url, "'\nRemote handler error: ").concat(error_1)
                        });
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.loadRemote = loadRemote;
//# sourceMappingURL=json.js.map