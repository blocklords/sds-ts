import { ethers } from "ethers";
import { Request } from "./request";
var stringify = require('json-stable-stringify');

export class SmartcontractDeveloperRequest extends Request {
    public address: string;
    private signature: string;
    private nonce_timestamp: number;
    
    constructor(command: string, params: any) {
        super(command, params);
    }

    toJSON() : any {
        return {
            address: this.address,
            signature: this.signature,
            nonce_timestamp: this.nonce_timestamp,
            command: this.command,
            parameters: this.params
        }
    }

    async sign(developer: ethers.Signer): Promise<SmartcontractDeveloperRequest> {
        this.address = await developer.getAddress();
        this.nonce_timestamp = Math.round(new Date().getTime() * 1000)

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
