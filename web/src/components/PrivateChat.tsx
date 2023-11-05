"use client";
import { useWeb3AuthContext } from "@/context/web3auth";
import { IExecDataProtector } from "@iexec/dataprotector";
import { useEffect, useState } from "react";
import { IExecWeb3mail } from "@iexec/web3mail";

export function PrivateChat() {
  const web3AuthContextCheck = useWeb3AuthContext();
  if (web3AuthContextCheck == undefined) {
    throw new Error("Context not in Provider");
  }
  const { web3Auth, setWeb3Auth } = web3AuthContextCheck;

  const [iExecDataProtector, setIExecDataProtector] = useState<IExecDataProtector>();
  const [iExecWeb3Email, setIExecWeb3Email] = useState<IExecWeb3mail>();

  useEffect(() => {
    const web3Provider = web3Auth.web3AuthModalPack?.getProvider();

    if (web3Provider) {
      const dataProtector = new IExecDataProtector(web3Provider);
      const web3Email = new IExecWeb3mail(web3Provider);
      console.log(web3Provider, dataProtector, web3Email);

      setIExecDataProtector(dataProtector);
      setIExecWeb3Email(web3Email);
    }
  }, []);

  const protectData = async () => {
    console.log('iExecDataProtector', iExecDataProtector);
    const protectedData = await iExecDataProtector?.protectData({
      data: {
        email: 'example@gmail.com'
      }
    });

    console.log('protectedData', protectedData);
  };

  const fetchContacts = async () => {
    const listContact = await iExecWeb3Email?.fetchMyContacts();
    console.log(listContact);
  };

  return <div className="flex gap-2">
    <button className="bg-gray-900 p-2 rounded-md" onClick={async () => await protectData()}>protectData</button>
    <button className="bg-gray-900 p-2 rounded-md" onClick={async () => await fetchContacts()}>fetchContacts</button>
  </div>;
}
