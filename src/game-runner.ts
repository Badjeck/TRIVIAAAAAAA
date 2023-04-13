import {Game} from './game';

export class GameRunner {
    public static main(): void {
        const game = new Game(console, Math);
        game.addPlayer("Chet");
        game.addPlayer("Pat");
        game.addPlayer("Sue");

        let notAWinner;
        
        do {

            game.roll(Math.floor(Math.random() * 6) + 1);

            if (Math.floor(Math.random() * 10) == 7) {
            notAWinner = game.wrongAnswer();
            } else {
            notAWinner = game.wasCorrectlyAnswered();
            }

        } while (notAWinner);
    }
}

GameRunner.main();

  