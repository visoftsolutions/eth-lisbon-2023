"use client";

import { MessageTileComponent } from "@/components/MessageTile";
import { SectionLayout } from "@/layout/SectionLayout";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import axios from "axios";
import { useGetUserById } from "@/hooks/useGetUserById";

export default function Profile({ params }: { params: { id: string } }) {
  const [chat, setChat] = useState<"public" | "private">("public");
  const [myMessages, setMyMessages] = useState<
    {
      id: number;
      date: number;
      msg: string;
      isMy: boolean;
    }[]
  >([]);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { open } = useWeb3Modal();
  const {data, isLoading, error} = useGetUserById(params.id);
  const [walletsToSend, setWalletsToSend] = useState<{ address: string }[]>([]);

  console.log(data);


  

  const fetchUsers = () => {
    console.log("before if");

    // INFO: Moment w którym user się loguje

    // TODO: Add error handling
    // INFO: Save user in DB
    (async () => {
      console.log("before get");
      await axios.get("http://localhost:3001/user").then(async (response) => {
        const x = response.data
          .map((el: any) => el.wallets)
          .flatMap((el: any) => el);
        setWalletsToSend(x);
        console.log("FETCHED");
      });
    })();
  };

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    projectId: "a61fa6ebedad90290dcb5dab3b28afac",
    domain: "eth-lisbon-2023-ten.vercel.app",
    isLimited: false,
  });

  const { setAccount, register } = useW3iAccount();
  const { messages } = useMessages();
  
  useEffect(() => {
    if (!address) return;
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);
  const performRegistration = useCallback(async () => {
    if (!address) return;
    await register((message) => signMessageAsync({ message }));
  }, [signMessageAsync, register, address]);

  useEffect(() => {
    fetchUsers();
    // Register even if an identity key exists, to account for stale keys
    performRegistration();
  }, [performRegistration]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration();
    await subscribe();
  }, [performRegistration, subscribe]);



  const performNotify = async (message: string, title?: string) => {
    console.log(
      `perform notify ${walletsToSend.map((el) => `eip155:1:${el.address}`)}`
    );
    fetch(
      "https://notify.walletconnect.com/a61fa6ebedad90290dcb5dab3b28afac/notify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer f72abdf2-c2c1-4155-9b1d-40a9fb3858f1",
        },
        body: JSON.stringify({
          notification: {
            type: "c9c2dacd-1b7b-4529-ab1c-1cc12808bfa5",
            title: title || "",
            body: message,
          },
          accounts: walletsToSend
            .filter((x) => x.address != address)
            .map((el) => `eip155:1:${el.address}`),
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // State to hold the title and message input values
  const [notificationMessage, setNotificationMessage] = useState("");

  // Function to handle the form submission
  const handleNotifySubmit = async (event: any) => {
    event.preventDefault();
    
    setMyMessages([
      ...myMessages,
      {
        id: Date.now(),
        date: Date.now(),
        msg: notificationMessage,
        isMy: true,
      },
    ]);

    await axios.post('http://localhost:3001/message', {
      date: Date.now(),
      msg: notificationMessage,
      isMy: true,
      address
    });
    await performNotify(notificationMessage);
    // Optionally, reset the form fields
    setNotificationMessage("");
  };

  useEffect(() => {
    (async () => {
      await axios.get(`http://localhost:3001/message/${address}`).then(response => {
        setMyMessages([
          ...response.data
        ]);
      });
    })();
  }, []);
  

  if(isLoading) {
    return <div className="flex items-center justify-center h-screen">LOADING...</div>;
  }

  return (
    <SectionLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Image
            src={data.image}
            alt="user image"
            width={64}
            height={64}
            className="rounded-full aspect-square"
          />
          <h2 className="text-2xl font-semibold">{data.name}</h2>
        </div>
      </div>

      {/* <>
        {!isReady ? (
          <div>Loading client...</div>
        ) : (
          <>
            {!address ? (
              <button onClick={() => open()}>Connect your wallet</button>
            ) : (
              <>
                {!isRegistered ? (
                  <div>
                    To manage notifications, sign and register an identity
                    key:&nbsp;
                    <button
                      onClick={performRegistration}
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Signing..." : "Sign"}
                    </button>
                  </div>
                ) : (
                  <>
                    {!isSubscribed ? (
                      <>
                        <button
                          onClick={performSubscribe}
                          disabled={isSubscribing}
                        >
                          {isSubscribing
                            ? "Subscribing..."
                            : "Subscribe to notifications"}
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </> */}

      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">CHAT</h4>
        <div className="flex w-full">
          <button className={`${chat == 'public' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-gray-200'} flex-1 py-1 font-medium`} onClick={() => setChat('public')}>PUBLIC CHAT</button>
          <button className={`${chat == 'private' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-gray-200'} flex-1 py-1 font-medium`} onClick={() => setChat('private')}>PRIVATE CHAT</button>
        </div>

        {chat === 'public' && <div className="grid grid-cols-1 gap-1 h-[500px] overflow-auto px-4 border border-gray-800">
          {(myMessages.length === 0 || messages.length === 0) ? <p className="m-auto">LOADING...</p> : 
            messages
              .map((el) => ({
                id: el.id,
                date: el.publishedAt,
                msg: el.message.body,
                isMy: false,
              }))
              .concat(myMessages)
              .sort((a, b) => a.date - b.date)
              .map((el) => (
                <MessageTileComponent key={el.id} params={el} />
              ))}
        </div>}

        {chat === 'private' && <div className="flex flex-col items-center justify-center h-[500px] px-4 border border-gray-800">
          <p>COMING SOON...</p>
        </div>}
        
      </div>
      

      <form onSubmit={handleNotifySubmit} className="flex flex-col gap-1">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-300"
        >
          Message
        </label>

        <div className="flex gap-2 w-full">
          <input
            id="message"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            required
            className="w-full text-gray-200 text-sm p-2 border border-gray-900 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
          />

          <button
            type="submit"
            className="py-2 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-md shadow hover:bg-yellow-500 text-sm disabled:bg-gray-900 disabled:text-gray-300"
            disabled={chat === 'private'}
          >
            Send
          </button>
        </div>
      </form>
    </SectionLayout>
  );
}
