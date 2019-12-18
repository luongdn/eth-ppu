pragma solidity ^0.5.0;

contract PaymentChannel {
    address payable public sender;
    address payable public recipient;
    uint256 public price;
    uint256 public start;
    uint256 public duration;
    uint256 public expiration;
    uint256 amount;

    constructor (address payable _recipient, uint256 _price, uint256 _duration)
        public
        payable
    {
        require(validAmount(_duration, _price, msg.value), "Invalid amount");
        sender = msg.sender;
        recipient = _recipient;
        price = _price;
        start = now;
        duration = _duration;
        expiration = now + _duration * 1 days;
        amount = msg.value;
    }

    modifier onlySender() {
        require(
            msg.sender == sender,
            "Only sender can call this."
        );
        _;
    }

    modifier onlyRecipient() {
        require(
            msg.sender == recipient,
            "Only recipient can call this."
        );
        _;
    }

    function close()
        public
        onlyRecipient
    {
        uint d = calculateDays(start);
        recipient.transfer(price * d);
        selfdestruct(sender);
    }

    function claimTimeout() public {
        require(now >= expiration, "Haven't reached the expiration");
        recipient.transfer(price * duration);
        selfdestruct(sender);
    }

    function validAmount(uint256 _duration, uint256 _price, uint256 _amount)
        internal
        pure
        returns (bool)
    {
        return _duration * _price <= _amount;
    }

    function isExpired() external view returns (bool) {
        return expiration <= now;
    }

    function calculateDays(uint256 _start) internal pure returns (uint) {
        return (now - _start) / 60 / 60 / 24;
    }
}
