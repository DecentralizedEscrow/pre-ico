
const time = require("./time_travel.js");
const DEST = artifacts.require("./DEST.sol");


contract("DEST failure", () => {

  let ico;

  it("should be able to create ICO", async () => {
    ico = await DEST.new();
    assert.isOk(ico && ico.address, "has invalid address");
  });

  it("should start ICO in time", async () => {
    const startTime = await ico.START_TIMESTAMP.call();
    await time.travelTo(startTime);
    assert.isOk(await ico.hasStarted.call(), "ICO has started");
  });

  it("should accept ether", async () => {
    const addr = web3.eth.accounts[0];
    await web3.eth.sendTransaction(
      { to: ico.address
      , from: addr
      , value: web3.toWei(10, 'ether')
      , gas: 111 * 1000
      });
    const balance = await ico.balanceOf.call(addr);
    const destBalance = web3.fromWei(balance, 'ether').toFixed();
    assert.equal(10800, destBalance, "balance is updated");
  });

  it("should finish ICO after deadline", async () => {
    const endTime = await ico.END_TIMESTAMP.call();
    await time.travelTo(endTime);
    assert.isOk(await ico.hasFinished.call(), "ICO has finished");
  });

  it("should be possible to get your money back", async () => {
    const addr = web3.eth.accounts[0];
    const ethBalance = await web3.eth.getBalance(addr);
    await ico.refund({from: addr});
    const updatedEthBalance = await web3.eth.getBalance(addr);
    const refund = web3.fromWei(updatedEthBalance.sub(ethBalance), 'ether').toFixed();
    assert.isOk(refund > 10 - 0.1, "got refund " + refund);
    const destBalance = (await ico.balanceOf.call(addr)).toFixed();
    assert.equal(0, destBalance, "DEST balance is zero");
  });
})
