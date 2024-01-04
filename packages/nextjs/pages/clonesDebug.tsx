import { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractClonesUI } from "~~/components/scaffold-eth/Contract";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames"
import { useContractRead } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";


const selectedContractStorageKey = "scaffoldEth2.selectedContractClone";
const contractNames = getContractNames();
const factory: object = deployedContracts["31337"].Factory;
const yourContract: object = deployedContracts["31337"].YourContract;


const ClonesDebug: NextPage = () => {


  const [cloneContracts, setCloneContracts] = useState<string[]>();
  const [cloneContractData, setCloneContractData] = useState<object[]>();

  const [selectedContract, setSelectedContract] = useLocalStorage(
    selectedContractStorageKey,
    "",
  );

  const contractRead: string[] = useContractRead({
    address: factory.address,
    abi: factory.abi,
    functionName: "readCloneList",
  });

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);


  useEffect(() => {
    if (contractRead.data.length > 0)
      setCloneContracts(contractRead.data)
  }, [contractRead]);


  useEffect(() => {
    const dataArray = [];

    const iterate = () => {
      for (let index = 0; index < cloneContracts.length; index++) {
        const data = Object.create(yourContract);
        data.address = cloneContracts[index];
        dataArray.push(data);
      }
    };

    if (cloneContracts?.length > 0)
      iterate();
    setCloneContractData(dataArray);
  }, [cloneContracts]);

  return (
    <>
      <MetaHeader
        title="Debug Contracts | Scaffold-ETH 2"
        description="Debug your factory clone 🏗 Scaffold-ETH 2 contracts in an easy way"
      />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {contractNames.length === 0 ? (
          <p className="text-3xl mt-14">No clones found!</p>
        ) : (
          <>
            {contractNames?.length > 1 && (
              <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                <details ref={dropdownRef} className="dropdown dropdown-right leading-3">
                  <summary tabIndex={0} className="btn btn-secondary btn-sm shadow-md dropdown-toggle gap-0 !h-auto">
                    Select Clone Contract
                    <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                  </summary>
                  <ul
                    className="dropdown-content menu z-[100] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
                  >
                    {cloneContracts?.map((address) => (
                      <li
                        key={address}
                        onClick={() => {setSelectedContract(address);closeDropdown();}}
                        onKeyUp={() => setSelectedContract(address)}
                      >
                        <Address
                          address={address}
                          disableAddressLink={true}
                        />
                      </li>
                    ))}
                  </ul>
                </details>

              </div>
            )}
            {cloneContractData?.map(data => (
              <ContractClonesUI
                key={data.address}
                className={data.address === selectedContract ? "" : "hidden"}
                deployedContractData={data}
              />
            ))}
          </>
        )}
      </div>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / pages / debug.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default ClonesDebug;
