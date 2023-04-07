import {IConsole} from "./Utils/IConsole";

export class Questions {
    private console: IConsole;
    private _popQuestions: Array<string> = [];
    private _scienceQuestions: Array<string> = [];
    private _sportsQuestions: Array<string> = [];
    private _rockQuestions: Array<string> = [];

    constructor(nbQuestions:number, console : IConsole) {
        for (let i = 0; i < nbQuestions; i++) {
            this.addPopQuestion(i)
            this.addScienceQuestion(i);
            this.addSportsQuestion(i);
            this.addRockQuestion(i);
        }

        this.console = console;
    }

    public addPopQuestion(index: number) {
        this._popQuestions.push("Pop Question " + index)
    }

    public shiftPopQuestion() {
        return this._popQuestions.shift()
    }

    public addScienceQuestion(index: number) {
        this._scienceQuestions.push("Science Question " + index)
    }

    public shiftScienceQuestion() {
        return this._scienceQuestions.shift()
    }

    public addSportsQuestion(index: number) {
        this._sportsQuestions.push("Sports Question " + index)
    }

    public shiftSportsQuestion() {
        return this._sportsQuestions.shift()
    }

    public addRockQuestion(index: number) {
        this._rockQuestions.push("Rock Question " + index)
    }

    public shiftRockQuestion() {
        return this._rockQuestions.shift()
    }

    public askQuestion(category: String): void {
        if (category == 'Pop')
            this.console.log(this.shiftPopQuestion());
        if (category == 'Science')
            this.console.log(this.shiftScienceQuestion());
        if (category == 'Sports')
            this.console.log(this.shiftSportsQuestion());
        if (category == 'Rock')
            this.console.log(this.shiftRockQuestion());
    }
}