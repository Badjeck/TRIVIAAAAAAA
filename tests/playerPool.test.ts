import { expect } from "chai";
import {describe, beforeEach, it} from 'mocha';
import { PlayerPool } from "../src/playerPool"
import { ConsoleSpy } from "../src/Utils/ConsoleSpy";

let playerPool: PlayerPool;
let console: ConsoleSpy;

describe("playerPool Test", () => {

    beforeEach( () => {
        console = new ConsoleSpy();
        playerPool = new PlayerPool(console);
    })

    describe("out Value Test", () => {

        describe("addPlayer", () => {
            it("is player is added", () => {
                playerPool.addPlayer('john');

                expect(playerPool.getCurrentPlayerName()).to.equals("john");
            });


            it("two players is added and the first is the current player", () => {
                playerPool.addPlayer('john');
                playerPool.addPlayer('billy');

                expect(playerPool.players.length).to.equals(2);
                expect(playerPool.getCurrentPlayerName()).to.equals("john");
            })
        })

        describe("count Player", () => {

            it("player count 0", () => {
                
                expect(playerPool.howManyPlayers()).be.eq(0)
            })

            it("player count 4", () => {

                playerPool.addPlayer("Sam1");
                playerPool.addPlayer("Sam2");
                playerPool.addPlayer("Sam3");
                playerPool.addPlayer("Sam4");

                expect(playerPool.howManyPlayers()).be.eq(4)
            })

            it("player count max", () => {

                for (let i = 1; i <= 9 ;i++) {
                    playerPool.addPlayer(`Player-${i}`)
                }

                expect(playerPool.howManyPlayers()).be.eq(9)
            })
        })


    })
})