const MyPrivateLocation = artifacts.require("MyPrivateLocation");

const testData = {
  lat: "45.777144",
  long: "4.791939",
};

const testExpectedData = {
  lat: "45777144",
  long: "4791939",
};

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MyPrivateLocation", function (accounts) {
  it("test deployed", async function () {
    const instance = await MyPrivateLocation.deployed();

    return assert.isTrue(instance != null);
  });

  it("grant location and react to event", async function () {
    const instance = await MyPrivateLocation.deployed();

    const event = instance.grant(accounts[1], { from: accounts[0] })
    console.info(event)
    event.watch(function(error, result){
      if (error) { return console.log(error) }
      if (!error) {
        // DO ALL YOUR WORK HERE!
        let { args: { from, to, value }, blockNumber } = result
        console.log(`----BlockNumber (${blockNumber})----`)
        console.log(`from = ${from}`)
        console.log(`to = ${to}`)
        console.log(`value = ${value}`)
        console.log(`----BlockNumber (${blockNumber})----`)
      }
    })

  });

  it("grant location", async function () {
    const instance = await MyPrivateLocation.deployed();

    return assert.isTrue(
      instance.grant(accounts[1], { from: accounts[0] }) !== null
    );
  });
});
