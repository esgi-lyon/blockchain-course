// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyPrivateLocation is Context, Ownable {
    using Counters for Counters.Counter;

    uint8 constant decimalBase = 6;

    mapping(address => Coordinate) private _locations;

    mapping(address => address[]) private _allowances;

    mapping(uint256 => Invitation) private _invitations;

    Counters.Counter private _invitationsCounter;

    struct Coordinate {
        int256 lat;
        int256 long;
    }

    event LocationAdded(address inputAddress);

    enum InvitationState {
        Accepted,
        Declined
    }

    struct Invitation {
        address from;
        address to;
    }

    event CreatedInvitation(uint256 id, address to);

    event AnsweredInvitation(uint256 id, InvitationState state);

    /**
     * Add a location
     */
    function setLocation(int256 lat, int256 long) public {
        _locations[_msgSender()] = Coordinate(lat, long);
        emit LocationAdded(_msgSender());
    }

    /**
     * View a location
     */
    function getLocation(address _address)
        external
        view
        returns (Coordinate memory coordinate)
    {
        if (_msgSender() == _address) {
            return _locations[_address];
        }

        bool isAuthorized = false;

        for (uint256 i = 0; i < _allowances[_address].length; i++) {
            isAuthorized = _msgSender() == _allowances[_address][i];

            if (isAuthorized) {
                break;
            }
        }

        require(isAuthorized, "not authorized to consult location");

        coordinate = _locations[_address];
    }

    /**
     * Allow an user to view your location
     */
    function grant(address _to) public {
        _invitationsCounter.increment();
        _invitations[_invitationsCounter.current()] = Invitation(
            _msgSender(),
            _to
        );

        emit CreatedInvitation(_invitationsCounter.current(), _to);
    }

    /**
     * Accept an user invitation to view his location
     */
    function accept(uint256 _invitationId, bool acceptation) public {

        address _from = _invitations[_invitationId].from;
        address _to = _invitations[_invitationId].to;

        require(
            _invitationId <= _invitationsCounter.current(),
            "Invitation isn't available"
        );

        for (uint256 i = 0; i < _allowances[_from].length; i++) {
            require(
                _allowances[_from][i] != _msgSender(),
                "Already accepted invitation"
            );
        }

        require(
            _to == _msgSender(),
            "You're not granted to view this user location"
        );

        if (!acceptation) {
            emit AnsweredInvitation(_invitationId, InvitationState.Declined);
            return;
        }

        _allowances[_from].push(_msgSender());

        emit AnsweredInvitation(_invitationId, InvitationState.Accepted);
        delete _invitations[_invitationId];
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
    function decimals() public pure returns (uint8) {
        return decimalBase;
    }

    /**
     * Get the last created invitation
     */
    function lastInvitation() private view returns (uint256) {
        return _invitationsCounter.current();
    }

}
