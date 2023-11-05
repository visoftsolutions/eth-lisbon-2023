import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import truncateEthAddress from "truncate-eth-address";
import { useContractRead, useContractWrite } from "wagmi";
import DeepTouchAbi from "../abi/DeepTouch.json";
import { useWalletContext } from "@/context/wallet";
import { parseEther } from "viem";
import { config } from "@/app/config";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  tradeAddress: string;
}

export function TradeModal({ isOpen, setIsOpen, tradeAddress }: Props) {
  const [buyPriceAfterFee, setBuyPriceAfterFee] = useState<BigInt>();
  const [sellPriceAfterFee, setSellPriceAfterFee] = useState<BigInt>();
  const [ethValueInUsd, setEthValueInUsd] = useState<number>(0);

  const [usdBuyValue, setUsdBuyValue] = useState<number>(0);
  const [usdSellValue, setUsdSellValue] = useState<number>(0);

  const [ethBuyValue, setEthBuyValue] = useState<number>(0);
  const [ethSellValue, setEthSellValue] = useState<number>(0);

  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getBuyPriceAfterFee",
    watch: true,
    args: [tradeAddress, 1],
    onSuccess(data) {
      setBuyPriceAfterFee(data as BigInt);
    },
  });


  useContractRead({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: "getSellPriceAfterFee",
    watch: true,
    args: [tradeAddress, 1],
    onSuccess(data) {
      setSellPriceAfterFee(data as BigInt);
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
    if(ethValueInUsd && buyPriceAfterFee && sellPriceAfterFee) {
      const ethBuyValue = Number(buyPriceAfterFee) / (10 ** 18);
      const ethSellValue = Number(sellPriceAfterFee) / (10 ** 18);
      
      const usdBuyValue = ethBuyValue * ethValueInUsd;
      const usdSellValue = ethSellValue * ethValueInUsd;

      setEthBuyValue(ethBuyValue);
      setEthSellValue(ethSellValue);

      setUsdBuyValue(usdBuyValue);
      setUsdSellValue(usdSellValue);
    }
    

  }, [ethValueInUsd, buyPriceAfterFee])

  const { isLoading, isSuccess, error, writeAsync } = useContractWrite({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: 'buyShares',
    args: [tradeAddress, 1],
  });

  const { isLoading: sellIsLoading, error: sellError, writeAsync: sellSharesAsync } = useContractWrite({
    address: config.contractAddress,
    abi: DeepTouchAbi,
    functionName: 'sellShares',
    args: [tradeAddress, 1],
  })

  const onBuyShare = async () => {
    if(buyPriceAfterFee?.toString()) {
      console.log(buyPriceAfterFee)
      await writeAsync({
        value: buyPriceAfterFee as bigint
      });
    }
  };

  const onSellShare = async () => {
    if(sellPriceAfterFee?.toString()) {
      console.log(sellPriceAfterFee)
      await sellSharesAsync({
        value: sellPriceAfterFee as bigint
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel
          className={"bg-gray-900 rounded-md p-8 flex flex-col gap-8 w-[400px]"}
        >
          <div className="flex flex-col gap-2">
            <Dialog.Title
              className={"text-xl font-semibold flex justify-between"}
            >
              TRADE
              <BsX
                size={24}
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </Dialog.Title>

            <Dialog.Description
              className={"flex flex-col gap-4 text-sm text-gray-200"}
            >
              <div className="flex flex-col">
                <span className="text-white font-semibold">Buy share price</span>
                <span>${usdBuyValue.toFixed(6)}</span>
                <span>{ethBuyValue.toFixed(6)} ETH</span>
              </div>

              <div className="flex flex-col">
                <span className="text-white font-semibold">Sell share price</span>
                <span>${usdSellValue.toFixed(6)}</span>
                <span>{ethSellValue.toFixed(6)} ETH</span>
              </div>
              
              <span>Address: {truncateEthAddress(tradeAddress)}</span>
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={async () => await onBuyShare()}
              className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-md disabled:bg-gray-800 disabled:text-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'LOADING' : 'Buy a share'}
            </button>

            <button
              onClick={async () => await onSellShare()}
              className="border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md disabled:border-gray-800 disabled:text-gray-400"
              disabled={sellIsLoading}
            >
              {sellIsLoading ? 'LOADING' : 'Sell a share'}
            </button>

            {error && <span className="text-sm text-red-500">Buy transaction rejected.</span>}
            {sellError && <span className="text-sm text-red-500">Sell transaction rejected.</span>}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
