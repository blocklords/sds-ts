"use strict";
exports.__esModule = true;
exports.Request = void 0;
var Request = /** @class */ (function () {
    function Request(command, params) {
        this.command = command;
        this.params = params;
    }
    Request.prototype.toJSON = function () {
        return {
            command: this.command,
            params: this.params
        };
    };
    Request.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    Request.Close = function (params) {
        return new Request(Request.CLOSE, params);
    };
    Request.fromBuffer = function (buffer) {
        var raw = buffer.toString();
        var obj;
        try {
            obj = JSON.parse(raw);
        }
        catch (error) {
            return new Request(Request.NO_COMMAND, {});
        }
        if (!obj.command || !obj.params) {
            return new Request(Request.NO_COMMAND, {});
        }
        return new Request(obj.command, obj.params);
    };
    Request.CLOSE = 'close';
    Request.NO_COMMAND = '';
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map