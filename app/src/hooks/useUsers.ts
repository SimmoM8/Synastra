import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  profile: {
    name: string;
    address: {
      city: string;
    };
  };
};

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-userapi.onrender.com/api/users/getUsers", {
      headers: {
        "x-api-key": "elev-hemlighet-2026",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { users, loading };
}

export default useUsers;
