"use client";

import { SectionLayout } from "@/layout/SectionLayout";
import Image from "next/image";
import Link from "next/link";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useContractRead } from "wagmi";
import DeepTouchAbi from "../../abi/DeepTouch.json";
import { useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { BiDollar } from "react-icons/bi";
import { TradeModal } from "@/components/TradeModal";

export default function Chats() {
  const [userInfoLocalStorageValue] = useLocalStorage("userInfo", {});
  console.log(userInfoLocalStorageValue);
  const { data } = useGetUser();
  const filteredWallets = data?.filter((user) =>
    user.wallets.filter((wallet) => wallet.kind === "internal"),
  );
  console.log("filteredWallets", filteredWallets);

  // const data = [
  //   {
  //     address: "0x8A8a18DCC99795c8C83FF609b44A7CAad29AdE46",
  //     logo: "/logo.jpg",
  //     name: "Paweł",
  //     value: "$100.00",
  //   },
  //   {
  //     address: "0x3E6E544f24D183F3f7028615f732d9c437f5C5Fa",
  //     logo: "/logo.jpg",
  //     name: "Kordian",
  //     value: "$0.00",
  //   },
  // ];

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
            <div
              key={index}
              className="flex justify-between py-2 px-2 bg-gray-900 rounded-md items-center"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={image}
                  alt="user img"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <p className="font-medium text-gray-300">{name}</p>
              </div>
              {/* <p className="text-lg font-bold">{value}</p> */}

              <div className="flex gap-2">
                {/* {wallets.map((wallet, index) => (
                  <Link href={`/chats/${wallet.address}/public`} className="border border-gray-900 text-sm text-gray-400 hover:text-white hover:bg-gray-800 p-1 px-2 rounded-md" >Chat {index+1}</Link>
                ))} */}
                {wallets.filter((wallet) => wallet.kind === "internal").length >
                  0 && (
                  <button
                    onClick={() =>
                      onTradeClick(
                        wallets.filter(
                          (wallet) => wallet.kind === "internal",
                        )[0].address,
                      )
                    }
                    className="border-yellow-400 text-yellow-400 border font-medium py-1 px-2 rounded-md flex gap-1 items-center text-sm hover:bg-yellow-400 hover:text-black"
                  >
                    Trade <BiDollar size={12} />
                  </button>
                )}
              </div>
            </div>
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
