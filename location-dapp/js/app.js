App = {
  contracts: {},
  lastGasPrice: 6721975,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // Initialize web3 and set the provider to the testRPC.
    if (!window.ethereum) {
      throw new Error("Probably not installed wallet");
    }

    if (typeof web3 !== "undefined") {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(function (_) {
          web3 = new Web3(window.ethereum);

          // Get the current MetaMask selected/active wallet
          var walletAddress = window.ethereum.selectedAddress;

          console.log("Wallet: " + walletAddress);
        })
        .catch(function (err) {
          console.error(err);
        });
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("MyPrivateLocation.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var MyPrivateLocationArtifact = data;
      App.contracts.MyPrivateLocation = TruffleContract(
        MyPrivateLocationArtifact
      );

      // Set the provider for our contract.
      App.contracts.MyPrivateLocation.setProvider(window.ethereum);

      return App.getLocation();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", "#refresh-button", async function (event) {
      event.data = { to: "me" };
      await App.getLocation(event);
    });
  },

  processLastGasPrice: function () {
    web3.eth.getBlock("latest", (_, b) => {
      App.lastGasPrice = b.gasLimit;
    });
  },

  getLocation: async function (event) {
    if (event) {
      event.preventDefault();
    } else {
      event = { data: { to: null } };
    }

    var requestedAddressLocation = event.data.to || $("#friend-address").val();

    if (!requestedAddressLocation) return;

    var account = window.ethereum.selectedAddress;

    let myPrivateLocationInstance =
      await App.contracts.MyPrivateLocation.deployed();

    requestedAddressLocation =
      requestedAddressLocation === "me" ? account : requestedAddressLocation;

    if (!account) {
      throw new Error("Unable to recover account");
    }

    App.processLastGasPrice();

    console.log("Getting location of " + requestedAddressLocation);

    return await myPrivateLocationInstance.getLocation(
      requestedAddressLocation,
      {
        from: account,
        gas:
          App.lastGasPrice *
          (await myPrivateLocationInstance.decimals.estimateGas()),
      }
    );
  },

  setLocation: async function () {
    console.log("Setting location...");

    var coordinates = {
      lat: "45.777144",
      long: "4.791939",
    };

    var requestedAddressLocation = $("#friend-address").val();

    if (!requestedAddressLocation) return;

    var account = window.ethereum.selectedAddress;

    let myPrivateLocationInstance =
      await App.contracts.MyPrivateLocation.deployed();

    requestedAddressLocation =
      requestedAddressLocation === "me" ? account : requestedAddressLocation;

    if (!account) {
      throw new Error("Unable to recover account");
    }

    App.processLastGasPrice();

    console.log("Getting location of " + requestedAddressLocation);

    return await myPrivateLocationInstance.setLocation(
      coordinates.lat,
      coordinates.long,
      {
        from: account,
        gas:
          App.lastGasPrice *
          (await myPrivateLocationInstance.decimals.estimateGas()),
      }
    );
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
