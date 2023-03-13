import * as zmq from "zeromq";
import { SmartcontractDeveloperRequest as MsgRequest } from "./message/smartcontract_developer_request";
import { Reply as MsgReply } from "./message/reply";
import * as Account from "./account";
import { ethers } from "ethers"

// Init returns the Gateway connected socket.
let init = async () : Promise<zmq.Request> => {
    let socket = new zmq.Request({linger: 0 });

    let host = process.env.SDS_GATEWAY_HOST!
    if (typeof host !== "string") {
        throw "missing 'SDS_GATEWAY_HOST' environment variable";
    }
    if (host.length === 0) {
        throw "empty 'SDS_GATEWAY_HOST' environment variable"
    }

    try {
        socket.connect(host)
    } catch (error) {
        throw `error to connect to SDS Gateway. error message: ${error}`;
    }

    return socket
}

/// Returns a curve keypair that's used for the backend developers.
/// @param private_key is the smartcontract developer's account key
export let generate_key = async function(private_key: string): Promise<MsgReply> {
    let developer = new ethers.Wallet(private_key);

    let message = new MsgRequest('generate_key', {});
    message = await message.sign(developer);

    var gateway_reply = await request(message);
    if (!gateway_reply.is_ok()) {
        return gateway_reply;
    }

    var public_key = await Account.decrypt(developer, gateway_reply.parameters["public_key"]);
    var secret_key = await Account.decrypt(developer, gateway_reply.parameters["secret_key"]);

    gateway_reply.parameters["public_key"] = public_key.toString();
    gateway_reply.parameters["secret_key"] = secret_key.toString();

    return gateway_reply;
}

/**
 * Send the message to the Gateway.
 * @param msg The message to send to the remote SmartcontractDeveloper Gateway
 * @returns Reply from the Gateway
 */
export let request = async function(msg: MsgRequest): Promise<MsgReply> {
    if (!msg.is_signed()) {
        return MsgReply.fail("the message be signed", {})
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