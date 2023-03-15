"use strict";
exports.__esModule = true;
exports.Request = void 0;
var Request = /** @class */ (function () {
    function Request(command, parameters) {
        this.command = command;
        this.parameters = parameters;
    }
    Request.prototype.toJSON = function () {
        return {
            "command": this.command,
            "parameters": this.parameters
        };
    };
    Request.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    Request.Close = function (parameters) {
        return new Request(Request.CLOSE, parameters);
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
        if (!obj.command || !obj.parameters) {
            return new Request(Request.NO_COMMAND, {});
        }
        return new Request(obj.command, obj.parameters);
    };
    Request.CLOSE = 'close';
    Request.NO_COMMAND = '';
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map