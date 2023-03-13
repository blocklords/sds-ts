export class Reply {
    status: string;
    message: string;
    parameters: object;
    
    constructor(status: string, message: string, parameters: any) {
        this.status = status,
        this.message = message;
        this.parameters = parameters;
    }

    is_ok() : boolean {
        return this.status == Reply.OK;
    }

    toJSON() : object {
        return {
            status: this.status,
            message: this.message,
            parameters: this.parameters
        }
    }

    toString() : string {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    static fail(message: string, parameters: undefined|object): Reply {
        if (parameters == undefined) {
            parameters = {};
        }
        return new Reply(Reply.FAIL, message, parameters);
    }

    static ok(parameters: undefined | object): Reply {
        if (parameters == undefined) {
            parameters = {};
        }
        return new Reply(Reply.OK, '', parameters);
    }

    static fromBuffer(buffer: Buffer): Reply {
        let raw = buffer.toString();
        let obj = JSON.parse(raw);
        return new Reply(obj.status, obj.message, obj.parameters);
    }

    static FAIL = 'fail';
    static OK = 'OK';
}

