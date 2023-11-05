import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import DeepTouchAbi from "../abi/DeepTouch.json";
import { config } from "@/app/config";
import Image from "next/image";
import { BiDollar } from "react-icons/bi";

interface Props {
  image: string;
  name: string;
  wallets: any[];
  onTradeClick?: (address: string) => void;
}

export function UserElement({ image, name, wallets, onTradeClick }: Props) {
  const internalWalletAddress = wallets.filter(
    (wallet) => wallet.kind === "internal",
  )[0].address;

  const [buyPriceAfterFee, setBuyPriceAfterFee] = useState<BigInt>();
  const [ethValueInUsd, setEthValueInUsd] = useState<number>(0);

  const [usdBuyValue, setUsdBuyValue] = useState<number>(0);

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getBuyPriceAfterFee",
    watch: true,
    args: [internalWalletAddress, 1],
    onSuccess(data) {
      setBuyPriceAfterFee(data as BigInt);
    },
  });

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getEthPrice",
    watch: true,
    onSuccess(data) {
      setEthValueInUsd(
        (Number(data) / Number(10 ** 18)),
      );
    },
  });

  useEffect(() => {
    if(ethValueInUsd && buyPriceAfterFee) {
      const ethBuyValue = Number(buyPriceAfterFee) / (10 ** 18);
      const usdBuyValue = ethBuyValue * ethValueInUsd;

      setUsdBuyValue(usdBuyValue);
    }
  }, [ethValueInUsd, buyPriceAfterFee]);

  return (
    <div className="flex justify-between py-2 px-2 bg-gray-900 rounded-md items-center">
      <div className="flex gap-4 items-center">
        <Image
          src={image}
          alt="user img"
          width={48}
          height={48}
          className="rounded-full"
        />
        <p className="font-medium text-lg text-gray-200">{name}</p>
      </div>
      <div className="flex gap-4 items-center">

        <p className="font-medium">${usdBuyValue.toFixed(2)}</p>

        <div className="flex gap-2">
          {onTradeClick && wallets.filter((wallet) => wallet.kind === "internal").length > 0 && (
            <button
              onClick={() => onTradeClick(internalWalletAddress)}
              className="border-yellow-400 text-yellow-400 border font-medium py-1 px-2 rounded-md flex gap-1 items-center text-sm hover:bg-yellow-400 hover:text-black"
            >
      Trade <BiDollar size={12} />
            </button>
          )}
        </div>
      </div>
              
    </div>
  );
}
