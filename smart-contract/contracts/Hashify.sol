pragma solidity ^0.5.0;

contract Hashify {

    address public owner;
    
    mapping(address => mapping(address => bool)) allowed;
    mapping(address => hashInfo[]) hashes;
    
    struct hashInfo {
        bytes32 hash;
        bool signed;
        uint256 signedAtBlock;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    
    event HashAdded(bytes32 indexed hash, uint256 indexed index, address indexed account);
    event VerificationRegistered(bytes32 indexed hash, uint256 indexed block, address indexed account);
    event VerificationChecked(address indexed account, bytes32 indexed hash, bool indexed verified);
    event HashesGotten(bytes32[] indexed hashes, address indexed account);
    event HashInfoGotten(bytes32 hash, bool verified, uint256 block, uint8 v, bytes32 r,bytes32 s);
    event Allowed(address indexed account, address indexed allowee);
    event Disallowed(address indexed account, address indexed disallowee);
    event HashDeleted(address indexed account, bytes32 indexed hash);

    constructor() public {
        owner = msg.sender;
    }
    
    function addHash(bytes32 _hash) public {
        hashes[msg.sender].push(hashInfo(_hash,false,0,0,0,0));
        emit HashAdded(_hash, hashes[msg.sender].length-1, msg.sender);
    }
    
    function registerVerification(uint256 _index, uint8 v, bytes32 r, bytes32 s) public {
        bytes32 hashToVerify = hashes[msg.sender][_index].hash;
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashToVerify));
        require(msg.sender == ecrecover(prefixedHash, v, r, s));
        hashes[msg.sender][_index] = hashInfo(hashToVerify,true,block.number,v,r,s);
        emit VerificationRegistered(hashes[msg.sender][_index].hash, block.number, msg.sender);
    }

    function checkVerification(address _address, uint256 _index) public returns(bool isVerified) {
        require(allowed[_address][msg.sender] || msg.sender == _address);
        emit VerificationChecked(_address, hashes[_address][_index].hash, hashes[_address][_index].signed);
        return hashes[_address][_index].signed;
    }
    
    function getHashes() public returns(bytes32[] memory hashArray) {
        bytes32[] memory returnHashes = new bytes32[](hashes[msg.sender].length);
        for (uint i = 0; i<hashes[msg.sender].length; i++){
            returnHashes[i] = hashes[msg.sender][i].hash;
        }
        emit HashesGotten(returnHashes, msg.sender);
        return returnHashes;
    }
    
    function getHashInfo(address _address, uint256 _index) public {
        require(allowed[_address][msg.sender] || msg.sender == _address);
        emit HashInfoGotten(hashes[_address][_index].hash,
        hashes[_address][_index].signed,
        hashes[_address][_index].signedAtBlock,
        hashes[_address][_index].v,
        hashes[_address][_index].r,
        hashes[_address][_index].s);
    }
    
    function allow(address _address) public returns(address) {
        allowed[msg.sender][_address] = true;
        emit Allowed(msg.sender, _address);
        return _address;
    }
    
    function disAllow(address _address) public returns(address) {
        allowed[msg.sender][_address] = false;
        emit Disallowed(msg.sender, _address);
        return _address;
    }
    
    function deleteHash(uint256 _index) public returns(bytes32 deletedHash) 
    {
        require(_index < hashes[msg.sender].length);
        deletedHash = hashes[msg.sender][_index].hash;
        for (uint i = _index; i<hashes[msg.sender].length-1; i++){
            hashes[msg.sender][i] = hashes[msg.sender][i+1];
        }
        hashes[msg.sender].length--;
        emit HashDeleted(msg.sender, deletedHash);
        return deletedHash;
    }
}