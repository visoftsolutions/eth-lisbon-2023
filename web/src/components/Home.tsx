'use client';

import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useEffect } from 'react';

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'BCbR9fbi8RFYiy7tYhMI-MqD13b_zqJGW6f_2jKSDRYCIamI15snKkBL2f4AUdkK0_zPK3mfy2F8cXNGdxFQOj8', // https://dashboard.web3auth.io/
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5a2',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.public.zkevm-test.net/'
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook', 'twitter', 'email_passwordless', 'discord']
  }
};

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: 'torus',
    showOnModal: false
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: false
  },
  [WALLET_ADAPTERS.OPENLOGIN]: {
    label: "openlogin",
    loginMethods: {
      google: {
        name: "google login",
        logoDark: "url to your custom logo which will shown in dark mode",
      },
      facebook: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "facebook login",
        showOnModal: false,
      },
    },
    // setting it to false will hide all social login methods from modal.
    showOnModal: true,
  },
};

// https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  }
});

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
};

const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

export function HomeComponent() {
  useEffect(() => {
    async function init() {
      await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig });
    }

    init();
  }, [web3AuthModalPack]);

  const onSubmit = async () => {
    // await web3AuthModalPack.web3Auth?.connect();
    const { eoa, safes } = await web3AuthModalPack.signIn();
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className='text-4xl font-bold text-white'>HELLO FREN</h1>
      <h2 className='text-3xl font-bold text-white'>WELCOME TO THE MADNESS.</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={async () => await onSubmit()}>Join the game</button>
    </div>
  );
}
