import {expect, assert} from 'chai';
import {describe, it} from 'mocha';
import {GameRunner} from '../src/game-runner';
import {Game} from "../src/game";
import {ConsoleSpy} from "../src/Utils/ConsoleSpy";
import matchAll = require("string.prototype.matchall");
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

        game.addPlayer('Pet')
        game.addPlayer('Ed')

        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.includes('Techno');
        expect(console.content).not.to.includes('Rock');
    })

    it("should ask rock questions if techno questions are not enabled", () => {
        const console = new ConsoleSpy();
        const game = new Game(console);

        game.addPlayer('Pet')
        game.addPlayer('Ed')

        game.roll(3);
        game.wasCorrectlyAnswered();

        expect(console.content).to.includes('Rock');
        expect(console.content).not.to.includes('Techno');
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

        expect(consoleSpy.content.toString()).to.include("8 Gold Coins");
        expect(consoleSpy.content.toString()).to.not.include("9 Gold Coins");
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

        expect(consoleSpy.content.toString()).to.include("6 Gold Coins");
        expect(consoleSpy.content.toString()).to.not.include("7 Gold Coins");
    });

    it('question distribution should be proportional with category number of total question', () => {
        const consoleSpy = new ConsoleSpy();
        const game = new Game(consoleSpy, true);
        const players: string[] = ['Pet', 'Ed']

        players.forEach((player) => game.addPlayer(player))

        //Pop, Science, Sports, Rock, Techno
        let questionCategoryAnsweredPet: Array<number> = [0, 0, 0, 0]
        let questionCategoryAnsweredEd: Array<number> = [0, 0, 0, 0]

        const categoryPatterns = [
            new RegExp("^The category is Pop\\nRock Question [0-9]+$"),
            new RegExp("^The category is Science\\nRock Question [0-9]+$"),
            new RegExp("^The category is Sports\\nRock Question [0-9]+$"),
            new RegExp("^The category is Rock\\nRock Question [0-9]+$"),
            new RegExp("^The category is Techno\\nTechno Question [0-9]+$"),
        ];

        const categoryIndices = [0, 1, 2, 3]

        for (let i = 0; i < 100; i++) {
            game.roll(3);
            game.wasCorrectlyAnswered();
        }

        const matches = matchAll(consoleSpy.content, categoryPatterns);

        for (const match of matches) {
            const categoryIndex = categoryIndices[match.index - 1];
            questionCategoryAnsweredPet[categoryIndex]++;
            questionCategoryAnsweredEd[categoryIndex]++;
        }

        const allEqualPet = questionCategoryAnsweredPet.every((val, i, arr) => val === arr[0]);
        const allEqualEd = questionCategoryAnsweredEd.every((val, i, arr) => val === arr[0]);

        expect(allEqualPet).to.equals(true);
        expect(allEqualEd).to.equals(true);
    })
});
