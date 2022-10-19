"use strict";
exports.__esModule = true;
exports.Reply = void 0;
var Reply = /** @class */ (function () {
    function Reply(status, message, params) {
        this.status = status,
            this.message = message;
        this.params = params;
    }
    Reply.prototype.is_ok = function () {
        return this.status == Reply.OK;
    };
    Reply.prototype.toJSON = function () {
        return {
            status: this.status,
            message: this.message,
            params: this.params
        };
    };
    Reply.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    Reply.fail = function (message, params) {
        if (params == undefined) {
            params = {};
        }
        return new Reply(Reply.FAIL, message, params);
    };
    Reply.ok = function (params) {
        if (params == undefined) {
            params = {};
        }
        return new Reply(Reply.OK, '', params);
    };
    Reply.fromBuffer = function (buffer) {
        var raw = buffer.toString();
        var obj = JSON.parse(raw);
        return new Reply(obj.status, obj.message, obj.params);
    };
    Reply.FAIL = 'fail';
    Reply.OK = 'OK';
    return Reply;
}());
exports.Reply = Reply;
//# sourceMappingURL=reply.js.map