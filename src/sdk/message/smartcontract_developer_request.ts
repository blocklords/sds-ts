import { ethers } from "ethers";
import { Request } from "./request";
var stringify = require('json-stable-stringify');

/**
 * The message that's send by Smartcontract Developer to the SeascapeSDS.
 * This message is derived from message.Request() with additional parameters:
 * - params
 */
export class SmartcontractDeveloperRequest extends Request {
    private address: string;
    private signature: string;
    private nonce_timestamp: number;
    
    constructor(address: string, command: string, params: any) {
        super(command, params);
        this.address = address;
        this.set_nonce();
    }

    /**
     * Whether the message included signature or not
     */
    public is_signed(): boolean {
        return this.signature.length > 0;
    }

    toJSON() : object {
        // Clone the parameters.
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

    // serialize the message
    // for signature generetion
    public digest(): string {
        let obj = this.toJSON()
        delete obj["parameters"]["_signature"];
        var message = stringify(obj);

        return message;
    }

    public set_signature(signature: string) {
        this.signature = signature;
    }

    async sign(developer: string, web3: any = undefined): Promise<SmartcontractDeveloperRequest> {
        this.address = developer;
        this.set_nonce();

        // stringify sorts the parameters in alphabet order.
        var message = stringify(this.toJSON())
        // for the signature we don't need the signature
        delete message.parameters._signature;
        let message_hash = web3.utils.keccak256(message);

        let signature = await web3.eth.sign(message_hash, developer);

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
            return new SmartcontractDeveloperRequest("", Request.NO_COMMAND, {});
        }

        if (!obj.command || !obj.params) {
            return new SmartcontractDeveloperRequest("", Request.NO_COMMAND, {});
        }
        
        var request = new SmartcontractDeveloperRequest(obj.address, obj.command, obj.params);
        request.nonce_timestamp = obj.nonce_timestamp;
        request.signature = obj.signature;

        return request
    }
}
