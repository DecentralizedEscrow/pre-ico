
pragma solidity ^0.4.12;

import "zeppelin-solidity/contracts/token/StandardToken.sol";


contract DEST  is StandardToken {

  // Constants
  // =========

  string public name = "Decentralized Escrow Token";
  string public symbol = "DEST";
  uint   public decimals = 18;

  uint constant ETH_MIN_LIMIT = 500 ether;
  uint constant ETH_MAX_LIMIT = 1500 ether;

  uint constant START_TIMESTAMP = 1503824400; // 2017-08-27 09:00:00 UTC
  uint constant END_TIMESTAMP   = 1506816000; // 2017-10-01 00:00:00 UTC

  address constant icoManager = 0xE7F7d6cBCdC1fE78F938Bfaca6eA49604cB58D33;
  address constant wallet     = 0x51559EfC1AcC15bcAfc7E0C2fB440848C136A46B;


  // State variables
  // ===============

  uint public ethCollected;
  mapping (address=>uint) public ethInvested;


  // Constant functions
  // =========================

  function hasStarted() public constant returns (bool) {
    return now >= START_TIMESTAMP;
  }


  function hasFinished() public constant returns (bool) {
    return now > END_TIMESTAMP || ethCollected >= ETH_MAX_LIMIT;
  }


  function price(uint v) public constant returns (uint) {
    return // poor man's binary search
      v < 7
        ? v < 3
          ? v < 1
            ? 1000
            : v < 2 ? 1005 : 1010
          : v < 4
            ? 1015
            : v < 5 ? 1020 : 1030
        : v < 14
          ? v < 10
            ? v < 9 ? 1040 : 1050
            : 1080
          : v < 100
            ? v < 20 ? 1110 : 1150
            : 1200;
  }


  // Public functions
  // =========================

  function() public payable {
    require(hasStarted() && !hasFinished());
    require(ethCollected + msg.value <= ETH_MAX_LIMIT);

    ethCollected += msg.value;
    ethInvested[msg.sender] += msg.value;

    uint tokenValue = msg.value * price(msg.value);
    balances[msg.sender] += tokenValue;
    totalSupply += tokenValue;
    Transfer(0x0, msg.sender, tokenValue);
  }


  // Investors can get refund if ETH_MIN_LIMIT is not reached.
  function refund() public {
    require(ethCollected < ETH_MIN_LIMIT && now > END_TIMESTAMP);
    require(balances[msg.sender] > 0);

    totalSupply -= balances[msg.sender];
    balances[msg.sender] = 0;
    uint ethRefund = ethInvested[msg.sender];
    ethInvested[msg.sender] = 0;
    msg.sender.transfer(ethRefund);
  }


  // Owner can withdraw all the money after min_limit is reached.
  function withdraw() public {
    require(ethCollected >= ETH_MIN_LIMIT);
    wallet.transfer(this.balance);
  }


  function dispose() public {
    require(msg.sender == icoManager);
    require(balances[icoManager] == totalSupply);
    // all refunds are finised or all tokens are migrated
  }
}

