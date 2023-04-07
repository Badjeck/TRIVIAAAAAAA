import {IConsole} from "./Utils/IConsole";

export class Game {

    private players: Array<string> = [];
    private playersLocation: Array<number> = [];
    private playersPurse: Array<number> = [];
    private playerInPenaltyBox: Array<boolean> = [];
    private currentPlayerIndex: number = 0;
    private isGettingOutOfPenaltyBox: boolean = false;

    private popQuestions: Array<string> = [];
    private scienceQuestions: Array<string> = [];
    private sportsQuestions: Array<string> = [];
    private rockQuestions: Array<string> = [];

    private iConsole: IConsole;

    constructor(iConsole : IConsole) {

        this.iConsole = iConsole;

        for (let i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push(this.createRockQuestion(i));
        }
    }

    private createRockQuestion(index: number): string {
        return "Rock Question " + index;
    }

    public add(player: string): boolean {
        this.players.push(player);
        this.playersLocation[this.howManyPlayers()] = 0;
        this.playersPurse[this.howManyPlayers()] = 0;
        this.playerInPenaltyBox[this.howManyPlayers()] = false;

        console.log(player + " was added");
        console.log("They are player number " + this.players.length);

        return true;
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    public roll(roll: number) {
        console.log(this.players[this.currentPlayerIndex] + " is the current player");
        console.log("They have rolled a " + roll);
    
        if (this.playerInPenaltyBox[this.currentPlayerIndex]) {
          if (roll % 2 != 0) {
            this.isGettingOutOfPenaltyBox = true;
    
            console.log(this.players[this.currentPlayerIndex] + " is getting out of the penalty box");
            this.playersLocation[this.currentPlayerIndex] = this.playersLocation[this.currentPlayerIndex] + roll;
            if (this.playersLocation[this.currentPlayerIndex] > 11) {
              this.playersLocation[this.currentPlayerIndex] = this.playersLocation[this.currentPlayerIndex] - 12;
            }
    
            console.log(this.players[this.currentPlayerIndex] + "'s new location is " + this.playersLocation[this.currentPlayerIndex]);
            console.log("The category is " + this.currentCategory());
            this.askQuestion();
          } else {
            console.log(this.players[this.currentPlayerIndex] + " is not getting out of the penalty box");
            this.isGettingOutOfPenaltyBox = false;
          }
        } else {

            this.playersLocation[this.currentPlayerIndex] += roll;
          if (this.playersLocation[this.currentPlayerIndex] > 11) {
            this.playersLocation[this.currentPlayerIndex] = this.playersLocation[this.currentPlayerIndex] - 12;
          }
    
          console.log(this.players[this.currentPlayerIndex] + "'s new location is " + this.playersLocation[this.currentPlayerIndex]);
          console.log("The category is " + this.currentCategory());
          this.askQuestion();
        }
    }

    private askQuestion(): void {
        if (this.currentCategory() == 'Pop')
            console.log(this.popQuestions.shift());
        if (this.currentCategory() == 'Science')
            console.log(this.scienceQuestions.shift());
        if (this.currentCategory() == 'Sports')
            console.log(this.sportsQuestions.shift());
        if (this.currentCategory() == 'Rock')
            console.log(this.rockQuestions.shift());
    }

    private currentCategory(): string {
        if (this.playersLocation[this.currentPlayerIndex] == 0)
            return 'Pop';
        if (this.playersLocation[this.currentPlayerIndex] == 4)
            return 'Pop';
        if (this.playersLocation[this.currentPlayerIndex] == 8)
            return 'Pop';
        if (this.playersLocation[this.currentPlayerIndex] == 1)
            return 'Science';
        if (this.playersLocation[this.currentPlayerIndex] == 5)
            return 'Science';
        if (this.playersLocation[this.currentPlayerIndex] == 9)
            return 'Science';
        if (this.playersLocation[this.currentPlayerIndex] == 2)
            return 'Sports';
        if (this.playersLocation[this.currentPlayerIndex] == 6)
            return 'Sports';
        if (this.playersLocation[this.currentPlayerIndex] == 10)
            return 'Sports';
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return !(this.playersPurse[this.currentPlayerIndex] == 6)
    }

    public wrongAnswer(): boolean {
        console.log('Question was incorrectly answered');
        console.log(this.players[this.currentPlayerIndex] + " was sent to the penalty box");
        this.playerInPenaltyBox[this.currentPlayerIndex] = true;
    
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex == this.players.length)
            this.currentPlayerIndex = 0;
        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.playerInPenaltyBox[this.currentPlayerIndex]) {
            if (this.isGettingOutOfPenaltyBox) {
              console.log('Answer was correct!!!!');
              this.playersPurse[this.currentPlayerIndex] += 1;
              console.log(this.players[this.currentPlayerIndex] + " now has " +
              this.playersPurse[this.currentPlayerIndex] + " Gold Coins.");
      
              let winner : boolean = this.didPlayerWin();
              this.currentPlayerIndex += 1;
              if (this.currentPlayerIndex == this.players.length)
                this.currentPlayerIndex = 0;
      
              return winner;
            } else {
              this.currentPlayerIndex += 1;
              if (this.currentPlayerIndex == this.players.length)
                this.currentPlayerIndex = 0;
              return true;
            }
      
      
          } else {
      
            console.log("Answer was correct!!!!");
      
            this.playersPurse[this.currentPlayerIndex] += 1;
            console.log(this.players[this.currentPlayerIndex] + " now has " +
                this.playersPurse[this.currentPlayerIndex] + " Gold Coins.");

            let winner : boolean = this.didPlayerWin();

            this.currentPlayerIndex += 1;
            if (this.currentPlayerIndex == this.players.length)
                this.currentPlayerIndex = 0;
      
            return winner;
          }
    }
}
