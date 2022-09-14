// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.17;

import "openzeppelin-solidity/contracts/utils/Context.sol";

struct Coordinate {
    int256 lat;
    int256 long;
}

contract MyPrivateLocation is Context {

    uint constant decimalBase = 6;

    mapping(address => Coordinate) private _locations;

    mapping(address => address[]) private _allowances;

    event LocationAddedFor(address inputAddress);

    function setLocation(int256 lat, int256 long) public {
        Coordinate memory coords = Coordinate(
            lat,
            long
        );

        _locations[_msgSender()] = coords;
         emit LocationAddedFor(_msgSender());
    }

    function viewLocation(address _address) public view returns (int256 lat, int256 long) {
        bool isAuthorized = false;
        for (uint i = 0; i < _allowances[_address].length; i++) {
            isAuthorized = keccak256(abi.encodePacked(_allowances[_address][i])) 
                == keccak256(abi.encodePacked(_msgSender()));

            if (isAuthorized) break;
        }

        require(isAuthorized);

        return (_locations[_address].lat, _locations[_address].long);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * We are always using a power of 10 with 6 to view a location as integer
     * For coordinates 45.780446, 4.775158 contract equivalent is 45780446, 4775158
     * To displayed to a user you use the inverse calculation (`4.775158 / 10 ** 6`).
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {viewLocation} and {setLocation}.
     */
    function decimals() pure public returns (uint8) {
        return 6;
    }
}