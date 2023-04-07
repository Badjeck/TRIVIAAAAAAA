import {IConsole} from "./Utils/IConsole";
import {PlayerPool} from "./playerPool";
import {Questions} from "./questions";
import {NotEnoughPlayerError} from "./errors/NotEnoughPlayerError";
import {TooManyPlayerError} from "./errors/TooManyPlayerError";

export class Game {

    private questions: Questions;
    private playerPool: PlayerPool;
    private console: IConsole;

    constructor(console : IConsole) {
        this.console = console;
        this.questions = new Questions(50);
        this.playerPool = new PlayerPool();
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
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return !(this.playerPool.getCurrentPlayerPurses() == 6)
    }

    public wrongAnswer(): boolean {
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
              this.playerPool.addCoinToCurrentPlayerCurses();

              var winner = this.didPlayerWin();
              this.playerPool.changeCurrentPlayer()
      
              return winner;
            } else {
              this.playerPool.changeCurrentPlayer()
              return true;
            }
      
      
          } else {
      
            this.console.log("Answer was corrent!!!!");
      
            this.playerPool.addCoinToCurrentPlayerCurses()
      
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
}
