export class Request {
    command: string;
    parameters: object;

    constructor(command: string, parameters: any) {
        this.command = command;
        this.parameters = parameters;
    }

    toJSON() : any {
        return {
            "command": this.command,
            "parameters": this.parameters
        }
    }

    toString() : string {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    static Close(parameters: any) {
        return new Request(Request.CLOSE, parameters);
    }

    static fromBuffer(buffer: any) {
        let raw = buffer.toString();
        let obj;
        try { 
            obj = JSON.parse(raw);
        } catch (error) {
            return new Request(Request.NO_COMMAND, {});
        }

        if (!obj.command || !obj.parameters) {
            return new Request(Request.NO_COMMAND, {});
        }
        return new Request(obj.command, obj.parameters);
    }

    static CLOSE = 'close';
    static NO_COMMAND = '';
}
