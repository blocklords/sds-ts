import * as zmq from "zeromq";
import { SmartcontractDeveloperRequest as MsgRequest } from "../message/smartcontract_developer_request";
import { Request } from "../message/request";
import { Reply as MsgReply } from "../message/reply";

// The synchronous remote request to the SeascapeSDS.
export class RemoteRequest {
    private socket: zmq.Socket;

    // Init returns the Gateway connected socket.
    constructor(url: string) {
        this.socket = new zmq.Request({linger: 0 });

        try {
            this.socket.connect(url)
        } catch (error) {
            throw `error to connect to ${url}. error message: ${error}`;
        }
    }

    /**
     * Send the message to the Gateway.
     * @param msg The message to send to the remote SmartcontractDeveloper Gateway
     * @returns Reply from the Gateway
     */
    protected request = async function(msg: MsgRequest|Request): Promise<MsgReply> {
        try {
            await this.socket.send(msg.toString());
        } catch (err) {
            return MsgReply.fail("Failed to send message to SDS Gateway: "+ err.toString(), {});
        }

        var reply: MsgReply

        try {
            const [resultBuffer] = await this.socket.receive()
            reply = MsgReply.fromBuffer(resultBuffer);
        } catch (err) {
            reply = MsgReply.fail("Failed to receive message from SDS Gateway: "+ err.toString(), {});
        }

        return reply
    }
}
