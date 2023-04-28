import {IConsole} from "./Utils/IConsole";

export class Questions {

    public static clone(question:Questions) : Questions
    {
        const newQuestion = new Questions(1,question.console);
        newQuestion._popQuestions = question._popQuestions;
        newQuestion._scienceQuestions = question._scienceQuestions;
        newQuestion._sportsQuestions = question._sportsQuestions;
        newQuestion._rockQuestions = question._rockQuestions;
        newQuestion._technoQuestions = question._technoQuestions;
        newQuestion._isTechnoQuestionsEnabled = question._isTechnoQuestionsEnabled;
        newQuestion._numberOfQuestion = question. _numberOfQuestion;

        return newQuestion;
    }

    private console: IConsole;
    private _popQuestions: Array<String> = [];
    private _scienceQuestions: Array<String> = [];
    private _sportsQuestions: Array<String> = [];
    private _rockQuestions: Array<String> = [];
    private _technoQuestions: Array<String> = [];
    private _isTechnoQuestionsEnabled: boolean = false;
    private _numberOfQuestion : number;

    constructor(nbQuestions:number, console : IConsole, isTechnoQuestions = false) {
        this._isTechnoQuestionsEnabled = isTechnoQuestions;
        this._numberOfQuestion = nbQuestions;

        this.generateQuestion();

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

    public addTechnoQuestion(index: number){
        this._technoQuestions.push("Techno Question " + index)
    }

    public shiftTechnoQuestion() {
        return this._technoQuestions.shift();
    }

    public askQuestion(category: String): String {
        let questionToAsk: String = ''

        if (category == 'Pop') {
            questionToAsk = this.shiftPopQuestion()!
            this._popQuestions.push(questionToAsk)
        } else if (category == 'Science') {
            questionToAsk = this.shiftScienceQuestion()!
            this._scienceQuestions.push(questionToAsk)
        } else if (category == 'Sports') {
            questionToAsk = this.shiftSportsQuestion()!
            this._sportsQuestions.push(questionToAsk)
        } else if (category == 'Rock') {
            questionToAsk = this.shiftRockQuestion()!
            this._rockQuestions.push(questionToAsk)
        } else if (category == 'Techno') {
            questionToAsk = this.shiftTechnoQuestion()!
            this._technoQuestions.push(questionToAsk)
        }

        this.console.log(questionToAsk);

        return questionToAsk
    }

    public replay() {
     this._popQuestions = [];
     this._scienceQuestions = [];
     this._sportsQuestions = [];
     this._rockQuestions = [];
     this._technoQuestions = [];

     this.generateQuestion();
    }

    private generateQuestion()
    {
        for (let i = 0; i < this._numberOfQuestion; i++) {
            this.addPopQuestion(i)
            this.addScienceQuestion(i);
            this.addSportsQuestion(i);
            if (this._isTechnoQuestionsEnabled)
                this.addTechnoQuestion(i);
            else
                this.addRockQuestion(i);
        }
    }
}