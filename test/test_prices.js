const DEST = artifacts.require("./DEST.sol");


contract("DEST prices", () => {

  let ico;

  it("should be able to create ICO", async () => {
    ico = await DEST.new();
    assert.isOk(ico && ico.address, "has valid address");
  });

  const prices = [
    {m: 0,   M: 1,       p: 1000},
    {m: 1,   M: 2,       p: 1005},
    {m: 2,   M: 3,       p: 1010},
    {m: 3,   M: 4,       p: 1015},
    {m: 4,   M: 5,       p: 1020},
    {m: 5,   M: 7,       p: 1030},
    {m: 7,   M: 9,       p: 1040},
    {m: 9,   M: 10,      p: 1050},
    {m: 10,  M: 14,      p: 1080},
    {m: 14,  M: 20,      p: 1110},
    {m: 20,  M: 100,     p: 1150},
    {m: 100, M: 1000000, p: 1200},
  ];

  const chkPrice = (v, p) =>
    it("price for " + v + " ETH", async () => {
      const res = await ico.price.call(web3.toWei(v, 'ether'));
      assert.equal(p, res.toFixed());
    });

  for(const x of prices) {
    chkPrice(x.m, x.p);
    const v = Math.random() * (x.M - x.m) + x.m;
    chkPrice(v, x.p);
  }
})

