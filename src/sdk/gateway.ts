import { SmartcontractDeveloperRequest as MsgRequest } from "./message/smartcontract_developer_request";
import { Reply as MsgReply } from "./message/reply";
import { verify_env } from "../env";
import { RemoteRequest } from "./remote/request";
import * as Account from "./account";
import { ethers } from "ethers"

/**
 * The class to interact with the remote Smartcontract Developer Gateway.
 */
export class Gateway extends RemoteRequest {

    // Init returns the Gateway connected socket.
    constructor() {
        verify_env();

        let url = process.env.SDS_GATEWAY_HOST as string;
        super(url);
    }

    /**
    * Send the message to the Gateway. Wait for the reply
    * @param msg The message to send to the remote SmartcontractDeveloper Gateway
    * @returns Reply from the Gateway
    */
    send = async function(msg: MsgRequest): Promise<MsgReply> {
        if (!msg.is_signed()) {
            return MsgReply.fail("the message be signed", {})
        }

        let reply = await this.request(msg);

        return reply
    }
}
