import {expect, assert} from 'chai';
import {describe, it} from 'mocha';
import {GameRunner} from '../src/game-runner';
import {Game} from "../src/game";
import {ConsoleSpy} from "../src/Utils/ConsoleSpy";
import {Questions} from "../src/questions";
import { RandomFake as RandomFake } from '../src/Utils/RandomFake';

describe('The test environment', () => {
    it('should pass', () => {
        expect(true).to.be.true;
    });

    it("should access game", function () {
        expect(GameRunner).to.not.be.undefined;
    });

    it("should not have less than 2 players to play the game", () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);

        expect(() => game.roll(5)).to.throw(Error)

        game.addPlayer('Pet')
        game.initGame();

        expect(() => game.roll(5)).to.throw(Error)

        game.addPlayer('Ed')
        game.initGame();

        expect(() => game.roll(5)).not.to.throw(Error)
    })


    it("should not have more than 6 players to play the game", () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);

        game.addPlayer('Pet')
        game.addPlayer('Ed')
        game.addPlayer('Chat')
        game.addPlayer('Dog')
        game.addPlayer('Horse')
        game.addPlayer('Monkey')

        game.initGame();

        expect(() => game.roll(5)).not.to.throw(Error)

        game.addPlayer('Luffy')

        expect(() => game.roll(5)).to.throw(Error)
    });

    it('should a player use a joker card', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat'];

        players.forEach((player) => game.addPlayer(player));

        game.roll(4);
        game.currentPlayerTryUseJoker();

        expect(consoleSpy.content.join('')).to.include('Pet used a Joker');
    });

    it('2 different players should be able to use a joker card', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat'];

        players.forEach((player) => game.addPlayer(player));

        game.roll(4);
        game.currentPlayerTryUseJoker();

        expect(consoleSpy.content.join('')).to.include('Pet used a Joker');

        game.roll(4);
        game.currentPlayerTryUseJoker();

        expect(consoleSpy.content.join('')).to.include('Ed used a Joker');
    });

    it('should a player not use a joker card twice per game', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat'];

        players.forEach((player) => game.addPlayer(player));

        game.roll(4);
        game.currentPlayerTryUseJoker();

        game.roll(4);
        game.wasCorrectlyAnswered();
        game.roll(4);
        game.wasCorrectlyAnswered();

        game.roll(4);
        game.currentPlayerTryUseJoker();

        expect(consoleSpy.content.join('')).to.include('Pet already used a Joker');
    });


    it("should ask techno questions if techno questions are enabled", () => {
        const console = new ConsoleSpy();
        const game = new Game(console, true);

        game.addPlayer('Pet')
        game.addPlayer('Ed')
        game.initGame();


        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.includes('Techno Question 0');
        expect(console.content).not.to.includes('Rock Question 0');
    })

    it("should ask rock questions if techno questions are not enabled", () => {
        const console = new ConsoleSpy();
        const game = new Game(console);

        game.addPlayer('Pet')
        game.addPlayer('Ed')
        game.initGame();

        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.includes('Rock Question 0');
        expect(console.content).not.to.includes('Techno Question 0');
    })

    it('first player should leave a game', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        game.roll(4)

        game.makeThePlayerQuit()

        assert.notInclude(game.getPlayerPool().players, players[0])
        assert.include(game.getPlayerPool().players, players[1])
        assert.include(game.getPlayerPool().players, players[2])

        // @ts-ignore
        expect(consoleSpy.content).to.includes("Pet leaves the game")
    });

    it('second player should leave a game', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        game.roll(4)
        game.wasCorrectlyAnswered()
        game.roll(2)
        game.makeThePlayerQuit()

        assert.include(game.getPlayerPool().players, players[0])
        assert.notInclude(game.getPlayerPool().players, players[1])
        assert.include(game.getPlayerPool().players, players[2])

        // @ts-ignore
        expect(consoleSpy.content).to.includes("Ed leaves the game")
    });
    
    it('player should leave prison', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        game.roll(4)
        game.wrongAnswer()

        expect(game.getIsGettingOutOfPenaltyBox()).to.equals(false)
        expect(game.getInPenaltyBox()[0]).to.equals(true)
        expect(consoleSpy.content).to.includes("Pet was sent to the penalty box")
        expect(consoleSpy.content).not.to.includes("Pet is getting out of the penalty box")

        game.roll(4)
        game.wasCorrectlyAnswered()
        game.roll(5)

        expect(game.getIsGettingOutOfPenaltyBox()).to.equals(true)
        expect(game.getInPenaltyBox()[0]).to.equals(false)
        expect(consoleSpy.content).to.includes("Pet is getting out of the penalty box")
    });

    it('should have a infinite deck', function () {
        const consoleSpy = new ConsoleSpy();

        const questions = new Questions(1, consoleSpy)

        const firstQuestionAsked = questions.askQuestion('Pop')

        const secondQuestionAsked = questions.askQuestion('Pop')
        expect(firstQuestionAsked).to.equals(secondQuestionAsked)
    });

    it('game should run until player reach gold required to win', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy, false, 8);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);
        expect(consoleSpy.content).to.includes("Pet now has gain 4 Gold Coin(s) with 3 bonus Gold Coin(s) with the win in a row, Pet now has 10 Gold Coin(s).");

    });

    it('game should last until player reaches 6 gold if gold is set lower than 6', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy, false,2);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);

        expect(consoleSpy.content).to.includes("Pet now has gain 3 Gold Coin(s) with 2 bonus Gold Coin(s) with the win in a row, Pet now has 6 Gold Coin(s).");

    });

    it('player that answers wrongly to a question selects next category', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        game.roll(4)
        game.wrongAnswer("Rock")
        game.roll(0)

        expect(game.getCurrentCategory()).to.equals("Rock")

        assert.include(game.getPlayerPool().players, players[0])
    });

    it('When a player answer correctly in a row, should gain more coins',()=>{
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        game.roll(2);
        game.wasCorrectlyAnswered();

        game.roll(2);
        game.wrongAnswer();

        game.roll(2);
        game.wasCorrectlyAnswered();

        expect(consoleSpy.content).to.includes("Pet now has gain 1 Gold Coin(s) and now has 1 Gold Coin(s).");
        expect(consoleSpy.content).to.includes("Pet now has gain 2 Gold Coin(s) with 1 bonus Gold Coin(s) with the win in a row, Pet now has 3 Gold Coin(s).");

    });
    
    it("should not use joker if player has no joker", () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);

        game.addPlayer('Pet')
        game.addPlayer('Ed')

        game.roll(3);
        game.currentPlayerTryUseJoker();

        expect(consoleSpy.content).not.to.includes("has used their Joker");
    });

    it("With 4+ players;  a leaderboard is show; When 3 players win ,", ()=>{
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat','Dog']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);
        
        expect(consoleSpy.content[consoleSpy.content.length-6]).to.equals("The game is now over ! Now the rank of the top player");
        expect(consoleSpy.content[consoleSpy.content.length-5]).to.equals("The player n°1 is Pet !");
        expect(consoleSpy.content[consoleSpy.content.length-4]).to.equals("The player n°2 is Ed !");
        expect(consoleSpy.content[consoleSpy.content.length-3]).to.equals("The player n°3 is Chat !");
        expect(consoleSpy.content[consoleSpy.content.length-2]).to.equals("The following player(s) could not win in time !");
        expect(consoleSpy.content[consoleSpy.content.length-1]).to.equals("The player Dog lose with 3 Gold coin(s) !");  
    });

    it("With 3 players;  a leaderboard is show; When 2 players win ,", ()=>{
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);

        expect(consoleSpy.content[consoleSpy.content.length-5]).to.equals("The game is now over ! Now the rank of the top player");
        expect(consoleSpy.content[consoleSpy.content.length-4]).to.equals("The player n°1 is Pet !");
        expect(consoleSpy.content[consoleSpy.content.length-3]).to.equals("The player n°2 is Ed !");
        expect(consoleSpy.content[consoleSpy.content.length-2]).to.equals("The following player(s) could not win in time !");
        expect(consoleSpy.content[consoleSpy.content.length-1]).to.equals("The player Chat lose with 3 Gold coin(s) !");  
    });

    it("With 2 players;  a leaderboard is show; When 1 players win ,", ()=>{
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))
        game.initGame();

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);

        expect(consoleSpy.content[consoleSpy.content.length-4]).to.equals("The game is now over ! Now the rank of the top player");
        expect(consoleSpy.content[consoleSpy.content.length-3]).to.equals("The player n°1 is Pet !");
        expect(consoleSpy.content[consoleSpy.content.length-2]).to.equals("The following player(s) could not win in time !");
        expect(consoleSpy.content[consoleSpy.content.length-1]).to.equals("The player Ed lose with 3 Gold coin(s) !");  
    });


    it('When the replay is use, then the game should restart with the same parameters', () => {
        const consoleSpy = new ConsoleSpy();
        let game = new Game(consoleSpy, true, 8);
        const players: string[] = ['Pet', 'Ed']
        let randomFake = new RandomFake();

        players.forEach((player) => game.addPlayer(player))

        let numberOfPlayerNeededToWin = game.getNumberOfPlayerNeededToWin();
        let numberOfWinner = 0;
        do {
            try {
                game.roll(randomFake.rollADice6());
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);

        expect(consoleSpy.content).to.includes("Techno Question 0");
        expect(consoleSpy.content).to.includes("Pet now has gain 4 Gold Coin(s) with 3 bonus Gold Coin(s) with the win in a row, Pet now has 10 Gold Coin(s).");

        game.replay()
        numberOfWinner = 0
        do {
            try {
                game.roll(randomFake.rollADice6());
                game.wasCorrectlyAnswered();
                numberOfWinner = game.getLeaderboardSize();
            } catch (e) {
                console.log(e)
            }

        } while (numberOfWinner < numberOfPlayerNeededToWin);
        
        expect(consoleSpy.content).to.includes("Game restarted !");

        //Remove init log 
        consoleSpy.content.splice(0,4);

        const part1 = consoleSpy.content.slice(0,consoleSpy.content.indexOf("Game restarted !"));
        const part2 = consoleSpy.content.slice(consoleSpy.content.indexOf("Game restarted !")+1, consoleSpy.content.length);

        expect(part1).to.eql(part2)
        
    });
});
