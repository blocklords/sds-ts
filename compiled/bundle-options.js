"use strict";
exports.__esModule = true;
exports.BundleOptions = void 0;
var BundleOptions = /** @class */ (function () {
    function BundleOptions(pool_limit, length_argument_name, pool_expire_seconds) {
        if (pool_limit === void 0) { pool_limit = 100; }
        if (length_argument_name === void 0) { length_argument_name = ""; }
        if (pool_expire_seconds === void 0) { pool_expire_seconds = 3600; }
        this.pool_limit = pool_limit;
        this.pool_expire_seconds = pool_expire_seconds;
        this.length_argument_name = length_argument_name;
    }
    BundleOptions.prototype.toJSON = function () {
        return {
            pool_limit: this.pool_limit,
            pool_expire_seconds: this.pool_expire_seconds,
            length_argument_name: this.length_argument_name
        };
    };
    return BundleOptions;
}());
exports.BundleOptions = BundleOptions;
//# sourceMappingURL=bundle-options.js.map