import { expect } from "chai";
import {describe, beforeEach, it} from 'mocha';
import { PlayerPool } from "../src/playerPool"

let playerPool: PlayerPool;

describe("playerPool Test", () => {

    beforeEach( () => {
        playerPool = new PlayerPool(console)
    })

    describe("out Value Test", () => {

        describe("addPlayer", () => {
            it("is player is added", () => {
                playerPool.addPlayer('john')
                playerPool.currentPlayer = 0;

                // expect(playerPool.getCurrentPlayerName()).to.be("john")
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
                    playerPool.addPlayer("")
                }

                expect(playerPool.howManyPlayers()).be.eq(9)
            })
        })


    })
})