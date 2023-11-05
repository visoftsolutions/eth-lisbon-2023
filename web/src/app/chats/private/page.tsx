"use client";

import { MessageTileComponent } from "@/components/MessageTile";
import { SectionLayout } from "@/layout/SectionLayout";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { TradeModal } from "@/components/TradeModal";
import { BiDollar } from "react-icons/bi";
import { PrivateChat } from "@/components/PrivateChat";

export default function Profile({ params }: { params: { address: string } }) {
  const [chat, setChat] = useState<"public" | "private">("public");
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);

  const onTradeClick = () => {
    setIsTradeModalVisible(!isTradeModalVisible);
  };

  const content = {
    address: params.address,
    logo: "/sbf.jpg",
    name: "Sam Bankman-Fried",
    price: {
      usd: "$29.00",
      eth: "1.00 ETH",
    },
  };

  return (
    <SectionLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Image
            src={content.logo}
            alt="user image"
            width={64}
            height={64}
            className="rounded-full aspect-square"
          />
          <h2 className="text-2xl font-semibold">{content.name}</h2>
        </div>

        <div className="">
          <button
            onClick={() => onTradeClick()}
            className="bg-yellow-400 text-black font-medium py-1 px-3 rounded-md flex gap-2 items-center"
          >
            Trade <BiDollar size={16} />
          </button>
        </div>
      </div>

      <PrivateChat />

      {isTradeModalVisible && (
        <TradeModal
          tradeAddress="0x"
          isOpen={isTradeModalVisible}
          setIsOpen={setIsTradeModalVisible}
        />
      )}
    </SectionLayout>
  );
}
