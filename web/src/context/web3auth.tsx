import { AuthKitSignInData, Web3AuthModalPack } from '@safe-global/auth-kit';
import { UserInfo } from '@web3auth/base';
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Web3Auth {
    web3AuthModalPack?: Web3AuthModalPack,
    authKitSignInData?: AuthKitSignInData,
    userInfo?: Partial<UserInfo>,
}

const Web3AuthContext = createContext<{ web3Auth: Web3Auth, setWeb3Auth: (value: Web3Auth) => void }>({ web3Auth: {}, setWeb3Auth: () => { } });

export const useWeb3AuthContext = () => useContext(Web3AuthContext);

type Props = {
    children: ReactNode;
};


export function Web3AuthProvider({ children }: Props) {
    const [value, setValue] = useState<Web3Auth>({})

    return (
        <Web3AuthContext.Provider value={{
            web3Auth: value,
            setWeb3Auth: (value: Web3Auth) => {
                setValue(value)
            }
        }}>
            {children}
        </Web3AuthContext.Provider>
    );
};
