import API from "../api/axios";
import type { User } from "../types/user";

// GET all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await API.get<User[]>("/users");
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error fetching users:", err.message);
    else console.error("Unknown error fetching users:", err);
    return [];
  }
};

// ADD user
export const addUser = async (
  user: Omit<User, "_id" | "__v">,
): Promise<User | null> => {
  try {
    const res = await API.post<User>("/users", user);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Error adding user:", err.message);
    else console.error("Unknown error adding user:", err);
    return null;
  }
};

// UPDATE user
export const updateUser = async (
  id: string,
  user: Partial<Omit<User, "_id" | "__v">>,
): Promise<User | null> => {
  try {
    const { data } = await API.patch<User>(`/users/${id}`, user);
    return data;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error updating user:", err.message);
    else console.error("Unknown error updating user:", err);
    return null;
  }
};

// DELETE user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await API.delete(`/users/${id}`);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error deleting user:", err.message);
    else console.error("Unknown error deleting user:", err);
    return false;
  }
};
