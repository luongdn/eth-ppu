pragma solidity >=0.4.22 <0.7.0;
import "./Files.sol";

contract PaymentChannel {
    address public filesContractAddr;
    string fileHash;
    address payable public sender;
    address payable public recipient;
    uint256 public price;
    uint256 public start;
    uint256 public duration;
    uint256 public expiration;
    uint256 public amount;

    constructor (
        address payable _sender,
        string memory _fileHash,
        address payable _recipient,
        uint256 _price,
        uint256 _duration
    )
        public
        payable
    {
        require(validAmount(_duration, _price, msg.value), "Invalid amount");
        filesContractAddr = msg.sender;
        sender = _sender;
        fileHash = _fileHash;
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

    function getInfo()
        public
        view
        returns (uint256 _price, uint256 _start, uint256 _duration, uint256 _expiration, uint256 _amount)
    {
        return (price, start, duration, expiration, amount);
    }

    function close()
        public
        onlySender
    {
        uint d = calculateDays(start);
        recipient.transfer(price * d);
        Files filesContract = Files(filesContractAddr);
        filesContract.removeReader(fileHash, sender);
        selfdestruct(sender);
    }

    function claimTimeout() public {
        require(now >= expiration, "Haven't reached the expiration");
        recipient.transfer(price * duration);
        Files filesContract = Files(filesContractAddr);
        filesContract.removeReader(fileHash, sender);
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

    function calculateDays(uint256 _start) internal view returns (uint) {
        uint d = (now - _start) / 60 / 60 / 24;
        if (d < 1) {
            return 1;
        }
        return d;
    }
}
