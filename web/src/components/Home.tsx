"use client";

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Web3AuthModalPack, AuthKitSignInData, Web3AuthEventListener } from '@safe-global/auth-kit';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import axios from 'axios';

const connectedHandler: Web3AuthEventListener = (data) =>
  console.log("CONNECTED", data);
const disconnectedHandler: Web3AuthEventListener = (data) =>
  console.log("DISCONNECTED", data);

export function HomeComponent() {
  const router = useRouter();
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<AuthKitSignInData | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [userInfoLocalStorageValue, setUserInfoLocalStorageValue] = useLocalStorage<{} | null>('userInfo', null);

  useEffect(() => {
    (async () => {
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

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3AuthModalPack.subscribe(
        ADAPTER_EVENTS.DISCONNECTED,
        disconnectedHandler
      );

      setWeb3AuthModalPack(web3AuthModalPack);

      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.CONNECTED,
          connectedHandler
        );
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.DISCONNECTED,
          disconnectedHandler
        );
      };
    })();
  }, []);

  useEffect(() => {
    // INFO: User was previously logged in.
    // Check if exists in DB. If so, push to wallets.
    if(userInfoLocalStorageValue) {
      ;(async () => {
        await axios.get(`http://localhost:3001/user?name=${(userInfoLocalStorageValue as any).name}&email=${(userInfoLocalStorageValue as any).email}`)
          .then(response => {
            console.log('response already in ls', response.data);
            router.push('/wallet');
          }).catch(error => {
            console.log(error.message);
          });
      })();
    }
  }, [userInfoLocalStorageValue]);

  useEffect(() => {
    console.log(web3AuthModalPack);
    console.log(userInfo);
    console.log(safeAuthSignInResponse);
    if (web3AuthModalPack && userInfo && safeAuthSignInResponse) {
      // INFO: Moment w którym user się loguje

      // TODO: Add error handling
      // INFO: Save user in DB
      ; (async () => {
        console.log('before get');
        await axios.post('http://localhost:3001/user', {
          name: userInfo.name,
          image: userInfo.profileImage,
          email: userInfo.email,
          typeOfLogin: userInfo.typeOfLogin,
        }).then(async response => {
          await axios.post(`http://localhost:3001/user/${response.data[0].id}/wallet`, {
            address: safeAuthSignInResponse.eoa,
            kind: 'internal'
          }).then(async walletResponse => {
            setUserInfoLocalStorageValue({
              userId: response.data[0].id,
              name: userInfo.name,
              image: userInfo.profileImage,
              email: userInfo.email,
              typeOfLogin: userInfo.typeOfLogin,
              wallets: walletResponse.data.wallets
            });
          });
        }).catch(async error => {
          // INFO: Conflict. User already in DB -> should query user and save data.
          await axios.get(`http://localhost:3001/user?name=${userInfo.name}&email=${userInfo.email}`).then(getUserReponse => {
            console.log('getUserReponse', getUserReponse);

            setUserInfoLocalStorageValue({
              userId: getUserReponse.data[0].id,
              name: userInfo.name,
              image: userInfo.profileImage,
              email: userInfo.email,
              typeOfLogin: userInfo.typeOfLogin,
              wallets: getUserReponse.data[0].wallets
            });
          });
        });
      })();
    

      router.push("/wallet");
    }
  }, [web3AuthModalPack, userInfo, safeAuthSignInResponse]);

  const login = async () => {
    if (!web3AuthModalPack) return;

    // const signInInfo = await web3AuthModalPack.signIn();
    // console.log('SIGN IN RESPONSE: ', signInInfo);

    // const userInfo = await web3AuthModalPack.getUserInfo();
    // console.log('USER INFO: ', userInfo);

    const signInInfo = await web3AuthModalPack.signIn();
    console.log("SIGN IN RESPONSE: ", signInInfo);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log("USER INFO: ", userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  //   new RampInstantSDK({
  //     hostAppName: 'DeepTouch',
  //     hostLogoUrl: 'https://yourdapp.com/yourlogo.png',
  //     hostApiKey: 'ohdyez6tzxc967rmayuezu8mg6fgxszn3b54myc5',
  //     swapAmount: '1500000000000000000', // 1,50 ETH in wei
  //     swapAsset: 'ETH_ETH',
  //     userAddress: '0xDC0512355497a165efb4FAeFc6DDd2c127e19bdd',
  //   })
  //     .on('*', (event) => console.log(event))
  //     .show();
  };

  return (
    <div className="flex flex-col gap-8 items-center z-[100]">
      <h1 className='text-4xl font-bold text-white'>DEEP TOUCH</h1>
      <h2 className='text-3xl font-bold text-white'>TAKE THE LEAP INTO DEEP TOUCH</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={async () => await login()}>Start your journey </button>
    </div>
  );
}
