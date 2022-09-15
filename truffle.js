
var HDWalletProvider = require("truffle-hdwallet-provider");
const { mnemonic, token, etherscan } = require("./.env.json")
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://eth-goerli.g.alchemy.com/v2/1QnveuDhwQJXZjqneNFO8JiI70Cz_U-g"
        );
      },
      network_id: 5,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${token}`)
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  compilers: {
    solc: {
      version: "^0.8.17",
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan
  }
};
