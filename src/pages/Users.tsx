import { useEffect, useState } from "react";
import type { User } from "../types/user";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import UserModal from "../components/UserModal";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch Users
  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    }

    fetchUsers();
  }, []);

  // Submit Handler
  const handleSubmit = async (form: Omit<User, "_id" | "__v">) => {
    if (editingUser) {
      const updated = await updateUser(editingUser._id, form);

      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u._id === updated._id ? updated : u)),
        );
      }
    } else {
      const created = await addUser(form);

      if (created) {
        setUsers((prev) => [created, ...prev]);
      }
    }

    setModalOpen(false);
    setEditingUser(null);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    const success = await deleteUser(id);

    if (success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    }
  };

  // Open Add
  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // Open Edit
  const openEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage system users</p>
        </div>

        <button
          onClick={openAdd}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Company
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  {/* User */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {u.name}
                      </p>
                      <p className="text-sm text-gray-500">@{u.username}</p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-700">{u.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                      {u.role}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {u.company?.name || "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(u._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        user={editingUser}
        submitText={editingUser ? "Update User" : "Add User"}
      />
    </div>
  );
}
