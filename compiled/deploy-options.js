"use strict";
exports.__esModule = true;
exports.DeployOptions = void 0;
var axios = require('axios')["default"];
var DeployOptions = /** @class */ (function () {
    function DeployOptions(signerEnabled, signerAddress) {
        if (signerEnabled === void 0) { signerEnabled = false; }
        if (signerAddress === void 0) { signerAddress = ""; }
        this.signerEnabled = signerEnabled;
        this.signerAddress = signerAddress;
    }
    return DeployOptions;
}());
exports.DeployOptions = DeployOptions;
//# sourceMappingURL=deploy-options.js.map