//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * A smart contract so we can use the ABI in the frontend
 * The TransparentUpgradeableProxy creates a ProxyAdmin on chain, we usually use hardhat to generate the ABI
 * @author BuidlGuidl
 */
contract YourProxyAdmin is ProxyAdmin {

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/01_deploy_your_contract_upgrade.ts
}
