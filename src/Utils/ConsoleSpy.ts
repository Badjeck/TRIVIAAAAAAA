import {IConsole} from "./IConsole";

export class ConsoleSpy implements IConsole{
    public content: string = "";
    log(message: string) {
        this.content += message;
    }
}