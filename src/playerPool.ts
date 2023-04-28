import { Player } from "./player";
import {IConsole} from "./Utils/IConsole";

export class PlayerPool {

    public static clone(playerPool:PlayerPool) : PlayerPool
    {
        const newPlayerPool = new PlayerPool(playerPool.console);
        const players: Array<Player> =[] 
        playerPool._players.forEach(element => {
            players.push(Player.clone(element));
        });
        newPlayerPool._players = playerPool._players;
        newPlayerPool._currentPlayer = playerPool._currentPlayer;
        newPlayerPool._leaderboard = playerPool._leaderboard;

        return newPlayerPool;
    }

    private _players : Array<Player> = [];
    private _currentPlayer : Player;
    private _leaderboard : Array<Player> = new Array();

    private console;

    constructor(console: IConsole) {
        this.console = console;
    }


    get players(): Array<Player> {
        return this._players;
    }

    get leaderboard():Array<Player> 
    {
        return this._leaderboard;
    }

    public getCurrentPlayerName() : string {
        return this._currentPlayer.name;
    }

    public removeCurrentPlayer() {
        this.players.splice(this.players.indexOf(this._currentPlayer), 1)
    }

    public isCurrentPlayerIsInPenaltyBox() {
        return this._currentPlayer.isInPenaltyBox;
    }

    public getCurrentPlayerPlaces() {
        return this._currentPlayer.place
    }

    public getCurrentPlayerPurses() {
        return this._currentPlayer.purse;
    }

    public getCurrentPlayerTimesInPenaltyBox(): number {
        return this._currentPlayer.numberOfTimeInPenaltyBox;
    }

    public howManyPlayers(): number {
        return this.players.length;
    }

    public sendCurrentPlayerToPenaltyBox()
    {
        this._currentPlayer.goInPenaltyBox();
    }

    public currentPlayerIsGettingOutOfPenaltyBox(bool: boolean)
    {
        this._currentPlayer.isGettingOutOfPenaltyBox = bool;
    }

    public isCurrentPlayerCanPlay():boolean
    {
        return this._currentPlayer.isPlayerCanPlay();
    }

    public currentPlayerGoOutOfPenaltyBox()
    {
        this._currentPlayer.goOutPenaltyBox();
    }

    public getLeaderboardSize():number {return this._leaderboard.length;}


    public moveCurrentPlayer(numberOfPlaceToMove: number) {
        this._currentPlayer.move(numberOfPlaceToMove);
    }

    public addPlayer(name: string) {
        this.players.push(new Player(name,this.console));
        if(this.players.length === 1)
            this._currentPlayer = this._players[0];

        this.console.log(name + " was added");
        this.console.log(`They are ${this.players.length} players`);

    }

    public changeCurrentPlayer() {
        const currentPlayerIndex = this.players.indexOf(this._currentPlayer);
        const nextPlayerIndex = (currentPlayerIndex + 1) % this._players.length;
        this._currentPlayer = this.players[nextPlayerIndex]
    }
  
    public currentPlayerAnswerRight(isCorrect : boolean)
    {
        if(isCorrect){
            this._currentPlayer.addCoins();
            this._currentPlayer.addExtraGold(1);
        }
        else
            this._currentPlayer.resetExtraGold();
    }

    public currentPlayerUseJoker(): void {

        if (this._currentPlayer.hasUsedJoker) {
            this.console.log(this.getCurrentPlayerName() + " already used a Joker.");
        } else {
            this._currentPlayer.useJoker();
            this.console.log(this.getCurrentPlayerName() + " used a Joker.");
            this.changeCurrentPlayer();
        }
    }

    public addCurrentPlayerToLeaderboard() {
        this._leaderboard.push(this._currentPlayer);
    }

    public replay() {
        this.players.forEach((player,)=>{
            player.replay();
        });

        this._currentPlayer = this._players[0];
        this._leaderboard = new Array();

    }

}