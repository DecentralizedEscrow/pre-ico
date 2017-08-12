
const DEST = artifacts.require("./DEST.sol");

contract("DEST", () => {

  let ico;

  it("should be able to create ICO", () =>
    DEST.new().then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
    })
  );

  const prices = [
    {v: 0.1, p: 1000},
    {v: 1.0, p: 1005},
    {v: 1.1, p: 1005},
    {v: 2.0, p: 1010},
    {v: 2.1, p: 1010},
    {v: 3.0, p: 1015},
    {v: 3.1, p: 1015},
    {v: 4.0, p: 1020},
    {v: 4.1, p: 1020},
    {v: 5.0, p: 1030},
    {v: 5.1, p: 1030},
    {v: 6.1, p: 1030},
    {v: 7.0, p: 1040},
    {v: 7.1, p: 1040},
    {v: 8.1, p: 1040},
    {v: 9.0, p: 1050},
    {v: 9.1, p: 1050},
    {v: 10.0, p: 1080},
    {v: 10.1, p: 1080},
    {v: 12.1, p: 1080},
    {v: 14.0, p: 1110},
    {v: 14.1, p: 1110},
    {v: 18.1, p: 1110},
    {v: 20.0, p: 1150},
    {v: 20.1, p: 1150},
    {v: 50.1, p: 1150},
    {v: 100.0, p: 1200},
    {v: 100.1, p: 1200},
    {v: 200.1, p: 1200}
  ];

  prices.forEach(x =>
    it("price for " + x.v + " ETH", () =>
      ico.price.call(
        web3.toWei(x.v, 'ether')
      ).then(res => assert.equal(x.p, res.toFixed()))
    )
  );
})
