import {IConsole} from "./Utils/IConsole";
import {Questions} from "./questions";
import {NotEnoughPlayerError} from "./errors/NotEnoughPlayerError";
import {TooManyPlayerError} from "./errors/TooManyPlayerError";
import {PlayerPool} from "./playerPool";
import { readFileSync, writeFileSync } from "fs";

export class Game {
    private static savePath = "save/game.save.json";

    public static load() : Game{
        const tmpObj =  (JSON.parse(readFileSync(Game.savePath,"utf8"))) as Game;
        const newGame = new Game(tmpObj._console);
        newGame.questions = Questions.clone(tmpObj.questions);
        newGame.playerPool = PlayerPool.clone(tmpObj.playerPool);
        newGame.goldRequiredToWin = tmpObj.goldRequiredToWin;
        newGame.currentCategory = tmpObj.currentCategory;
        newGame.numberOfPlayerToWin = tmpObj.numberOfPlayerToWin;
        newGame._isCategoryForced = tmpObj._isCategoryForced;
        
        return newGame;
    }

    private questions: Questions;
    private playerPool: PlayerPool;
    private _console: IConsole;
    private goldRequiredToWin= 6;
    private currentCategory = "";
    private numberOfPlayerToWin = 3;
    private _isCategoryForced: boolean;

    constructor(console : IConsole, isTechnoEnabled = false, goldRequiredToWin?:number, numberOfQuestion = 50) {
        this._console = console;
        this.questions = new Questions(numberOfQuestion, console, isTechnoEnabled);
        this.playerPool = new PlayerPool(console);
        this.setGoldRequiredToWin(goldRequiredToWin)
    }

    get console() : IConsole { return this._console;}

    public addPlayer(name: string) {
         this.playerPool.addPlayer(name)
    }

    /**
     * Use before playing
     */
    public initGame()
    {
        this.checkGameHadGoodPlayersNumber();
        this.defineNumberOfPlayerToWin();
    }

    public roll(roll: number) {
        this._console.log(`${this.playerPool.getCurrentPlayerName()} is the current player`);
        this._console.log(`${this.playerPool.getCurrentPlayerName()} have rolled a ${roll}`);

        if (this.playerPool.isCurrentPlayerIsInPenaltyBox()) {
           this.tryToGoOutOfPenaltyBox(roll);
        } else {
            this.moveAndAskQuestion(roll);
        }
    }
    

    public newCurrentCategory(forcedCategory: string = ""): string {
        if(forcedCategory !== "") {
            this._isCategoryForced = true;
            return forcedCategory;
        } else {
            if (this.playerPool.getCurrentPlayerPlaces() == 0)
                return 'Pop';
            if (this.playerPool.getCurrentPlayerPlaces() == 4)
                return 'Pop';
            if (this.playerPool.getCurrentPlayerPlaces() == 8)
                return 'Pop';
            if (this.playerPool.getCurrentPlayerPlaces() == 1)
                return 'Science';
            if (this.playerPool.getCurrentPlayerPlaces() == 5)
                return 'Science';
            if (this.playerPool.getCurrentPlayerPlaces() == 9)
                return 'Science';
            if (this.playerPool.getCurrentPlayerPlaces() == 2)
                return 'Sports';
            if (this.playerPool.getCurrentPlayerPlaces() == 6)
                return 'Sports';
            if (this.playerPool.getCurrentPlayerPlaces() == 10)
                return 'Sports';
            if (this.questions.getIsTechnoQuestionsEnabled())
                return 'Techno';
            return 'Rock';
        }
    }

    public wrongAnswer(nextCategory: string = ""): boolean {
        this.playerPool.currentPlayerAnswerRight(false);
        this._console.log('Question was incorrectly answered');
        this._console.log(this.playerPool.getCurrentPlayerName() + " was sent to the penalty box");
        this.playerPool.sendCurrentPlayerToPenaltyBox();

        this.playerPool.changeCurrentPlayer();
        this.currentCategory = this.newCurrentCategory(nextCategory);

        return true;
    }

    public wasCorrectlyAnswered() {
        if(!this.playerPool.isCurrentPlayerCanPlay())
            this.playerPool.changeCurrentPlayer()
        else{
            if(this.playerPool.isCurrentPlayerIsInPenaltyBox())
                this.playerPool.currentPlayerGoOutOfPenaltyBox()
            this._console.log('Answer was correct!!!!');
            this.playerPool.currentPlayerAnswerRight(true);
            this.addPlayerToLeaderboardIfWin()
            this.playerPool.changeCurrentPlayer()
        }
        
    }

