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

  const [sharesValue, setSharesValue] = useState<bigint>(0n);
  const [ethPrice, setEthPrice] = useState<bigint>(0n);
  const [listedChats, setListedChats] = useState<any[]>([]);

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getSharesSupply",
    args: [walletContext.selectedWallet?.address],
    watch: true,
    onSuccess(data) {
      setSharesValue(data as bigint);
    },
  });

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getEthPrice",
    watch: true,
    onSuccess(data) {
      setEthPrice(data as bigint);
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
            <p>3</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">YOUR KEYS NUMBER</span>
          <div className="flex justify-between font-semibold">
            <p>{Number(sharesValue)}</p>
            <p>ETH price{Number(ethPrice) / (10**18)}</p>
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
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
