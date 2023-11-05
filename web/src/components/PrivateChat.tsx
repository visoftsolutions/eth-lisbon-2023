"use client";
import { useWeb3AuthContext } from "@/context/web3auth";
import { IExecDataProtector } from "@iexec/dataprotector";
import { useEffect, useState } from "react";

export function PrivateChat() {
  const { web3Auth, setWeb3Auth } = useWeb3AuthContext();

  const web3Provider = web3Auth.web3AuthModalPack?.getProvider();

  useEffect(() => {


    console.log('web3Provider', web3Provider);
    if(web3Provider) {
      const dataProtector = new IExecDataProtector(web3Provider);
      console.log(web3Provider, dataProtector)
    }
    
  }, [web3Provider])
  


  return (
    <div>

    </div>
  );
}
