import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction, useState } from "react";
import {BsX} from 'react-icons/bs';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function TradeModal({isOpen, setIsOpen}: Props) {
  const [sharePrice, setSharePrice] = useState(0);

  const onBuyShare = () => {};

  const onSellShare = () => {};

  return (
    <Dialog
      open={isOpen} onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className={'bg-gray-900 rounded-md p-8 flex flex-col gap-8 w-[400px]'}>
          <div className="flex flex-col gap-2">
            <Dialog.Title className={'text-xl font-semibold flex justify-between'}>
              Trade Share
              <BsX size={24} className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </Dialog.Title>
            
            <Dialog.Description>
          Share price: ${sharePrice}
            </Dialog.Description>
          </div>
          

          <div className="flex flex-col gap-2">
            <button onClick={() => onBuyShare()} className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-md">Buy a share</button>
            <button onClick={() => onSellShare()} className="border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md">Sell a share</button>
          </div>
          
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
