import { ChevronDownIcon } from "@heroicons/react/24/outline";

//import { useOutsideClick } from "~~/hooks/scaffold-eth";

export const ClonesDropdown = () => {
  //const [addressCopied, setAddressCopied] = useState(false);

  //const [selectingNetwork, setSelectingNetwork] = useState(false);

  return (
    <>
      <details className="dropdown dropdown-end leading-3">
        <summary tabIndex={0} className="btn btn-secondary btn-sm font-thin shadow-md dropdown-toggle gap-0 !h-auto">
          Clones List
          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[100] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
        >
          <li>Clones addresses go here</li>
        </ul>
      </details>
    </>
  );
};
