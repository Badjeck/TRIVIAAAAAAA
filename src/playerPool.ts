import {IConsole} from "./Utils/IConsole";

export class PlayerPool {

    private _players: Array<string> = [];
    private _places: Array<number> = [];
    private _purses: Array<number> = [];
    private _inPenaltyBox: Array<boolean> = [];
    private _currentPlayer: number = 0;
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

    get currentPlayer(): number {
        return this._currentPlayer;
    }

    set currentPlayer(value: number) {
        this._currentPlayer = value;
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
        this.players.push(name);
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this.console.log(name + " was added");
        this.console.log("They are player number " + this.players.length);

        return true;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayer];
    }

    removeCurrentPlayer() {
        this.players.splice(this.currentPlayer, 1)
    }

    isCurrentPlayerIsInPenaltyBox() {
        return this.inPenaltyBox[this.currentPlayer];
    }

    getCurrentPlayerPlaces() {
        return this.places[this.currentPlayer]
    }

    setCurrentPlayerPlaces(newPlace: number) {
        this.places[this.currentPlayer] = newPlace;
    }

    getCurrentPlayerPurses() {
        return this.purses[this.currentPlayer];
    }

    setCurrentPlayerInPenaltyBox(bool: boolean) {
        this.inPenaltyBox[this.currentPlayer] = bool;
    }

    changeCurrentPlayer() {
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
    }

    addCoinToCurrentPlayerCurses() {
        this.purses[this.currentPlayer] += 1;
        this.console.log(this.getCurrentPlayer() + " now has " +
            this.purses[this.currentPlayer] + " Gold Coins.");
    }
}