import {IConsole} from "./Utils/IConsole";

export class Questions {
    private console: IConsole;
    private _popQuestions: Array<string> = [];
    private _scienceQuestions: Array<string> = [];
    private _sportsQuestions: Array<string> = [];
    private _rockQuestions: Array<string> = [];
    private console: IConsole;
    private _technoQuestions: Array<string> = [];
    private _isTechnoQuestionsEnabled: boolean = false;

    constructor(nbQuestions:number, console : IConsole, isTechnoQuestions) {
        this._isTechnoQuestionsEnabled = isTechnoQuestions;

        for (let i = 0; i < nbQuestions; i++) {
            this.addPopQuestion(i)
            this.addScienceQuestion(i);
            this.addSportsQuestion(i);
            if (this._isTechnoQuestionsEnabled)
                this.addTechnoQuestion(i);
            else
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

    public getIsTechnoQuestionsEnabled(): boolean{
        return this._isTechnoQuestionsEnabled;
    }

    public setIsTechnoQuestionsEnabled(value: boolean): void {
        this._isTechnoQuestionsEnabled = value;
    }

    public addTechnoQuestion(index: number){
        this._technoQuestions.push("Techno Question " + index)
    }

    public shiftTechnoQuestion() {
        return this._technoQuestions.shift();
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
        if (category == 'Techno')
            this.console.log(this.shiftTechnoQuestion());
    }
}