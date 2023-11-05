"use client";

import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { useWeb3AuthContext } from "@/context/web3auth";
import { useWalletContext } from "@/context/wallet";
import { Wallet } from "@/context/wallet";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";

export function HomeComponent() {
  const router = useRouter();
  const web3AuthContextCheck = useWeb3AuthContext();
  if (web3AuthContextCheck == undefined) {
    throw new Error("Context not in Provider");
  }
  const { web3Auth, setWeb3Auth } = web3AuthContextCheck;
  const walletContextCheck = useWalletContext();
  if (walletContextCheck == undefined) {
    throw new Error("Context not in Provider");
  }
  const { walletContext, setWalletContext } = walletContextCheck;

  useEffect(() => {
    if (
      web3Auth.web3AuthModalPack &&
      web3Auth.authKitSignInData &&
      web3Auth.userInfo
    ) {
      // INFO: Moment w którym user się loguje

      // TODO: Add error handling
      // INFO: Save user in DB
      (async () => {
        console.log("before get");
        await axios
          .post("http://localhost:3001/user", {
            name: web3Auth.userInfo?.name,
            image: web3Auth.userInfo?.profileImage,
            email: web3Auth.userInfo?.email,
            typeOfLogin: web3Auth.userInfo?.typeOfLogin,
            wallets: [
              {
                address: web3Auth.authKitSignInData?.eoa,
                kind: "internal",
              },
            ],
          })
          .then(async (response) => {
            console.log("response.data", response.data);
            let wallets: Wallet[] = response.data.wallets.map((wallet: any) => {
              return {
                id: wallet.id,
                userId: wallet.userId,
                kind: wallet.kind,
                address: wallet.address,
              };
            });
            setWalletContext({ userId: response.data.id, wallets: wallets });
          });
      })();
    }
  }, [
    web3Auth.web3AuthModalPack &&
      web3Auth.authKitSignInData &&
      web3Auth.userInfo,
  ]);

  useEffect(() => {
    if (web3Auth.web3AuthModalPack && walletContext.userId) {
      router.push("/wallet");
    }
  }, [web3Auth.web3AuthModalPack && walletContext.userId]);

  const login = async () => {
    const options: Web3AuthOptions = {
      clientId:
        "BCbR9fbi8RFYiy7tYhMI-MqD13b_zqJGW6f_2jKSDRYCIamI15snKkBL2f4AUdkK0_zPK3mfy2F8cXNGdxFQOj8",
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x5a2",
        rpcTarget: "https://rpc.public.zkevm-test.net/",
      },
      uiConfig: {
        theme: "dark",
      },
    };

    const modalConfig = {
      [WALLET_ADAPTERS.METAMASK]: {
        label: "metamask",
        showOnDesktop: true,
        showOnMobile: true,
      },
    };

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "optional",
      },
      adapterSettings: {
        uxMode: "popup",
        whiteLabel: {
          name: "DeepTouch",
          dark: true,
        },
      },
    });

    const web3AuthModalPack = new Web3AuthModalPack({
      txServiceUrl: "https://safe-transaction-goerli.safe.global",
    });

    await web3AuthModalPack.init({
      options,
      adapters: [openloginAdapter],
      modalConfig,
    });

    const authKitSignInData = await web3AuthModalPack.signIn();
    console.log("SIGN IN RESPONSE: ", authKitSignInData);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log("USER INFO: ", userInfo);

    setWeb3Auth({ web3AuthModalPack, authKitSignInData, userInfo });
  };

  return (
    <div className="flex flex-col gap-8 items-center z-[100]">
      <h1 className="text-4xl font-bold text-white">DEEP TOUCH</h1>
      <h2 className="text-3xl font-bold text-white">
        TAKE THE LEAP INTO DEEP TOUCH
      </h2>

      <button
        className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-md"
        onClick={async () => await login()}
      >
        Start your journey{" "}
      </button>
    </div>
  );
}
