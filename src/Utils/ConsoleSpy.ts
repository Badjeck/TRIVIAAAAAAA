import {IConsole} from "./IConsole";

export class ConsoleSpy implements IConsole{
    public content: string[] = [];
    log(message: string) {
        this.content.push(message);
    }

    public getCountedLog(): object
    {
        let countedLog = {};
        this.content.map((current)=> countedLog[current] ? countedLog[current]++ : countedLog[current] = 1  )
    
        return countedLog
    }
}