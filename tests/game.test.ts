import {expect, assert} from 'chai';
import {describe, it} from 'mocha';
import {GameRunner} from '../src/game-runner';
import {Game} from "../src/game";
import {ConsoleSpy} from "../src/Utils/ConsoleSpy";
import {NotEnoughPlayerError} from "../src/errors/NotEnoughPlayerError";
import {Questions} from "../src/questions";

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

        expect(() => game.roll(5)).to.throw(Error)

        game.addPlayer('Ed')

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
        expect(() => game.roll(5)).not.to.throw(Error)

        game.addPlayer('Luffy')

        expect(() => game.roll(5)).to.throw(Error)
    })

    it("should ask techno questions if techno questions are enabled", () => {
        const console = new ConsoleSpy();
        const game = new Game(console, true);

        game.addPlayer('Pet')
        game.addPlayer('Ed')

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

        let notAWinner;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                notAWinner = game.wasCorrectlyAnswered();
            } catch (e) {
                console.log(e)
            }

        } while (notAWinner);

        expect(consoleSpy.content).to.include("8 Gold Coins");
        expect(consoleSpy.content).to.not.include("9 Gold Coins");
    });

    it('game should last until player reaches 6 gold if gold is set lower than 6', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy, false,2);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))

        let notAWinner;
        do {
            try {
                game.roll(Math.floor(Math.random() * 6) + 1);
                notAWinner = game.wasCorrectlyAnswered();
            } catch (e) {
                console.log(e)
            }

        } while (notAWinner);

        expect(consoleSpy.content).to.include("6 Gold Coins");
        expect(consoleSpy.content).to.not.include("7 Gold Coins");
    });

    it('player that answers wrongly to a question selects next category', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy);
        const players: string[] = ['Pet', 'Ed', 'Chat']

        players.forEach((player) => game.addPlayer(player))

        game.roll(4)
        game.wrongAnswer("Rock")
        game.roll(0)

        expect(game.getCurrentCategory()).to.equals("Rock")

        assert.include(game.getPlayerPool().players, players[0])
    });
});