    public replay() {
        this._console.log("Game restarted !");
        this.questions.replay();
        this.playerPool.replay();
    }

    public makeThePlayerQuit(): void {
        this._console.log(`${this.playerPool.getCurrentPlayerName()} leaves the game`)
        this.playerPool.removeCurrentPlayer()
    }

    public currentPlayerTryUseJoker(){
        this.playerPool.currentPlayerUseJoker();
    }

    public getPlayerPool(): PlayerPool {
        return this.playerPool
    }

    public getCurrentCategory() : String {
        return this.currentCategory
    }

    public getNumberOfPlayerNeededToWin(): number {
        return this.numberOfPlayerToWin;
    }

    public getLeaderboardSize():number
    {
        return this.playerPool.getLeaderboardSize();
    }

    public save() {
        const saveFile  =  JSON.stringify(this);
        
        writeFileSync(Game.savePath,saveFile);
    }

    private moveAndAskQuestion(roll:number)
    {
        this.playerPool.moveCurrentPlayer(roll);

        if(!this._isCategoryForced)
        {
            this.currentCategory = this.newCurrentCategory();
            this._isCategoryForced = false
        }

        this._console.log(`${this.playerPool.getCurrentPlayerName()}'s new location is ${this.playerPool.getCurrentPlayerPlaces()}`);
        this._console.log("The category is " + this.currentCategory);
        this.questions.askQuestion(this.currentCategory);
    }

    private isGameFinished():boolean
    {
        return this.playerPool.getLeaderboardSize() >= this.numberOfPlayerToWin;
    }

    private defineNumberOfPlayerToWin() {
        if(this.playerPool.players.length <=3 )
            this.numberOfPlayerToWin = this.playerPool.players.length-1
    }

    private setGoldRequiredToWin(gold) {
        if (gold >= 6) {
            this.goldRequiredToWin = gold;
        } 
    }

    private checkGameHadGoodPlayersNumber() {
        if (this.playerPool.howManyPlayers() < 2) {
            throw new NotEnoughPlayerError();
        } else if(this.playerPool.howManyPlayers() > 6)
            throw new TooManyPlayerError();
    }

    private endGame()
    {
        this._console.log("The game is now over ! Now the rank of the top player");
        this.playerPool.leaderboard.forEach((player, index) => {
            this._console.log(`The player n°${index+1} is ${player.name} !`);
        });
        this._console.log("The following player(s) could not win in time !");
        this.playerPool.players.filter(player => -1 === this.playerPool.leaderboard.indexOf(player)).forEach(player=>
            {
                this._console.log(`The player ${player.name} lose with ${player.purse} Gold coin(s) !`)
            })
    }

    private addPlayerToLeaderboardIfWin()
    {
        if(this.isPlayerHadEnoughCoinToWin())
        {
            this.playerPool.addCurrentPlayerToLeaderboard();
            if(this.isGameFinished())
                this.endGame();
        }
    }

    private isPlayerHadEnoughCoinToWin(): boolean {
        return this.playerPool.getCurrentPlayerPurses() >= this.goldRequiredToWin
    }

    private tryToGoOutOfPenaltyBox(roll:number)
    {
        if (roll % 2 != 0) {
            if (this.gotLuckToGoOutOfPenaltyBox()) {
                this.playerPool.currentPlayerIsGettingOutOfPenaltyBox(true);
                this._console.log(this.playerPool.getCurrentPlayerName() + " is getting out of the penalty box");
                this.moveAndAskQuestion(roll);
            } else {
                this._console.log(this.playerPool.getCurrentPlayerName() + " is unlucky this time and stay in the penalty box");
            }           
        } else {
            this._console.log(this.playerPool.getCurrentPlayerName() + " is not getting out of the penalty box");
        }
    }

    private gotLuckToGoOutOfPenaltyBox(): boolean
    {
        const timesInPenaltyBox = this.playerPool.getCurrentPlayerTimesInPenaltyBox();
        const getOutProbability = 1 / timesInPenaltyBox;

        return Math.random() < getOutProbability;
    }

}
