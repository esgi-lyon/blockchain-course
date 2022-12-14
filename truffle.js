
var HDWalletProvider = require("truffle-hdwallet-provider");
const { mnemonic, token, etherscan } = require("./.env.json")
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      websockets: true
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://goerli.infura.io/v3/${token}`
        );
      },
      network_id: 5,
      gas: 4465030,
      gasPrice: 10000000000
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
