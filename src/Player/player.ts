import { IConsole } from "../Utils/IConsole";

export class Player {

    // private _currentPlayer: number = 0;
    // private _isGettingOutOfPenaltyBox: boolean = false;

    private name : String;
    private place : Number;
    private purse : Number;
    private inPenaltyBox : Boolean;

    private console : IConsole;

    constructor(console : IConsole, name : String, place : number) {
        this.name = name;
        this.console = console;
        this.place = place;
        this.purse = 0;
        this.inPenaltyBox = false;
    }


}