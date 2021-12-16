// recovery.js - Retrieves ether lost by creator of Recovery contract in a deployed SimpleToken contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { simpleTokenAddr, simpleTokenAbi } = require("../contracts");

async function main() {
  // Get ethers signer and contract instances
  const provider = ethers.provider;
  const account = await ethers.getSigner();
  const simpleToken = new ethers.Contract(simpleTokenAddr, simpleTokenAbi, provider);
  const simpleTokenSigner = simpleToken.connect(account);

  let balance = await provider.getBalance(simpleToken.address);
  console.log("Current token contract balance:", balance);

  console.log("Recovering the funds...")
  let recoverTxn = await simpleTokenSigner.destroy(account.address);
  await recoverTxn.wait();

  balance = await provider.getBalance(simpleToken.address);
  console.log("Current token contract balance:", balance)

  console.log("Recovery completed.")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });