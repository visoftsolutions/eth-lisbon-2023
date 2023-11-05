import React, { createContext, useState, useContext, ReactNode } from "react";

interface Wallet {
  id: number;
  userId: number;
  kind: "internal" | "external";
  address: string;
}

interface WalletContext {
  wallets?: Wallet[];
  selectedWallet?: Wallet;
}

const WalletContext = createContext<{
  walletContext: WalletContext;
  setWalletContext: (value: WalletContext) => void;
}>({ walletContext: {}, setWalletContext: () => {} });

export const useWalletContext = () => useContext(WalletContext);

type Props = {
  children: ReactNode;
};

export function WalletContextProvider({ children }: Props) {
  const [value, setValue] = useState<WalletContext>({});

  return (
    <WalletContext.Provider
      value={{
        walletContext: value,
        setWalletContext: (value: WalletContext) => {
          setValue(value);
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
