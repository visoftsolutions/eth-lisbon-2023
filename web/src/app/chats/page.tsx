"use client";

import { SectionLayout } from "@/layout/SectionLayout";
import { useContractRead } from "wagmi";
import DeepTouchAbi from "../../abi/DeepTouch.json";
import { useEffect, useState } from "react";
import { useWalletContext } from "@/context/wallet";
import axios from "axios";
import { createPublicClient, http } from 'viem';
import { polygonZkEvmTestnet } from 'viem/chains';
import Link from "next/link";
import Image from "next/image";
import { config } from "../config";
import { UserElement } from "@/components/UserElement";
import { TradeModal } from "@/components/TradeModal";

export default function Chats() {
  const walletContextCheck = useWalletContext();
  if (walletContextCheck == undefined) {
    throw new Error("Context not in Provider");
  }
  const { walletContext, setWalletContext } = walletContextCheck;

  const [balanceValueInEth, setBalanceValueInEth] = useState<bigint>(0n);
  const [sharesValueInEth, setSharesValueInEth] = useState<bigint>(0n);
  const [ethValueInUsd, setEthValueInUsd] = useState<bigint>(0n);
  const [listedChats, setListedChats] = useState<any[]>([]);

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getSharesSupply",
    args: [walletContext.selectedWallet?.address],
    onSuccess(data) {
      setSharesValueInEth(data as bigint);
    },
  });

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getEthPrice",
    onSuccess(data) {
      console.log("ethValueInUsd", data);
      setEthValueInUsd(data as bigint);
    },
  });

  const client = createPublicClient({
    chain: polygonZkEvmTestnet,
    transport: http(),
  });

  useEffect(() => {
    (async () => {
      await axios.get("http://localhost:3001/user")
        .then(async (response) => {
          console.log(response.data);
          const filtered = [];
          for (const obj of response.data) {
            let anyOf = 0;
            for (const wallet of obj.wallets) {
              let value = await client.readContract({
                address: config.contractAddress,
                abi: DeepTouchAbi,
                functionName: "getSharesBalance",
                args: [wallet.address ,walletContext.selectedWallet?.address],
              }) as bigint;
              console.log(value);
              if (value > 0n) {
                anyOf += 1;
              }
            }
            if (anyOf > 0) {
              filtered.push(obj);
            }
          }
          setListedChats(filtered);
        });
    })();
  }, []);

  return (
    <SectionLayout>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">PORTFOLIO</span>
          <div className="flex justify-between font-semibold">
            <p>${Number(balanceValueInEth) / Number(10 ** 18) * Number(ethValueInUsd) / Number(10 ** 18)}</p>
            <p>{Number(balanceValueInEth) / Number(10 ** 18)} ETH</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">YOUR KEYS VALUE</span>
          <div className="flex justify-between font-semibold">
            <p>${Number(sharesValueInEth) / Number(10 ** 18) * Number(ethValueInUsd) / Number(10 ** 18)}</p>
            <p>{Number(sharesValueInEth) / Number(10 ** 18)} ETH</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold">MY CHATS</h4>

        <div className="flex flex-col gap-2">
          {listedChats.map(({ id, image, name, wallets }, index) => (
            <Link key={index} href={`chats/${id}`}> 
              <UserElement wallets={wallets} name={name} image={image}  />
            </Link>
            // <Link
            //   href={`chats/${address}`}
            //   key={index}
            //   className="flex justify-between py-2 px-2 bg-gray-900 rounded-md items-center"
            // >
            //   <div className="flex gap-2 items-center">
            //     <Image
            //       src={image}
            //       alt="user img"
            //       width={64}
            //       height={64}
            //       className="rounded-full"
            //     />
            //     <p className="text-lg font-medium">{name}</p>
            //   </div>
            //   <p className="text-lg font-bold">{value}</p>
            // </Link>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
