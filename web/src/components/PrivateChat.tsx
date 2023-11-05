import { IExecDataProtector } from "@iexec/dataprotector";
import { useEffect, useState } from "react";

export function PrivateChat() {
  const [dataProtector, setDataProtector] = useState<IExecDataProtector>();
  
  useEffect(() => {
    const web3Provider = window.ethereum;
    
    if(web3Provider){
      // instantiate
      const dataProtector = new IExecDataProtector(web3Provider);
      console.log('dataProtector', dataProtector)
      setDataProtector(dataProtector);
    }
  }, []);

  return (
    <div>

    </div>
  );
}
