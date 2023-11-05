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
