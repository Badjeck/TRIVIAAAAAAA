import {expect, assert} from 'chai';
import {describe, it} from 'mocha';
import {GameRunner} from '../src/game-runner';
import {Game} from "../src/game";
import {ConsoleSpy} from "../src/Utils/ConsoleSpy";
import {NotEnoughPlayerError} from "../src/errors/NotEnoughPlayerError";

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

        game.add('Pet')
        game.add('Ed')

        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.include('Techno');
    })

    it("should ask rock questions if techno questions are not enabled", () => {
        const console = new ConsoleSpy();
        const game = new Game(console);

        game.add('Pet')
        game.add('Ed')

        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.include('Rock');
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
});
