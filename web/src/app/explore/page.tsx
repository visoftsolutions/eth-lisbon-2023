"use client";

import { SectionLayout } from "@/layout/SectionLayout";
import { useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { TradeModal } from "@/components/TradeModal";
import { UserElement } from "@/components/UserElement";

export default function Chats() {
  const {data} = useGetUser();

  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);
  const [tradeAddress, setTradeAddress] = useState("");

  const onTradeClick = (address: string) => {
    setTradeAddress(address);
    setIsTradeModalVisible(!isTradeModalVisible);
  };

  return (
    <SectionLayout>
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold">EXPLORE</h4>

        <div className="flex flex-col gap-2">
          {data?.map(({ wallets, image, name }, index) => (
            <UserElement key={index} wallets={wallets} name={name} image={image} onTradeClick={onTradeClick} />
            // <div
            //   key={index}
            //   className="flex justify-between py-2 px-2 bg-gray-900 rounded-md items-center"
            // >
            //   <div className="flex gap-4 items-center">
            //     <Image
            //       src={image}
            //       alt="user img"
            //       width={64}
            //       height={64}
            //       className="rounded-full"
            //     />
            //     <p className="font-medium text-lg text-gray-200">{name}</p>
            //   </div>
            //   <p className="text-lg font-bold">${usdBuyValue}</p>

            //   <div className="flex gap-2">
            //     {wallets.filter((wallet) => wallet.kind === "internal").length > 0 && (
            //       <button
            //         onClick={() =>
            //           onTradeClick(
            //             wallets.filter(
            //               (wallet) => wallet.kind === "internal",
            //             )[0].address,
            //           )
            //         }
            //         className="border-yellow-400 text-yellow-400 border font-medium py-1 px-2 rounded-md flex gap-1 items-center text-sm hover:bg-yellow-400 hover:text-black"
            //       >
            //         Trade <BiDollar size={12} />
            //       </button>
            //     )}
            //   </div>
            // </div>
          ))}
        </div>
      </div>

      {isTradeModalVisible && (
        <TradeModal
          tradeAddress={tradeAddress}
          isOpen={isTradeModalVisible}
          setIsOpen={setIsTradeModalVisible}
        />
      )}
    </SectionLayout>
  );
}
