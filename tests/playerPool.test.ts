import { assert, expect } from "chai";
import { Player } from "../src/Player/player"
import { IConsole } from "../src/Utils/IConsole"
import { PlayerPool } from "../src/playerPool"

let playerPool: PlayerPool;

describe("playerPool Test", () => {

    beforeEach( () => {
        playerPool = new PlayerPool(console)
    })

    describe("out Value Test", () => {

        describe("count Player", () => {

            it("player count 4", () => {
                playerPool.addPlayer("Sam1");
                playerPool.addPlayer("Sam2");
                playerPool.addPlayer("Sam3");
                playerPool.addPlayer("Sam4");

                expect(playerPool.howManyPlayers()).be.eq(4)
            })
        })
    })
})