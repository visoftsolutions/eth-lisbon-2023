'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Web3AuthModalPack, AuthKitSignInData, Web3AuthEventListener } from '@safe-global/auth-kit';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk"

const connectedHandler: Web3AuthEventListener = (data) => console.log('CONNECTED', data);
const disconnectedHandler: Web3AuthEventListener = (data) => console.log('DISCONNECTED', data);

export function HomeComponent() {
  const router = useRouter();
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [userInfoLocalStorageValue, setUserInfoLocalStorageValue] = useLocalStorage('userInfo', {});

  useEffect(() => {
    ; (async () => {
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
        }
      };

      const modalConfig = {
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: true
        }
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'optional'
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'DeepTouch',
            dark: true,
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

  useEffect(() => {
    if(userInfoLocalStorageValue) {
      router.push('/wallet');
    }
  }, [userInfoLocalStorageValue]);

  useEffect(() => {
    if (web3AuthModalPack && userInfo && safeAuthSignInResponse) {
      setUserInfoLocalStorageValue({
        ...userInfo,
        wallets: [
          {
            address: safeAuthSignInResponse.eoa,
            kind: 'internal'
          }
        ]
      });

      router.push('/wallet');
    }
  }, [web3AuthModalPack, userInfo, safeAuthSignInResponse]);

  const login = async () => {
    // if (!web3AuthModalPack) return;

    // const signInInfo = await web3AuthModalPack.signIn();
    // console.log('SIGN IN RESPONSE: ', signInInfo);

    // const userInfo = await web3AuthModalPack.getUserInfo();
    // console.log('USER INFO: ', userInfo);

    // setSafeAuthSignInResponse(signInInfo);
    // setUserInfo(userInfo || undefined);
    // setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
    new RampInstantSDK({
      hostAppName: 'DeepTouch',
      hostLogoUrl: 'https://yourdapp.com/yourlogo.png',
      hostApiKey: 'ohdyez6tzxc967rmayuezu8mg6fgxszn3b54myc5',
      swapAmount: '1500000000000000000', // 1,50 ETH in wei
      swapAsset: 'ETH_ETH',
      userAddress: '0xDC0512355497a165efb4FAeFc6DDd2c127e19bdd',
    })
      .on('*', (event) => console.log(event))
      .show();
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className='text-4xl font-bold text-white'>DEEP TOUCH</h1>
      <h2 className='text-3xl font-bold text-white'>WELCOME TO THE MADNESS.</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={async () => await login()}>Join the game</button>
    </div>
  );
}
