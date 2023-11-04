import { useQuery } from '@tanstack/react-query';
 
export const useGetUserByNameEmail = (name: string, email: string) => {
  const {isLoading, isError, isSuccess, data, error} = useQuery({
    queryKey: [name, email],
    queryFn: (): Promise<any> => fetch(`http://localhost:3001/user/?name=${name}&email=${email}`)
      .then((res) => res.json())
      .catch(err => {
        console.error(err);
        return null;
      })
  });

  return {isLoading, isError, isSuccess, data, error };
};
