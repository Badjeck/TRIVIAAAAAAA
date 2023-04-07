import {Game} from './game';
import {IConsole} from "./Utils/IConsole";

export class GameRunner {

    public static main(): void {
        const iConsole : IConsole;
        const game = new Game(iConsole);
        game.add("Chet");
        game.add("Pat");
        game.add("Sue");

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

  