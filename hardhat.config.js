/** @type import('hardhat/config').HardhatUserConfig */



require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer")
require("dotenv").config()

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      gasUsage: false,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      chainId: 4,
      blockConfirmations: 6,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey:{
      rinkeby: ETHERSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    }
  },
  mocha: {
    timeout:500000,//200 seconds
  }
};
