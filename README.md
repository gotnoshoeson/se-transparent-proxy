# 🏗 Scaffold-ETH 2 - Transparent Proxy Pattern

TL;DR - Transparent Upgradeable Proxy

Why do this? Why should you care? Short answer is upgradeable smart contracts. I know, this may be a bit taboo. Smart contracts are supposed to be immutable, isn't that the whole point? All of the proxy patterns that have been published by OpenZeppelin keep the immutable storage in tact and allow admins to add additional functionality without changing the contract address that the users interact with. For example, you have a smart contract that has a function that increments a value (++1), but now you want the contract to also have a decrement function (--1). An upgradeable contract pattern will allow you to do that and keep the smart contract's address and storage data in tact. So depending on the smart contract use, this could be an acceptable set of terms. What is this sorcery?

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

With that out of the way, onto the build!

## The build

** NOTE: This build is using OpenZeppelin contracts version 4.8.1. Let me know if you'd like to see a build with the latest OZ v5.0 TransparentUpgradeableProxy pattern. **

So why do this?

Contract upgradeability. Also, If you want to be able to deploy multiple instances of a smart contract and you want to reduce the cost of deployment.

We will start out with two smart contracts in this build:
  -1: YourContract.sol
  -2: ProxyFactory.sol

YourContract will be used as the implementation contract and ProxyFactory will be used as an on-chain way to deploy proxies of the implementation contract. All calls to the proxy contracts will be forwarded (delegatecall[delegatecall](https://solidity-by-example.org/delegatecall/)) to the implementation contract that contains the contract logic. The storage will be maintained in the proxy contract.

1. If you followed the steps previously, you can interact with YourContract and ProxyFactory on the typical Scaffold-Eth Debug page. Go ahead and choose the Factory contract and choose the createProxy method.

- Image here -

Create a few more so we can test them in our new page, Debug Proxies!

2. On the Debug Proxies page, select the contract you want to interact with by clicking on the 'Select Proxy Contract' dropdown menu. Set a new greeting and bam, Bob's your uncle!

What's that? The transaction failed? This is expected behavior as msg.sender was set as the admin (or owner) of the Proxy. The admin address can only call functions on the TransparentUpgradeableProxy functions, any other function calls will not fallback to the implementation contract if made by the admin. So let's log into the app with a different account.

To log in with a new burner wallet, simply open a new tab (you'll likely need to open a private or incognito tab in your browser to get a new burner address) and head to `http://localhost:3000/proxiesDebug`. Select a proxy contract and set a new greeting. It should work now! You can also check YourContract and see that the greeting has not been changed on this implementation contract. Cool. So we can create multiple copies of a contract and share the logic of one implementation contract for all proxy contracts. This alone is helpful because it reduces deployment costs. Onto the upgradeable part of the build.

## The contract upgrade

This may sound sacrilegious to you, afterall, smart contracts are supposed to be immutable right?  There may be situations where you want to expand the functionality of your smart contract after you've already deployed it. In this case, the goal is to upgrade the contract by adding new functionality but retaining the data immutability; and this is exactly what all Proxy patterns are designed to do. For a deeper dive, check out this article from OpenZeppelin --> `https://blog.openzeppelin.com/proxy-patterns?utm_source=zos&utm_medium=blog&utm_campaign=transparent-proxy-pattern`

Every time that we created a new proxy, we did so with the Factory contract and not with hardhat like the other contracts. For this reason we don't currently have the ABI to interact with any of the TransparentUpgradeableProxy functions or any of the functions that it inherits.

3. Let's deploy an upgraded version of YourContract and a YourTransparentUpgradeableProxy contract. In packages/hardhat/upgrade/contract, copy YourContract2.sol and YourTransparentUpgradeableProxy.sol to the packages/hardhat/contracts directory. In packages/hardhat/upgrade/deploy_script, copy 01_deploy_your_contract_upgrade.ts to the pacakges/hardhat/deploy directory. Hardhat will run the scripts found in this directory in the order of the numerical prefixes in the file names.

Now, in the terminal, run:

```
yarn deploy
```

We didn't make any changes to YourContract or Factory so hardhat won't re-deploy these contracts. The ABI for YourContract2 and YourTransparentUpgradeableProxy will be added to nextjs/contracts/deployedContracts so that we can interact with them on the frontend. On the Debug Contracts page you should now see UI for all four contracts.

4. Let's get all of the read and write methods for [TransparentUpgradeableProxy](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/proxy/transparent/TransparentUpgradeableProxy.sol) so that we can upgrade a proxy. First, we need to uncomment a few lines in proxiesDebug.tsx

```
// Uncomment the line below after step 3
const yourTransparentUpgradeableProxy = deployedcontracts[chain.id].YourTransparentUpgradeableProxy;
```

Now we want to have a copy of this ABI for every proxy that has been deployed. We can do this by uncommenting the following:

```
useEffect(() => {
    const dataArray = [];

    const iterate = () => {
      for (let index = 0; index < proxyContracts.length; index++) {
        const data = Object.create(yourTransparentUpgradeableProxy);
        data.address = proxyContracts[index];
        dataArray.push(data);
      }
    };

    if (proxyContracts?.length > 0)
      iterate();
    setProxyContractData(dataArray);
  }, [proxyContracts]);
```

Finally, we want to render all of the methods with the 


--- FOOTER ---

Now that you've learned the Transparent Upgradeable Proxy pattern, I have some bad news for you. This pattern is NOT the current recommended pattern for upgradeable proxy functionality. UUPS is now the pattern recommended by OpenZeppelin for this type of functionality. Read more about it here --> `https://docs.openzeppelin.com/contracts/4.x/api/proxy#transparent-vs-uups`.

Want to use the latest recommended proxy pattern? Stay tuned for a UUPS build coming soon...

Want to upgrade all proxies with one upgrade call? Stay tuned for an Upgradeable Beacon Proxy build coming soon...


<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a> |
  <a href="https://blog.openzeppelin.com/the-transparent-proxy-pattern">Open Zeppelin Blog - The transparent proxy pattern</a>
</h4>


