import { useQuery } from '@tanstack/react-query';
 
export const useGetUserById = (id: string) => {
  const {isLoading, isError, isSuccess, data, error} = useQuery({
    queryKey: [id],
    queryFn: (): Promise<any> => fetch(`http://localhost:3001/user/${id}`)
      .then((res) => res.json())
      .catch(err => {
        console.error(err);
        return null;
      })
  });

  return {isLoading, isError, isSuccess, data, error };
};
