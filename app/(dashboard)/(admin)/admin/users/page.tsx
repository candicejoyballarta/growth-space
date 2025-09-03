"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { IUser } from "@/models/User";
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users`);
        const data = await res.json();
        if (data?.error) throw new Error(data.error);
        setUsers(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            Manage Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button
              onClick={() => {
                setEditingUser(null);
                setOpenForm(true);
              }}
            >
              Add User
            </Button>
          </div>

          <UserTable
            users={filteredUsers}
            onEdit={(user) => {
              setEditingUser(user);
              setOpenForm(true);
            }}
            onDelete={(user) => {
              setSelectedUser(user);
              setOpenDelete(true);
            }}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        user={editingUser}
        openDialog={openForm}
        setOpenDialog={setOpenForm}
        setUsers={setUsers}
      />

      <DeleteUserDialog
        deleteDialog={openDelete}
        deletingUser={selectedUser}
        setUsers={setUsers}
        setDeleteDialog={setOpenDelete}
      />
    </div>
  );
}
