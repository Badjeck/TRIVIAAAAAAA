import { IConsole } from "./Utils/IConsole";

export class Player {
    private _name : string;
    private _place = 0;
    private _purse = 0;
    private _isInPenaltyBox = false;
    private _isGettingOutOfPenaltyBox = false;
    private _numberOfTimeInPenaltyBox = 0;
    private _hasUsedJoker = false;
    private _extraGold = 0;

    private _console : IConsole;

    constructor(name : string, console:IConsole) {
        this._name = name;
        this._console = console;
    }

    get name() : string
    {
        return this._name;
    }

    get place() : number 
    {
        return this._place;
    }

    get purse() : number
    {
        return this._purse;
    }

    get isInPenaltyBox(): boolean 
    {
        return this._isInPenaltyBox;
    }

    get numberOfTimeInPenaltyBox(): number
    {
        return this._numberOfTimeInPenaltyBox;
    }

    get hasUsedJoker():boolean
    {
        return this._hasUsedJoker;
    }

    get extraGold(): number
    {
        return this._extraGold;
    }

    set isGettingOutOfPenaltyBox(bool: boolean)
    {
        this._isGettingOutOfPenaltyBox = bool;
    }

    addCoins()
    {
        const coinsGains = 1 + this.extraGold;
        this._purse += coinsGains;

        if(this._extraGold > 0)
            this._console.log(`${this.name} now has gain ${coinsGains} Gold Coin(s) with ${this.extraGold} bonus Gold Coin(s) with the win in a row, ${this.name} now has ${this.purse} Gold Coin(s).`)
        else
            this._console.log(`${this.name} now has gain ${coinsGains} Gold Coin(s) and now has ${this.purse} Gold Coin(s).`)

    }

    move(nbPlaceToMove:number)
    {
        this._place = (this._place + nbPlaceToMove) % 12;
    }

    goInPenaltyBox()
    {
        this._isInPenaltyBox = true;
        this._isGettingOutOfPenaltyBox = false;
        this._numberOfTimeInPenaltyBox++;
    }

    isPlayerCanPlay(): boolean
    {
        return this._isInPenaltyBox && this._isGettingOutOfPenaltyBox || !this.isInPenaltyBox ;
    }

    goOutPenaltyBox()
    {
        this._isInPenaltyBox = false;
        this._isGettingOutOfPenaltyBox = false;
    }

    useJoker()
    {
        this._hasUsedJoker = true;
    }

    addExtraGold(gold:number)
    {
        this._extraGold+=gold;
    }

    resetExtraGold()
    {
        this._extraGold = 0;
    }

    replay()
    {
        this._place = 0;
        this._purse = 0;
        this._isInPenaltyBox = false;
        this._isGettingOutOfPenaltyBox = false;
        this._numberOfTimeInPenaltyBox = 0;
        this._hasUsedJoker = false;
        this._extraGold = 0;
    }
}