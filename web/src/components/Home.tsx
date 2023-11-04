'use client';

import { Web3AuthModalPack, Web3AuthConfig, AuthKitSignInData, Web3AuthEventListener } from '@safe-global/auth-kit';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useEffect, useState } from 'react';

const connectedHandler: Web3AuthEventListener = (data) => console.log('CONNECTED', data);
const disconnectedHandler: Web3AuthEventListener = (data) => console.log('DISCONNECTED', data);

export function HomeComponent() {
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    ;(async () => {
      const options: Web3AuthOptions = {
        clientId: 'BCbR9fbi8RFYiy7tYhMI-MqD13b_zqJGW6f_2jKSDRYCIamI15snKkBL2f4AUdkK0_zPK3mfy2F8cXNGdxFQOj8',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x5a2',
          rpcTarget: 'https://rpc.public.zkevm-test.net/'
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['google', 'facebook']
        }
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: false
        }
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'mandatory'
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'DeepTouch'
          }
        }
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: 'https://safe-transaction-goerli.safe.global'
      });

      await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig });

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3AuthModalPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      setWeb3AuthModalPack(web3AuthModalPack);

      return () => {
        web3AuthModalPack.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
        web3AuthModalPack.unsubscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);
      };
    })();
  }, []);

  // useEffect(() => {
  //   if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
  //     ;(async () => {
  //       await login();
  //     })();
  //   }
  // }, [web3AuthModalPack]);

  const login = async () => {
    if (!web3AuthModalPack) return;

    const signInInfo = await web3AuthModalPack.signIn();
    console.log('SIGN IN RESPONSE: ', signInInfo);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log('USER INFO: ', userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  // const onSubmit = async () => {
  //   // await web3AuthModalPack.web3Auth?.connect();
  //   const { eoa, safes } = await web3AuthModalPack.signIn();
  // };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className='text-4xl font-bold text-white'>HELLO FREN</h1>
      <h2 className='text-3xl font-bold text-white'>WELCOME TO THE MADNESS.</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={async () => await login()}>Join the game</button>

      <button className='border-yellow-400 border text-white font-medium py-2 px-4 rounded-md' onClick={async () => await logout()}>Logout</button>
    </div>
  );
}
