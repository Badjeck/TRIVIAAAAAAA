import {IConsole} from "./Utils/IConsole";
import {Questions} from "./questions";
import {NotEnoughPlayerError} from "./errors/NotEnoughPlayerError";
import {TooManyPlayerError} from "./errors/TooManyPlayerError";
import {PlayerPool} from "./playerPool";

export class Game {

    private questions: Questions;
    private readonly playerPool: PlayerPool;
    private console: IConsole;
    private goldRequiredToWin: number;
    private currentCategory = "";
    private numberOfPlayerToWin = 3;
    private leaderboard : Array<string> = new Array();

    constructor(console : IConsole, isTechnoEnabled = false, goldRequiredToWin = 6) {
        this.console = console;
        this.questions = new Questions(50, console, isTechnoEnabled);
        this.playerPool = new PlayerPool(console);
        this.setGoldRequiredToWin(goldRequiredToWin)
        this.currentCategory = this.newCurrentCategory()
    }

    public addPlayer(name: string): boolean {
        this.playerPool.usedJoker[this.playerPool.howManyPlayers()] = false;
        return this.playerPool.addPlayer(name)
    }

    /**
     * Use before playing
     */
    public initGame()
    {
        this.defineNumberOfPlayerToWin();
    }

    public roll(roll: number) {
        this.checkGameHadGoodPlayersNumber();
        this.console.log(this.playerPool.getCurrentPlayerName() + " is the current player");
        this.console.log("They have rolled a " + roll);

        if (this.playerPool.isCurrentPlayerIsInPenaltyBox()) {
            if (roll % 2 != 0) {
                this.playerPool.isGettingOutOfPenaltyBox = true;
                this.playerPool.setCurrentPlayerInPenaltyBox(false)

                this.console.log(this.playerPool.getCurrentPlayerName() + " is getting out of the penalty box");
                this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() + roll );
                if (this.playerPool.getCurrentPlayerPlaces() > 11) {
                    this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() - 12) ;
                }

                this.console.log(this.playerPool.getCurrentPlayerName() + "'s new location is " + this.playerPool.getCurrentPlayerPlaces());
                this.console.log("The category is " + this.currentCategory);
                this.questions.askQuestion(this.currentCategory);
            } else {
                this.console.log(this.playerPool.getCurrentPlayerName() + " is not getting out of the penalty box");
                this.playerPool.isGettingOutOfPenaltyBox = false;
            }
        } else {

            this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() + roll);
            if (this.playerPool.getCurrentPlayerPlaces() > 11) {
                this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() - 12);
            }

            this.console.log(this.playerPool.getCurrentPlayerName() + "'s new location is " + this.playerPool.getCurrentPlayerPlaces());
            this.console.log("The category is " + this.currentCategory);

            this.questions.askQuestion(this.currentCategory);
        }
    }

    public newCurrentCategory(forcedCategory: string = ""): string {
        if(forcedCategory !== "") {
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
        this.console.log('Question was incorrectly answered');
        this.console.log(this.playerPool.getCurrentPlayerName() + " was sent to the penalty box");
        this.playerPool.setCurrentPlayerInPenaltyBox(true);

        this.playerPool.changeCurrentPlayer();
        this.currentCategory = this.newCurrentCategory(nextCategory);

        return true;
    }

    public wasCorrectlyAnswered() {
        if (this.playerPool.isCurrentPlayerIsInPenaltyBox()) {
            if (this.playerPool.isGettingOutOfPenaltyBox) {
                this.console.log('Answer was correct!!!!');
                this.playerPool.currentPlayerAnswerRight(true);
                this.addPlayerToLeaderboardIfWin()
                this.playerPool.changeCurrentPlayer()

            } else {
                this.playerPool.changeCurrentPlayer()
            }


        } else {

            this.console.log("Answer was correct!!!!");
            this.playerPool.currentPlayerAnswerRight(true);

            this.addPlayerToLeaderboardIfWin()
            this.playerPool.changeCurrentPlayer()

        }
    }



    public makeThePlayerQuit(): void {
        this.console.log(`${this.playerPool.getCurrentPlayerName()} leaves the game`)
        this.playerPool.removeCurrentPlayer()
    }

    public currentPlayerTryUseJoker(){
        this.playerPool.currentPlayerUseJoker();
    }

    public getInPenaltyBox(): boolean[]
    {
        return this.playerPool.inPenaltyBox
    }

    public getIsGettingOutOfPenaltyBox(): boolean
    {
        return this.playerPool.isGettingOutOfPenaltyBox
    }

    public getPlayerPool() : PlayerPool {
        return this.playerPool
    }

    public getCurrentCategory() : String {
        return this.currentCategory
    }

    public getNumberOfPlayerNeededToWin(): number {
        return this.numberOfPlayerToWin;
    }

    public getLeaderboardSize():number {return this.leaderboard.length;}

    private isGameFinish():boolean
    {
        return this.leaderboard.length >= this.numberOfPlayerToWin;
    }

    private defineNumberOfPlayerToWin() {
        if(this.playerPool.players.length <=3 )
            this.numberOfPlayerToWin = this.playerPool.players.length-1
    }

    private setGoldRequiredToWin(gold) {
        if(gold >= 6) {
            this.goldRequiredToWin = gold;
        } else {
            this.goldRequiredToWin = 6;
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
        this.console.log("The game is now over ! Now the rank of the top player");
        this.leaderboard.forEach((playerName, index) => {
            this.console.log(`The player n°${index+1} is ${playerName} !`);
        });
        this.console.log("The following player(s) could not win in time !");
        this.playerPool.players.filter(playerName => -1 === this.leaderboard.indexOf(playerName)).forEach(playerName=>
            {
                this.console.log(`The player ${playerName} lose with ${this.playerPool.getPurseOfPlayer(playerName)} Gold coin(s) !`)
            })
    }

    private addPlayerToLeaderboardIfWin()
    {
        if(this.isPlayerHadEnoughCoinToWin())
        {
            this.leaderboard.push(this.playerPool.getCurrentPlayer());
            if(this.isGameFinish())
                this.endGame();
        }
    }

    private isPlayerHadEnoughCoinToWin(): boolean {
        return this.playerPool.getCurrentPlayerPurses() >= this.goldRequiredToWin
    }


}
