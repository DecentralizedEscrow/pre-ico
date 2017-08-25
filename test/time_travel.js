

module.exports = {
  travelTo: async tm => {
    const currentTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    await web3.currentProvider.send(
      { jsonrpc: "2.0"
      , method: "evm_increaseTime"
      , params: [tm - currentTime]
      , id: currentTime
      });
    await web3.currentProvider.send(
      { jsonrpc: "2.0"
      , method: "evm_mine"
      , params: []
      , id: tm
      });
  }
}
