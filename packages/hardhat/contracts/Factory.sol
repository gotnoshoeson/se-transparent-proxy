//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract Factory {

	address public immutable implementation;
	address[] public cloneList;

	constructor (address _implementation) public {
		implementation = _implementation;
	}

	function cloneContract () public returns(address) {
		address cloneAddress = Clones.clone(implementation);	
		cloneList.push(cloneAddress);
		return cloneAddress;
	}

	function readCloneList() public view returns (address[] memory) {
		address[] memory result = new address[](cloneList.length);
		for (uint256 i = 0; i < cloneList.length; i++){
			result[i] = cloneList[i];
		}
		return result;
	}

}
