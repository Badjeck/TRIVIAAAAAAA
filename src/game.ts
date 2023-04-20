import {IConsole} from "./Utils/IConsole";
import {Questions} from "./questions";
import {NotEnoughPlayerError} from "./errors/NotEnoughPlayerError";
import {TooManyPlayerError} from "./errors/TooManyPlayerError";
import {PlayerPool} from "./playerPool";

export class Game {
    private currentPlayer: number = 0;
    private questions: Questions;
    private readonly playerPool: PlayerPool;
    private console: IConsole;
    private goldRequiredToWin: number;

    constructor(console : IConsole, isTechnoEnabled = false, goldRequiredToWin = 6) {
        this.console = console;
        this.questions = new Questions(50, console, isTechnoEnabled);
        this.playerPool = new PlayerPool(console);
        this.setGoldRequiredToWin(goldRequiredToWin)
    }

    public addPlayer(name: string): boolean {
        return this.playerPool.addPlayer(name)
    }

    public roll(roll: number) {
        this.checkGameHadGoodPlayersNumber();
        this.console.log(this.playerPool.getCurrentPlayer() + " is the current player");
        this.console.log("They have rolled a " + roll);

        if (this.playerPool.isCurrentPlayerIsInPenaltyBox()) {
            if (roll % 2 != 0) {
                this.playerPool.isGettingOutOfPenaltyBox = true;
                this.playerPool.inPenaltyBox[this.currentPlayer] = false


                this.console.log(this.playerPool.getCurrentPlayer() + " is getting out of the penalty box");
                this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() + roll );
                if (this.playerPool.getCurrentPlayerPlaces() > 11) {
                    this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() - 12) ;
                }

                this.console.log(this.playerPool.getCurrentPlayer() + "'s new location is " + this.playerPool.getCurrentPlayerPlaces());
                this.console.log("The category is " + this.currentCategory());
                this.questions.askQuestion(this.currentCategory());
            } else {
                this.console.log(this.playerPool.getCurrentPlayer() + " is not getting out of the penalty box");
                this.playerPool.isGettingOutOfPenaltyBox = false;
            }
        } else {

            this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() + roll);
            if (this.playerPool.getCurrentPlayerPlaces() > 11) {
                this.playerPool.setCurrentPlayerPlaces(this.playerPool.getCurrentPlayerPlaces() - 12);
            }

            this.console.log(this.playerPool.getCurrentPlayer() + "'s new location is " + this.playerPool.getCurrentPlayerPlaces());
            this.console.log("The category is " + this.currentCategory());
            this.questions.askQuestion(this.currentCategory());
        }
    }

    private currentCategory(): string {
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

    private didPlayerWin(): boolean {
        return !(this.playerPool.getCurrentPlayerPurses() >= this.goldRequiredToWin)
    }

    public wrongAnswer(): boolean {
        this.playerPool.currentPlayerAwnserRight(false);
        this.console.log('Question was incorrectly answered');
        this.console.log(this.playerPool.getCurrentPlayer() + " was sent to the penalty box");
        this.playerPool.setCurrentPlayerInPenaltyBox(true);
    
        this.playerPool.changeCurrentPlayer();

        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.playerPool.isCurrentPlayerIsInPenaltyBox()) {
            if (this.playerPool.isGettingOutOfPenaltyBox) {
                this.console.log('Answer was correct!!!!');
                this.playerPool.currentPlayerAwnserRight(true);

                var winner = this.didPlayerWin();
                this.playerPool.changeCurrentPlayer()

                return winner;
            } else {
                this.playerPool.changeCurrentPlayer()
                return true;
            }


        } else {

            this.console.log("Answer was correct!!!!");
            this.playerPool.currentPlayerAwnserRight(true);

            var winner = this.didPlayerWin();
            this.playerPool.changeCurrentPlayer()

            return winner;
        }
    }

    private checkGameHadGoodPlayersNumber() {
        if (this.playerPool.howManyPlayers() < 2) {
            throw new NotEnoughPlayerError();
        } else if(this.playerPool.howManyPlayers() > 6)
            throw new TooManyPlayerError();
    }

    public makeThePlayerQuit(): void {
        this.console.log(`${this.playerPool.getCurrentPlayer()} leaves the game`)
        this.playerPool.removeCurrentPlayer()
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

    private setGoldRequiredToWin(gold) {
        if(gold >= 6) {
            this.goldRequiredToWin = gold;
        } else {
            this.goldRequiredToWin = 6;
        }
    }
}
