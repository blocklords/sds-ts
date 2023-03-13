import { ethers } from "ethers";
import { Request } from "./request";
var stringify = require('json-stable-stringify');

/**
 * The message that's send by Smartcontract Developer to the SeascapeSDS.
 * This message is derived from message.Request() with additional parameters:
 * - params
 */
export class SmartcontractDeveloperRequest extends Request {
    public address: string;
    private signature: string;
    private nonce_timestamp: number;
    
    constructor(command: string, params: any) {
        super(command, params);
    }

    toJSON() : object {
        let parameters = { ...this.parameters};
        parameters['_address'] = this.address;
        parameters['_signature'] = this.signature;
        parameters['_nonce_timestamp'] = this.nonce_timestamp;

        let request = new Request(this.command, parameters);
        return request.toJSON();
    }

    protected set_nonce(): void {
        this.nonce_timestamp = Math.round(new Date().getTime() * 1000000)
    }

    async sign(developer: ethers.Signer|string, web3: any = undefined): Promise<SmartcontractDeveloperRequest> {
        if (developer instanceof ethers.Signer) {
            return this.ethers_sign(developer);
        }
        this.address = developer;
        this.set_nonce();

        // stringify sorts the parameters in alphabet order.
        var message = stringify(this.toJSON())
        // for the signature we don't need the signature
        delete message.signature;
        let message_hash = web3.utils.keccak256(message);

        let signature = await web3.eth.sign(message_hash, developer);

        this.signature = signature;
        return this;
    }

    async ethers_sign(developer: ethers.Signer): Promise<SmartcontractDeveloperRequest> {
        this.address = await developer.getAddress();
        this.set_nonce();

        // stringify sorts the parameters in alphabet order.
        var message = stringify(this.toJSON())
        // for the signature we don't need the signature
        delete message.signature;

        var message_hash = ethers.utils.arrayify(ethers.utils.id(message));
        var signature = await developer.signMessage(message_hash);

        this.signature = signature;
        return this;
    }

    toString() : string {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    static fromBuffer(buffer: any) {
        let raw = buffer.toString();
        let obj;
        try { 
            obj = JSON.parse(raw);
        } catch (error) {
            return new SmartcontractDeveloperRequest(Request.NO_COMMAND, {});
        }

        if (!obj.command || !obj.params) {
            return new SmartcontractDeveloperRequest(Request.NO_COMMAND, {});
        }
        
        var request = new SmartcontractDeveloperRequest(obj.command, obj.params);
        request.address = obj.address;
        request.nonce_timestamp = obj.nonce_timestamp;
        request.signature = obj.signature;

        return request
    }
}
