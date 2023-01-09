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
exports.request = exports.generate_key = void 0;
var zmq = require("zeromq");
var reply_1 = require("./message/reply");
var Account = require("./account");
var ethers_1 = require("ethers");
// Init returns the Gateway connected socket.
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var server_public_key, public_key, secret_key, socket, host;
    return __generator(this, function (_a) {
        server_public_key = process.env.SDS_GATEWAY_PUBLIC_KEY;
        if (typeof server_public_key !== "string") {
            throw "missing 'SDS_GATEWAY_PUBLIC_KEY' environment variable";
        }
        if (server_public_key.length === 0) {
            throw "empty 'SDS_GATEWAY_PUBLIC_KEY' environment variable";
        }
        public_key = process.env.SMARTCONTRACT_DEVELOPER_PUBLIC_KEY;
        if (typeof public_key !== "string") {
            throw "missing 'SMARTCONTRACT_DEVELOPER_PUBLIC_KEY' environment variable";
        }
        if (public_key.length === 0) {
            throw "empty 'SMARTCONTRACT_DEVELOPER_PUBLIC_KEY' environment variable";
        }
        secret_key = process.env.SMARTCONTRACT_DEVELOPER_SECRET_KEY;
        if (typeof secret_key !== "string") {
            throw "missing 'SMARTCONTRACT_DEVELOPER_SECRET_KEY' environment variable";
        }
        if (secret_key.length === 0) {
            throw "empty 'SMARTCONTRACT_DEVELOPER_SECRET_KEY' environment variable";
        }
        socket = new zmq.Request({
            linger: 0,
            curveServerKey: server_public_key,
            curvePublicKey: public_key,
            curveSecretKey: secret_key
        });
        host = process.env.SDS_GATEWAY_HOST;
        if (typeof host !== "string") {
            throw "missing 'SDS_GATEWAY_HOST' environment variable";
        }
        if (host.length === 0) {
            throw "empty 'SDS_GATEWAY_HOST' environment variable";
        }
        socket.connect("tcp://" + host);
        return [2 /*return*/, socket];
    });
}); };
/// Returns a curve keypair that's used for the backend developers.
/// @param private_key is the smartcontract developer's account key
var generate_key = function (private_key) {
    return __awaiter(this, void 0, void 0, function () {
        var developer, message, gateway_reply, public_key, secret_key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    developer = new ethers_1.ethers.Wallet(private_key);
                    message = new MsgRequest('generate_key', {});
                    return [4 /*yield*/, message.sign(developer)];
                case 1:
                    message = _a.sent();
                    return [4 /*yield*/, (0, exports.request)(message)];
                case 2:
                    gateway_reply = _a.sent();
                    if (!gateway_reply.is_ok()) {
                        return [2 /*return*/, gateway_reply];
                    }
                    return [4 /*yield*/, Account.decrypt(developer, gateway_reply.params.public_key)];
                case 3:
                    public_key = _a.sent();
                    return [4 /*yield*/, Account.decrypt(developer, gateway_reply.params.secret_key)];
                case 4:
                    secret_key = _a.sent();
                    gateway_reply.params.public_key = public_key.toString();
                    gateway_reply.params.secret_key = secret_key.toString();
                    return [2 /*return*/, gateway_reply];
            }
        });
    });
};
exports.generate_key = generate_key;
var request = function (msg) {
    return __awaiter(this, void 0, void 0, function () {
        var socket, err_1, err_2, reply, resultBuffer, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (msg.address === undefined || msg.address === null) {
                        return [2 /*return*/, reply_1.Reply.fail("Failed to do to a request. The request should be signed first", {})];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, init()];
                case 2:
                    socket = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, reply_1.Reply.fail("Failed to init connection with SDS Gateway: " + err_1.toString(), {})];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, socket.send(msg.toString())];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    return [2 /*return*/, reply_1.Reply.fail("Failed to send message to SDS Gateway: " + err_2.toString(), {})];
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, socket.receive()];
                case 8:
                    resultBuffer = (_a.sent())[0];
                    reply = reply_1.Reply.fromBuffer(resultBuffer);
                    return [3 /*break*/, 10];
                case 9:
                    err_3 = _a.sent();
                    reply = reply_1.Reply.fail("Failed to receive message from SDS Gateway: " + err_3.toString(), {});
                    return [3 /*break*/, 10];
                case 10:
                    socket.close();
                    return [2 /*return*/, reply];
            }
        });
    });
};
exports.request = request;
//# sourceMappingURL=gateway.js.map