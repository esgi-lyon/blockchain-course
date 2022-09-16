const MyPrivateLocation = artifacts.require("MyPrivateLocation");

const testExpectedData = {
  lat: "45.777144",
  long: "4.791939",
};

const testData = {
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

    // Grant step
    let invitationQueue = [];

    instance.CreatedInvitation({}, function (error, result) {
      assert.equal(error, null);
      invitationQueue.push(result.returnValues);
    });

    const grantUser1ToViewUser0 = await instance.grant(accounts[1], {
      from: accounts[0],
    });

    assert.isTrue(grantUser1ToViewUser0.tx != null);
    assert.equal(invitationQueue.length, 1);

    const lastInvitationEvent = invitationQueue.pop();

    assert.equal(lastInvitationEvent.id, 1);
    assert.equal(lastInvitationEvent.to, accounts[1]);

    // Accept step
    let answeredInvitationQueue = [];

    instance.AnsweredInvitation({}, function (error, result) {
      assert.equal(error, null);
      answeredInvitationQueue.push(result.returnValues);
    });

    const acceptUser0Grant = await instance.accept(
      lastInvitationEvent.id,
      true,
      { from: accounts[1] }
    );

    assert.isTrue(acceptUser0Grant.tx != null);

    const lastAnsweredInvitationQueue = answeredInvitationQueue.pop();
    assert.equal(lastAnsweredInvitationQueue.id, 1);
    assert.equal(lastAnsweredInvitationQueue.state, 0);

    // Set location
    let locationsQueue = [];

    instance.LocationAdded({}, function (error, result) {
      assert.equal(error, null);
      locationsQueue.push(result.returnValues);
    });

    const user0SetLocation = await instance.setLocation(
      testData.lat,
      testData.long
    );

    assert.isTrue(user0SetLocation.tx != null);

    const lastLocationEvent = locationsQueue.pop();

    assert.equal(lastLocationEvent.inputAddress, accounts[0]);

    // Get Location
    const user1GetUser0Location = await instance.getLocation(accounts[0], {
      from: accounts[1],
    });

    const decimals = 10 ** (await instance.decimals());

    assert.equal(user1GetUser0Location.lat / decimals, testExpectedData.lat);
    assert.equal(user1GetUser0Location.long / decimals, testExpectedData.long);
    return true
  });
});
