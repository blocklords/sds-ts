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


    /** Returns a curve keypair that's used for the backend developers.
     * @param private_key is the smartcontract developer's account key
     */
    generate_key = async function(private_key: string): Promise<MsgReply> {
        let developer = new ethers.Wallet(private_key);

        let message = new MsgRequest('generate_key', {});
        message = await message.sign(developer);

        var gateway_reply = await this.request(message);
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
