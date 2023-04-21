import {IConsole} from "./Utils/IConsole";

export class PlayerPool {

    private _players: Array<string> = [];
    private _places: Array<number> = [];
    private _purses: Array<number> = [];
    private _inPenaltyBox: Array<boolean> = [];
    private _extraGold: Array<number> = [];
    private _usedJoker: Array<boolean> = [];
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

    get usedJoker(): Array<boolean> {
        return this._usedJoker;
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
        this._extraGold[this.howManyPlayers()] = 0;
        this.players.push(name);
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this.console.log(name + " was added");
        this.console.log("They are player number " + this.players.length);

        return true;
    }

    getCurrentPlayerName() {
        return this.players[this._currentPlayer];
    }

    public removeCurrentPlayer() {
        this.players.splice(this.currentPlayer, 1)
    }

    public isCurrentPlayerIsInPenaltyBox() {
        return this.inPenaltyBox[this.currentPlayer];
    }

    public getCurrentPlayerPlaces() {
        return this.places[this.currentPlayer]
    }

    public setCurrentPlayerPlaces(newPlace: number) {
        this.places[this.currentPlayer] = newPlace;
    }

    public getCurrentPlayerPurses() {
        return this.purses[this.currentPlayer];
    }

    public setCurrentPlayerInPenaltyBox(bool: boolean) {
        this.inPenaltyBox[this.currentPlayer] = bool;
    }

    public changeCurrentPlayer() {
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
    }

    public getCurrentPlayerExtraGold(): number
    {
        return this._extraGold[this._currentPlayer]
    }

    public currentPlayerAnswerRight(isCorrect : boolean)
    {
        if(isCorrect){
            this.addCoinToCurrentPlayerPurses();
            this._extraGold[this._currentPlayer]++;
        }
        else
            this._extraGold[this._currentPlayer] = 0;
    }

    public getPurseOfPlayer(playerName : string):number
    {
         const playerIndex = this._players.indexOf(playerName);
         if(playerIndex === -1)
            throw new Error("Player not found");
        return this.purses[playerIndex]
    }

    private addCoinToCurrentPlayerPurses() {
        const player : string= this.getCurrentPlayerName();
        const extraGold = this.getCurrentPlayerExtraGold()
        const coinsGains = 1 + extraGold;
        this.purses[this.currentPlayer] += coinsGains;
        const playerCurrentPurse = this.purses[this.currentPlayer]; 
        if(extraGold > 0)
            this.console.log(`${player} now has gain ${coinsGains} Gold Coin(s) with ${extraGold} bonus Gold Coin(s) with the win in a row, ${player} now has ${playerCurrentPurse} Gold Coin(s).`)
        else
            this.console.log(`${player} now has gain ${coinsGains} Gold Coin(s) and now has ${playerCurrentPurse} Gold Coin(s).`)

    }

    public currentPlayerUseJoker(): void {

        if (this.isCurrentPlayerUsedJoker()) {
            this.console.log(this.getCurrentPlayerName() + " already used a Joker.");
        } else {
            this.setCurrentPlayerUseJoker(true);
            this.console.log(this.getCurrentPlayerName() + " used a Joker.");
            this.changeCurrentPlayer();
        }
    }

    public replay() {
        this.players.forEach((player, index)=>{
            this._places[index] = 0;
            this._purses[index] = 0;
            this._inPenaltyBox[index] = false;
            this._extraGold[index] = 0;
            this._usedJoker[index] = false;
        });

        this._currentPlayer = 0;
    }

    private setCurrentPlayerUseJoker(used : boolean){
        this._usedJoker[this._currentPlayer] = used;
    }

    private isCurrentPlayerUsedJoker():boolean {
        return this._usedJoker[this._currentPlayer]
    }
}