const time = require("./time_travel.js");
const DEST = artifacts.require("./DEST.sol");


contract("DEST success", () => {

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
    for(const addr of web3.eth.accounts) {
      await web3.eth.sendTransaction(
        { to: ico.address
        , from: addr
        , value: web3.toWei(70, 'ether')
        , gas: 111 * 1000
        });

      const balance = await ico.balanceOf.call(addr);
      const destBalance = web3.fromWei(balance, 'ether').toFixed();
      assert.equal(1150 * 70, destBalance, "balance is updated");
    }

    const ethBalance = web3.fromWei(await web3.eth.getBalance(ico.address), 'ether');
    assert.equal(70 * web3.eth.accounts.length, ethBalance.toFixed(), "ETH collected");
    const totalSupply = web3.fromWei(await ico.totalSupply.call(), 'ether').toFixed();
    assert.equal(70 * 1150 * web3.eth.accounts.length, totalSupply, "DEST total supply");
  });

  it("should be possible to withdraw ETH", async () => {
    const icoBalance = web3.fromWei(await web3.eth.getBalance(ico.address), 'ether');
    await ico.withdraw();
    const wallet = await ico.wallet.call();
    const walletBalance = web3.fromWei(await web3.eth.getBalance(wallet), 'ether');
    assert.isOk(walletBalance.toFixed() > 500, "wallet blance");
    assert.equal(icoBalance.toFixed(), walletBalance.toFixed(), "everything is withdrawed");
  });

  it("should finish ICO after deadline", async () => {
    const endTime = await ico.END_TIMESTAMP.call();
    await time.travelTo(endTime);
    assert.isOk(await ico.hasFinished.call(), "ICO has finished");
  });

  it("should be liquid after successfull finish", async () => {
    assert.isOk(await ico.tokensAreLiquid.call(), "tokens are liquid");
    const [a,b] = web3.eth.accounts;
    await ico.transfer(b, 100, {from: a});
    const balanceA = await ico.balanceOf.call(a);
    const balanceB = await ico.balanceOf.call(b);
    assert.equal(200, balanceB.sub(balanceA).toFixed(), "100 DEST transferred");
  });
})
