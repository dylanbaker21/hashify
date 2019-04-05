pragma solidity 0.5.0;

contract Hashify {

    address public owner;
    mapping(address => hashInfo[]) internal hashes;
    
    struct hashInfo {
        bytes32 hash;
        bool signed;
        uint256 signedAtBlock;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    
    event HashAdded(bytes32 indexed hash, uint256 indexed index, address indexed account);
    event HashVerified(bytes32 indexed hash, uint256 indexed block, address indexed account);
    event HashesListed(bytes32[] hashes, address indexed account);
    event HashInfo(bytes32 indexed hash, bool indexed verified, uint256 indexed block, uint8 v, bytes32 r,bytes32 s);
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
        emit HashVerified(hashes[msg.sender][_index].hash, block.number, msg.sender);
    }
    
    function getHashes() public {
        bytes32[] memory returnHashes = new bytes32[](hashes[msg.sender].length);
        for (uint i = 0; i<hashes[msg.sender].length; i++){
            returnHashes[i] = hashes[msg.sender][i].hash;
        }
        emit HashesListed(returnHashes, msg.sender);
    }
    
    function getHashInfo(address _address, uint256 _index) public {
        emit HashInfo(hashes[_address][_index].hash,
        hashes[_address][_index].signed,
        hashes[_address][_index].signedAtBlock,
        hashes[_address][_index].v,
        hashes[_address][_index].r,
        hashes[_address][_index].s);
    }
    
    function deleteHash(uint256 _index) public {
        require(_index < hashes[msg.sender].length);
        bytes32 deletedHash = hashes[msg.sender][_index].hash;
        for (uint i = _index; i<hashes[msg.sender].length-1; i++){
            hashes[msg.sender][i] = hashes[msg.sender][i+1];
        }
        hashes[msg.sender].length--;
        emit HashDeleted(msg.sender, deletedHash);
    }
}