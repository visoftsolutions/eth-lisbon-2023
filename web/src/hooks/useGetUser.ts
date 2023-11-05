import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  typeOfLogin: string;
  wallets: {
    id: number;
    address: string;
    kind: "internal" | "extenral";
    userId: number;
  }[];
}

export const useGetUser = () => {
  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ["user"],
    queryFn: (): Promise<User[]> =>
      fetch(`http://localhost:3001/user`)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return null;
        }),
  });

  return { isLoading, isError, isSuccess, data, error };
};
