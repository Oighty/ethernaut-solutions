require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.2",
  paths: {
    artifacts: './artifacts',
    tests: './test',
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: process.env.RINKEBY_URL,
        blockNumber: 9826495,
      },
      accounts: [{privateKey: process.env.PRIVATE_KEY_1, balance: (100 * (10 ** 18)).toString()}],
    },
    rinkeby: {
      chainId: 4,
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY_1],
    }
  }
};
