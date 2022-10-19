export class Reply {
    status: string;
    message: string;
    params: any;
    
    constructor(status: string, message: string, params: any) {
        this.status = status,
        this.message = message;
        this.params = params;
    }

    is_ok() : boolean {
        return this.status == Reply.OK;
    }

    toJSON() : any {
        return {
            status: this.status,
            message: this.message,
            params: this.params
        }
    }

    toString() : string {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    static fail(message, params) {
        if (params == undefined) {
            params = {};
        }
        return new Reply(Reply.FAIL, message, params);
    }

    static ok(params: any) {
        if (params == undefined) {
            params = {};
        }
        return new Reply(Reply.OK, '', params);
    }

    static fromBuffer(buffer: any) {
        let raw = buffer.toString();
        let obj = JSON.parse(raw);
        return new Reply(obj.status, obj.message, obj.params);
    }

    static FAIL = 'fail';
    static OK = 'OK';
}

