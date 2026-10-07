import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/usersApi";

function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export default useUsers;
