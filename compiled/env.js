"use strict";
exports.__esModule = true;
exports.verify_env = void 0;
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
    var secret_key = process.env.SDS_SECRET_KEY;
    if (!secret_key) {
        throw "Missing 'SDS_SECRET_KEY' environment variable";
    }
    if (!process.env.SDS_PUBLIC_KEY) {
        throw "Missing 'SDS_PUBLIC_KEY' environment variable";
    }
};
exports.verify_env = verify_env;
//# sourceMappingURL=env.js.map