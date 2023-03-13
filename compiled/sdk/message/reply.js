"use strict";
exports.__esModule = true;
exports.Reply = void 0;
var Reply = /** @class */ (function () {
    function Reply(status, message, parameters) {
        this.status = status,
            this.message = message;
        this.parameters = parameters;
    }
    Reply.prototype.is_ok = function () {
        return this.status == Reply.OK;
    };
    Reply.prototype.toJSON = function () {
        return {
            status: this.status,
            message: this.message,
            parameters: this.parameters
        };
    };
    Reply.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    Reply.fail = function (message, parameters) {
        if (parameters == undefined) {
            parameters = {};
        }
        return new Reply(Reply.FAIL, message, parameters);
    };
    Reply.ok = function (parameters) {
        if (parameters == undefined) {
            parameters = {};
        }
        return new Reply(Reply.OK, '', parameters);
    };
    Reply.fromBuffer = function (buffer) {
        var raw = buffer.toString();
        var obj = JSON.parse(raw);
        return new Reply(obj.status, obj.message, obj.parameters);
    };
    Reply.FAIL = 'fail';
    Reply.OK = 'OK';
    return Reply;
}());
exports.Reply = Reply;
//# sourceMappingURL=reply.js.map