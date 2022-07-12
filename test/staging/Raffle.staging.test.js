// const { assert, expect } = require("chai")
// const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
// const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("Raffle", async () => {
//         let raffle, raffleEntranceFee, deployer

//         beforeEach(async () => {
//             deployer = (await getNamedAccounts()).deployer
//             await deployments.fixture(["all"])
//             raffle = await ethers.getContract("Raffle", deployer)
//             vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
//             raffleEntranceFee = await raffle.getEntranceFee()
//             interval = await raffle.getInterval()

//         })
//         describe("fulfillRandomWords", () => {
//             it("works with live chainlink keepers and chainlink vrf,we get a random winner", async () => {
//                 const startingTimeStamp = await raffle.getLatestTimeStamp()
//                 const accounts = await ethers.getSigners()
//                 await new Promise(async (resolve, reject) => {
//                     raffle.once("WinnerPicked", async () => {
//                         console.log("WinnerPicked event fired");
//                         resolve()
//                         try {
//                             const recentWinner = await raffle.getRecentWinner()
//                             const raffleState = await raffle.getRaffleState()
//                             const winnerEndingBalance = await accounts[0].getBalance()
//                             const endingTimeStamp = await raffle.getLatestTimeStamp()

//                             await expect(raffle.getPlayer(0)).to.be.reverted
//                             assert.equal(recentWinner.toString(), accounts[0].address)
//                             assert.equal(raffleState.toString(), "0")
//                             assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(raffleEntranceFee).toString())
//                             assert(endingTimeStamp > startingTimeStamp)
//                             resolve()

//                         } catch (e) {
//                             console.log(e);
//                             reject(e)
//                         }
//                     })

//                     await raffle.enterRaffle({ value: raffleEntranceFee })
//                     const winnerStartingBalance = await accounts[0].getBalance()
//                     //this wont complete until listener has finished listening
//                 })
//                 //setup listener before we enter raffle
//                 //just in case blockchain moves really fAST
//             })
//         })
//     }) 
const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
        let raffle, raffleEntranceFee, deployer

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            raffle = await ethers.getContract("Raffle", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
        })

        describe("fulfillRandomWords", function () {
            it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                // enter the raffle
                console.log("Setting up test...")
                const startingTimeStamp = await raffle.getLatestTimeStamp()
                const accounts = await ethers.getSigners()

                console.log("Setting up Listener...")
                await new Promise(async (resolve, reject) => {
                    // setup listener before we enter the raffle
                    // Just in case the blockchain moves REALLY fast
                    raffle.once("WinnerPicked", async () => {
                        console.log("WinnerPicked event fired!")
                        try {
                            // add our asserts here
                            const recentWinner = await raffle.getRecentWinner()
                            const raffleState = await raffle.getRaffleState()
                            const winnerEndingBalance = await accounts[0].getBalance()
                            const endingTimeStamp = await raffle.getLatestTimeStamp()

                            await expect(raffle.getPlayer(0)).to.be.reverted
                            assert.equal(recentWinner.toString(), accounts[0].address)
                            assert.equal(raffleState, 0)
                            assert.equal(
                                winnerEndingBalance.toString(),
                                winnerStartingBalance.add(raffleEntranceFee).toString()
                            )
                            assert(endingTimeStamp > startingTimeStamp)
                            resolve()
                        } catch (error) {
                            console.log(error)
                            reject(error)
                        }
                    })
                    // Then entering the raffle
                    console.log("Entering Raffle...")
                    const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                    await tx.wait(1)
                    console.log("Ok, time to wait...")
                    const winnerStartingBalance = await accounts[0].getBalance()

                    // and this code WONT complete until our listener has finished listening!
                })
            })
        })
    })