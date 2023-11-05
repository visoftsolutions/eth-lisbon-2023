"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface Wallet {
  id: number;
  userId: number;
  kind: "internal" | "external";
  address: string;
}

export interface WalletContext {
  userId?: number;
  wallets?: Wallet[];
  selectedWallet?: Wallet;
}

const WalletContext = createContext<
  | {
      walletContext: WalletContext;
      setWalletContext: (value: WalletContext) => void;
    }
  | undefined
>(undefined);

export const useWalletContext = () => useContext(WalletContext);

type Props = {
  children: ReactNode;
};

export function WalletContextProvider({ children }: Props) {
  const [value, setValue] = useState<WalletContext>({});

  const set = (val: WalletContext) => {
    setValue(val);
  };

  return (
    <WalletContext.Provider
      value={{
        walletContext: value,
        setWalletContext: set,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
