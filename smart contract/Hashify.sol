pragma solidity ^0.5.0;

contract Hashify {
    
    address public owner;
    
    mapping(address => bytes32[]) hashes;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function addHash(bytes32 _hash) public {
        hashes[msg.sender].push(_hash);
    }
    
    function getHashes(address _addy) public view returns(bytes32[] memory hash) {
        return hashes[_addy];
    }
    
    function getSpecificHash(address _addy, uint256 _index) public view returns(bytes32 hash) {
        return hashes[_addy][_index];
    }
    
    function deleteHash(address _addy, uint256 _index) public returns(bytes32[] memory hash) {
        require(_index < hashes[_addy].length, "Index greater than array length");

        for (uint i = _index; i<hashes[_addy].length-1; i++){
            hashes[_addy][i] = hashes[_addy][i+1];
        }
        hashes[_addy].length--;
        return hashes[_addy];
    }
    
}