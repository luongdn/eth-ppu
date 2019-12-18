pragma solidity ^0.5.0;
import "./PaymentChannel.sol";

contract Files {
    struct Reader {
        address addr;
        address paymentContract;
    }

    struct File {
        address owner;
        Reader[] readers;
        string name;
        string description;
        string ipfsHash;
    }

    mapping(string => File) public files;
    uint public filesCount;

    mapping(string => string) internal accessKeys;

    function checkPermissionAndGetKey (string calldata _hash, address _addr)
        external
        view
        returns (bool _hasPermission, string memory _accessKey)
    {
        File memory file = files[_hash];
        bool hasPermission = false;
        for (uint i = 0; i < file.readers.length; i++) {
            Reader memory reader = file.readers[i];
            if (reader.addr != _addr) {
                continue;
            }
            PaymentChannel channel = PaymentChannel(reader.paymentContract);
            hasPermission = channel.isExpired();
        }
        if (hasPermission) {
            return (hasPermission, accessKeys[_hash]);
        }
        return (hasPermission, "");
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
        files[_hash] = File({
            owner: _owner,
            readers: new Reader[](0),
            name: _name,
            description: _description,
            ipfsHash: _hash
        });
        accessKeys[_hash] = _accessKey;
        filesCount++;
    }

    function addReader(
        string memory _hash,
        address reader,
        address _contract
    )
        public
    {
        files[_hash].readers.push(Reader({
            addr: reader,
            paymentContract: _contract
        }));
    }
}
