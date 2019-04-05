pragma solidity 0.5.0;

contract Register {
    
    address public owner;
    address[] public versions;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function setNewVersion(address _versionAddress) public {
        require(msg.sender == owner && requireContract(_versionAddress) );
        versions.push(_versionAddress);
    }
    
    function getLatestVersion() public view returns(address) {
        require(versions.length >= 1);
        return versions[versions.length-1];
    }
    
    function requireContract(address _versionAddress) private view returns (bool isContract) {
        assembly {
            let isEOA := iszero(extcodesize(_versionAddress)) //check if code at address is empty, returns true if so
            switch isEOA
            case 0 { isContract := 1 } //if code at address, return true
            case 1 { isContract := 0 } //if no code at address, return false
        }
    }
}

contract Proxy {

    Register internal reg;

    constructor(address _register) public {
        reg = Register(address(_register)); //pass in address of version register
    }
    
    function() payable external {
        address _base = reg.getLatestVersion(); //get current version from register
        assembly {
            let ptr := mload(0x40) //set pointer to free memory slot
            calldatacopy(ptr, 0, calldatasize) //copy call data from scratchpad to free mem slot at pointer
            
            let result := delegatecall(
                gas, //gas limit
                _base, //destination address
                ptr, //input data location
                calldatasize, //input data size
                0, //location to write output data
                0) //output data size
                
            returndatacopy(ptr, 0, returndatasize) //copy return data from scratchpad to free mem slot at pointer
            
            switch result
            case 0 { revert(ptr, returndatasize) } //if call failed revert and display data at ptr
            default { return(ptr, returndatasize) } //if call succeeded return data at ptr
        }
    }  
}