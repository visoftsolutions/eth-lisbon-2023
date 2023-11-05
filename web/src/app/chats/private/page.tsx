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
import {BiDollar} from 'react-icons/bi';
import { PrivateChat } from "@/components/PrivateChat";

export default function Profile({ params }: { params: { address: string } }) {
  const [chat, setChat] = useState<"public" | "private">("public");
  const [myMessages, setMyMessages] = useState<
    {
      id: number;
      date: number;
      msg: string;
    }[]
  >([]);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { open } = useWeb3Modal();

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId: "a61fa6ebedad90290dcb5dab3b28afac",
    domain: "eth-lisbon-2023-ten.vercel.app",

    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
    isLimited: false,
  });

  const { account, setAccount, isRegistered, isRegistering, register } =
    useW3iAccount();
  useEffect(() => {
    if (!address) return;
    // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  // In order to authorize the dapp to control subscriptions, the user needs to sign a SIWE message which happens automatically when `register()` is called.
  // Depending on the configuration of `domain` and `isLimited`, a different message is generated.
  const performRegistration = useCallback(async () => {
    if (!address) return;
    try {
      await register((message) => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      // alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  useEffect(() => {
    // Register even if an identity key exists, to account for stale keys
    performRegistration();
  }, [performRegistration]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration();
    await subscribe();
  }, [performRegistration, subscribe]);

  const { messages } = useMessages();

  const performNotify = async (message: string, title?: string) => {
    fetch(
      "https://notify.walletconnect.com/a61fa6ebedad90290dcb5dab3b28afac/notify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer f72abdf2-c2c1-4155-9b1d-40a9fb3858f1",
        },
        body: JSON.stringify({
          notification: {
            type: "c9c2dacd-1b7b-4529-ab1c-1cc12808bfa5",
            title: title || "",
            body: message,
          },
          accounts: [params.address],
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


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
          <button onClick={() => onTradeClick()} className="bg-yellow-400 text-black font-medium py-1 px-3 rounded-md flex gap-2 items-center">Trade <BiDollar size={16} /></button>
        </div>
        
      </div>

      <PrivateChat />

      {isTradeModalVisible && <TradeModal tradeAddress="0x" isOpen={isTradeModalVisible} setIsOpen={setIsTradeModalVisible} />}
    </SectionLayout>
  );
}
