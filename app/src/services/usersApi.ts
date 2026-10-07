import type { User } from "../types/User";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(
    "https://api-userapi.onrender.com/api/users/getUsers",
    {
      headers: {
        "x-api-key": "elev-hemlighet-2026",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
