"use strict";
exports.__esModule = true;
exports.cdnWriteAbiUrl = exports.cdnReadAbiUrl = exports.cdnWriteAbiConfigUrl = exports.cdnReadAbiConfigUrl = exports.cdnConfigUrl = exports.cdnBucket = exports.cdnUrl = exports.SmartcontractPath = exports.ProjectPath = exports.SmartcontractParams = void 0;
var SEASCAPE_CDN = 'https://cdn.seascape.network';
var SEASCAPE_TEMP_CDN = 'https://cdn-temp.seascape.network';
var SEASCAPE_CDN_BUCKET = 'seascape-cdn';
var SEASCAPE_TEMP_CDN_BUCKET = 'seascape-cdn-temp';
var SmartcontractParams = /** @class */ (function () {
    function SmartcontractParams(name, abi, address, txid, owner, verifier, fund) {
        if (owner === void 0) { owner = ""; }
        if (verifier === void 0) { verifier = ""; }
        if (fund === void 0) { fund = ""; }
        this.name = name;
        this.abi = abi;
        this.address = address;
        this.txid = txid;
        this.owner = owner;
        this.verifier = verifier;
        this.fund = fund;
    }
    return SmartcontractParams;
}());
exports.SmartcontractParams = SmartcontractParams;
var ProjectPath = /** @class */ (function () {
    function ProjectPath(project, env, empty, temp) {
        this.project = project;
        this.env = env;
        this.empty = empty;
        this.temp = temp;
    }
    return ProjectPath;
}());
exports.ProjectPath = ProjectPath;
var SmartcontractPath = /** @class */ (function () {
    function SmartcontractPath(network_id, category) {
        this.network_id = network_id;
        this.category = category;
    }
    return SmartcontractPath;
}());
exports.SmartcontractPath = SmartcontractPath;
var cdnUrl = function (temp) {
    if (!temp) {
        return SEASCAPE_CDN;
    }
    return SEASCAPE_TEMP_CDN;
};
exports.cdnUrl = cdnUrl;
var cdnBucket = function (temp) {
    if (!temp) {
        return SEASCAPE_CDN_BUCKET;
    }
    return SEASCAPE_TEMP_CDN_BUCKET;
};
exports.cdnBucket = cdnBucket;
var cdnConfigUrl = function (path) {
    return "".concat((0, exports.cdnUrl)(path.temp), "/").concat(path.project, "/").concat(path.env, "/config.json");
};
exports.cdnConfigUrl = cdnConfigUrl;
var cdnReadAbiConfigUrl = function (name, temp) {
    return "".concat((0, exports.cdnUrl)(temp), "/abi/").concat(name, "/info.json");
};
exports.cdnReadAbiConfigUrl = cdnReadAbiConfigUrl;
var cdnWriteAbiConfigUrl = function (name) {
    return "/abi/".concat(name, "/info.json");
};
exports.cdnWriteAbiConfigUrl = cdnWriteAbiConfigUrl;
var cdnReadAbiUrl = function (temp, config) {
    return "".concat((0, exports.cdnUrl)(temp), "/abi/").concat(config.name(), "/").concat(config.version().toString(), ".json");
};
exports.cdnReadAbiUrl = cdnReadAbiUrl;
var cdnWriteAbiUrl = function (config) {
    return "/abi/".concat(config.name(), "/").concat(config.version().toString(), ".json");
};
exports.cdnWriteAbiUrl = cdnWriteAbiUrl;
//# sourceMappingURL=util.js.map