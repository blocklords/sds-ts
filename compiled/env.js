"use strict";
exports.__esModule = true;
exports.verify_env = void 0;
/**
 * @description Validates the environment variables.
 * In case of missing any value, throws an error.
 */
var verify_env = function () {
    if (!process.env.SDS_ORGANIZATION_NAME) {
        throw 'Missing SDS_ORGANIZATION_NAME environment variable';
    }
    if (!process.env.SDS_PROJECT_NAME) {
        throw 'Missing SDS_PROJECT_NAME environment variable';
    }
    var host = process.env.SDS_GATEWAY_HOST;
    if (!host) {
        throw "Missing 'SDS_GATEWAY_HOST' environment variable";
    }
};
exports.verify_env = verify_env;
//# sourceMappingURL=env.js.map