//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract Factory {

	address[] public proxyList;
	address public implementation;
	

	constructor (address _implementation)  {
		implementation = _implementation;
	}

	function createProxy() public returns(address) {
		TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(implementation, msg.sender, "0x");
		proxyList.push(address(proxy));
		return address(proxy);
	}

	function readProxyList() public view returns (address[] memory) {
		address[] memory result = new address[](proxyList.length);
		for (uint256 i = 0; i < proxyList.length; i++){
			result[i] = proxyList[i];
		}
		return result;
	}

}
