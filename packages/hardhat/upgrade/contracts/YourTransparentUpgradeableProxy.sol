//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

/**
 * A smart contract so we can use the ABI in the frontend to upgrade the implementation in the proxy contracts
 * The Factory creates a TransparentUpgradeableProxy on-chain, we usually use hardhat deploy and generate the ABI
 * @author BuidlGuidl
 */
contract YourTransparentUpgradeableProxy is TransparentUpgradeableProxy {

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/01_deploy_your_contract_upgrade.ts
}
