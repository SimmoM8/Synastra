import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/usersApi";

function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 10,
  });
}

export default useUsers;
