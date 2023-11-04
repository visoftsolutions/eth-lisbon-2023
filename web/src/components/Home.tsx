'use client';

import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter, OPENLOGIN_NETWORK } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from 'ethers'

export function HomeComponent() {

  const login = async () => {
    const web3auth = new Web3Auth({
      clientId: 'BCbR9fbi8RFYiy7tYhMI-MqD13b_zqJGW6f_2jKSDRYCIamI15snKkBL2f4AUdkK0_zPK3mfy2F8cXNGdxFQOj8',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x5",
        rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
      // Please remove this parameter if you're on the Base Plan
      uiConfig: {
        appName: "W3A",
        // appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
        mode: "dark",
        logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        loginGridCol: 3,
        primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      },
      web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
    });

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "optional",
      },
      adapterSettings: {
        uxMode: "popup", // "redirect" | "popup"
        whiteLabel: {
          logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          mode: "dark", // whether to enable dark, light or auto mode. defaultValue: auto [ system theme]
        },
        mfaSettings: {
          deviceShareFactor: {
            enable: true,
            priority: 1,
            mandatory: true,
          },
          backUpShareFactor: {
            enable: true,
            priority: 2,
            mandatory: false,
          },
          socialBackupFactor: {
            enable: true,
            priority: 3,
            mandatory: false,
          },
          passwordFactor: {
            enable: true,
            priority: 4,
            mandatory: false,
          },
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);

    await web3auth.initModal({
      modalConfig: {
        [WALLET_ADAPTERS.OPENLOGIN]: {
          label: "openlogin",
          loginMethods: {
            // Disable facebook and reddit
            facebook: {
              name: "facebook",
              showOnModal: false
            },
            reddit: {
              name: "reddit",
              showOnModal: false
            },
            // Disable email_passwordless and sms_passwordless
            email_passwordless: {
              name: "email_passwordless",
              showOnModal: false
            },
            sms_passwordless: {
              name: "sms_passwordless",
              showOnModal: false
            }
          }
        }
      }
    });

    const web3authProvider = await web3auth.connect();
    
    console.log(web3authProvider);

    // let provider = new ethers.providers.Web3Provider(web3authProvider)
    // let signer = provider.getSigner()

    setInterval(async () => {
      await web3auth.logout();
    }, 10000)
  };

  const logout = async () => {

  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className='text-4xl font-bold text-white'>HELLO FREN</h1>
      <h2 className='text-3xl font-bold text-white'>WELCOME TO THE MADNESS.</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={async () => await login()}>Join the game</button>

      <button className='border-yellow-400 border text-white font-medium py-2 px-4 rounded-md' onClick={async () => await logout()}>Logout</button>
    </div>
  );
}
