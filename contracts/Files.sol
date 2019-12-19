pragma solidity ^0.5.0;
import "./PaymentChannel.sol";

contract Files {
    struct Reader {
        address addr;
        address paymentContract;
    }

    struct File {
        address owner;
        mapping(address => Reader) readers;
        uint readersCount;
        string name;
        string description;
        string ipfsHash;
    }

    mapping(string => File) public files;
    uint public filesCount;

    mapping(string => string) internal accessKeys;

    modifier onlyFileExists(string memory _hash) {
        require(files[_hash].owner != address(0), "File not exists");
        _;
    }

    function checkPermissionAndGetKey (string calldata _hash, address _addr)
        external
        view
        onlyFileExists(_hash)
        returns (bool _hasPermission, string memory _accessKey)
    {
        require(files[_hash].readers[_addr].addr != address(0), "Permission denied");
        PaymentChannel channel = PaymentChannel(files[_hash].readers[_addr].paymentContract);
        if (channel.isExpired()) {
            return (false, "");
        }
        return (true, accessKeys[_hash]);
    }

    function addFile(
        address _owner,
        string memory _hash,
        string memory _name,
        string memory _description,
        string memory _accessKey
    )
        public
    {
        require(files[_hash].owner == address(0), "File exists");
        files[_hash] = File({
            owner: _owner,
            name: _name,
            readersCount: 0,
            description: _description,
            ipfsHash: _hash
        });
        accessKeys[_hash] = _accessKey;
        filesCount++;
    }

    function removeFile(string memory _hash)
        public
        onlyFileExists(_hash)
    {
        delete files[_hash];
        filesCount--;
    }

    function addReader(
        string memory _hash,
        address reader,
        address _contract
    )
        public
        onlyFileExists(_hash)
    {
        files[_hash].readers[reader] = Reader({
            addr: reader,
            paymentContract: _contract
        });
        files[_hash].readersCount++;
    }

    function removeReader(
        string memory _hash,
        address reader
    )
        public
        onlyFileExists(_hash)
    {
        delete files[_hash].readers[reader];
        files[_hash].readersCount--;
    }
}
