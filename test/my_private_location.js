const MyPrivateLocation = artifacts.require("MyPrivateLocation");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MyPrivateLocation", function (/* accounts */) {
  it("should assert true", async function () {
    await MyPrivateLocation.deployed();
    return assert.isTrue(true);
  });
});
