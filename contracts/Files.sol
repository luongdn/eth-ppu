pragma solidity >=0.5.0 <0.7.0;
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
        uint price;
    }

    mapping(string => File) public files;
    string[] public filesHash;

    mapping(string => string) internal accessKeys;

    modifier onlyFileExists(string memory _fileHash) {
        require(files[_fileHash].owner != address(0), "File not exists");
        _;
    }

    function checkPermission (string calldata _fileHash, address _addr)
        external
        view
        onlyFileExists(_fileHash)
        returns (bool _hasPermission, string memory _accessKey)
    {
        if (files[_fileHash].owner == address(_addr)) {
            return (true, accessKeys[_fileHash]);
        }
        if (files[_fileHash].readers[_addr].addr == address(0)) {
            return (false, "");
        }
        PaymentChannel channel = PaymentChannel(files[_fileHash].readers[_addr].paymentContract);
        if (channel.isExpired()) {
            return (false, "");
        }
        return (true, accessKeys[_fileHash]);
    }

    function addFile(
        string memory _fileHash,
        string memory _name,
        string memory _description,
        string memory _accessKey,
        uint _price
    )
        public
    {
        require(files[_fileHash].owner == address(0), "File exists");
        files[_fileHash] = File({
            owner: msg.sender,
            name: _name,
            readersCount: 0,
            description: _description,
            ipfsHash: _fileHash,
            price: _price
        });
        accessKeys[_fileHash] = _accessKey;
        filesHash.push(_fileHash);
    }

    function createPaymentChannel(
        address payable _sender,
        string memory _fileHash,
        address payable _recipient,
        uint256 _price,
        uint256 _duration
    )
        public
        payable
    {
        require(files[_fileHash].owner != msg.sender, "Owner can not create payment channel");
        PaymentChannel channel = (new PaymentChannel).value(msg.value)(_sender, _fileHash, _recipient, _price, _duration);
        addReader(_fileHash, _sender, address(channel));
    }

    function addReader(
        string memory _fileHash,
        address reader,
        address _contract
    )
        public
        onlyFileExists(_fileHash)
    {
        files[_fileHash].readers[reader] = Reader({
            addr: reader,
            paymentContract: _contract
        });
        files[_fileHash].readersCount++;
    }

    function closePaymentChannel(
        string memory _fileHash,
        address _reader
    )
        public
    {
        PaymentChannel channel = PaymentChannel(files[_fileHash].readers[_reader].paymentContract);
        channel.close();
        removeReader(_fileHash, _reader);
    }

    function removeReader(
        string memory _fileHash,
        address reader
    )
        public
        onlyFileExists(_fileHash)
    {
        require(files[_fileHash].readers[reader].paymentContract == msg.sender, "Do not have permission to remove");
        delete files[_fileHash].readers[reader];
        files[_fileHash].readersCount--;
    }

    function getPaymentChannelInfo(
        string memory _fileHash,
        address _reader
    )
        public
        view
        returns (uint256 _price, uint256 _start, uint256 _duration, uint256 _expiration, uint256 _amount)
    {
        PaymentChannel channel = PaymentChannel(files[_fileHash].readers[_reader].paymentContract);
        return channel.getInfo();
    }

    function getFilesCount() public view returns (uint) {
        return filesHash.length;
    }

    function getFileHash(uint index) public view returns (string memory _hash) {
        return filesHash[index];
    }

    function getFile(string memory _hash) public view returns (
        address owner,
        uint readersCount,
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint price
    ) {
        return (
            files[_hash].owner,
            files[_hash].readersCount,
            files[_hash].name,
            files[_hash].description,
            files[_hash].ipfsHash,
            files[_hash].price
        );
    }
}
