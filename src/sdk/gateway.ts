import * as zmq from "zeromq";
import { Request as MsgRequest } from "./message/request";
import { Reply as MsgReply } from "./message/reply";

let init = async () : Promise<zmq.Request> => {
    let socket = new zmq.Request();

    let host = process.env.SDS_GATEWAY_HOST!

    await socket.connect(`tcp://` + host)

    return socket
}

export let request = async function(msg: MsgRequest): Promise<MsgReply> {
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

    try {
        const [resultBuffer] = await socket.receive()
        return MsgReply.fromBuffer(resultBuffer);
    } catch (err) {
        return MsgReply.fail("Failed to receive message from SDS Gateway: "+ err.toString(), {});
    }
}