import {IConsole} from "../Utils/IConsole";

export class ConsoleSpy implements IConsole{
    public content: string = "";

    log(message: String) {
        this.content += message +"\n";
    }
}   