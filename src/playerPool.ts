import {IConsole} from "./Utils/IConsole";

export class PlayerPool {

    private _players: Array<string> = [];
    private _places: Array<number> = [];
    private _purses: Array<number> = [];
    private _inPenaltyBox: Array<boolean> = [];
    private _extraGold: Array<number> = [];
    private _currentPlayerIndex: number = 0;
    private _isGettingOutOfPenaltyBox: boolean = false;
    private console;

    constructor(console: IConsole) {
        this.console = console;
    }


    get players(): Array<string> {
        return this._players;
    }

    get places(): Array<number> {
        return this._places;
    }

    get purses(): Array<number> {
        return this._purses;
    }

    get inPenaltyBox(): Array<boolean> {
        return this._inPenaltyBox;
    }

    get currentPlayerIndex(): number {
        return this._currentPlayerIndex;
    }

    set currentPlayerIndex(value: number) {
        this._currentPlayerIndex = value;
    }

    get isGettingOutOfPenaltyBox(): boolean {
        return this._isGettingOutOfPenaltyBox;
    }

    set isGettingOutOfPenaltyBox(value: boolean) {
        this._isGettingOutOfPenaltyBox = value;
    }

    public howManyPlayers(): number {
        return this.players.length;
    }

    public addPlayer(name: string): boolean {
        this.places[this.howManyPlayers()] = 0;
        this.purses[this.howManyPlayers()] = 0;
        this._extraGold[this.howManyPlayers()] = 0;
        this.players.push(name);
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this.console.log(name + " was added");
        this.console.log("They are player number " + this.players.length);

        return true;
    }

    public getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    public removeCurrentPlayer() {
        this.players.splice(this.currentPlayerIndex, 1)
    }

    public isCurrentPlayerIsInPenaltyBox() {
        return this.inPenaltyBox[this.currentPlayerIndex];
    }

    public getCurrentPlayerPlaces() {
        return this.places[this.currentPlayerIndex]
    }

    public setCurrentPlayerPlaces(newPlace: number) {
        this.places[this.currentPlayerIndex] = newPlace;
    }

    public getCurrentPlayerPurses() {
        return this.purses[this.currentPlayerIndex];
    }

    public setCurrentPlayerInPenaltyBox(bool: boolean) {
        this.inPenaltyBox[this.currentPlayerIndex] = bool;
    }

    public changeCurrentPlayer() {
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex == this.players.length)
            this.currentPlayerIndex = 0;
    }

    public getCurrentPlayerExtraGold(): number
    {
        return this._extraGold[this._currentPlayerIndex]
    }

    public currentPlayerAnswerRight(isCorrect : boolean)
    {
        if(isCorrect){
            this.addCoinToCurrentPlayerPurses();
            this._extraGold[this._currentPlayerIndex]++;
        }
        else
            this._extraGold[this._currentPlayerIndex] = 0;
    }

    private addCoinToCurrentPlayerPurses() {
        const player : string= this.getCurrentPlayer();
        const extraGold = this.getCurrentPlayerExtraGold()
        const coinsGains = 1 + extraGold;
        this.purses[this.currentPlayerIndex] += coinsGains;
        const playerCurrentPurse = this.purses[this.currentPlayerIndex]; 
        if(extraGold > 0)
            this.console.log(`${player} now has gain ${coinsGains} Gold Coin(s) with ${extraGold} bonus Gold Coin(s) with the win in a row, ${player} now has ${playerCurrentPurse} Gold Coin(s).`)
        else
            this.console.log(`${player} now has gain ${coinsGains} Gold Coin(s) and now has ${playerCurrentPurse} Gold Coin(s).`)

    }
}