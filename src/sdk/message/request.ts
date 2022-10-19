export class Request {
    command: string;
    params; any;

    constructor(command: string, params: any) {
        this.command = command;
        this.params = params;
    }

    toJSON() : any {
        return {
            command: this.command,
            params: this.params
        }
    }

    toString() : string {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    static Close(params: any) {
        return new Request(Request.CLOSE, params);
    }

    static fromBuffer(buffer: any) {
        let raw = buffer.toString();
        let obj;
        try { 
            obj = JSON.parse(raw);
        } catch (error) {
            return new Request(Request.NO_COMMAND, {});
        }

        if (!obj.command || !obj.params) {
            return new Request(Request.NO_COMMAND, {});
        }
        return new Request(obj.command, obj.params);
    }

    static CLOSE = 'close';
    static NO_COMMAND = '';
}
