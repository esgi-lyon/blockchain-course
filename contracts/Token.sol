// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.17;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor() ERC20("UltraShitcoinDogeElonJupiter", "USSDEJ") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function name() public view virtual override returns (string memory) {
        return "UltraShitcoinDogeElonJupiter";
    }

    function symbol() public view virtual override returns (string memory) {
        return "USSDEJ";
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    uint public INITIAL_SUPPLY = 12000;


}