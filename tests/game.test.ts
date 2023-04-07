import {expect} from 'chai';
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
