import * as zmq from "zeromq";
import { SmartcontractDeveloperRequest as MsgRequest } from "./message/smartcontract_developer_request";
import { Reply as MsgReply } from "./message/reply";

// Init returns the Gateway connected socket.
let init = async () : Promise<zmq.Request> => {
    let socket = new zmq.Request();

    let host = process.env.SDS_GATEWAY_HOST!
    if (typeof host !== "string") {
        throw "missing 'SDS_GATEWAY_HOST' environment variable";
    }
    if (host.length === 0) {
        throw "empty 'SDS_GATEWAY_HOST' environment variable"
    }

    socket.connect(`tcp://` + host)

    return socket
}

export let request = async function(msg: MsgRequest): Promise<MsgReply> {
    if (msg.address === undefined || msg.address === null) {
        return MsgReply.fail("Failed to do to a request. The request should be signed first", {})
    }
    let socket: zmq.Request;
    try {
        socket = await init();
    } catch (err) {
        return MsgReply.fail("Failed to init connection with SDS Gateway: "+ err.toString(), {});
    }

    try {
       await socket.send(msg.toString());
    } catch (err) {
        return MsgReply.fail("Failed to send message to SDS Gateway: "+ err.toString(), {});
    }

    var reply: MsgReply

    try {
        const [resultBuffer] = await socket.receive()
        reply = MsgReply.fromBuffer(resultBuffer);
    } catch (err) {
        reply = MsgReply.fail("Failed to receive message from SDS Gateway: "+ err.toString(), {});
    }

    socket.close()

    return reply
}