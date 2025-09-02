"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { IUser } from "@/models/User";

export default function UserFormDialog({
  user,
  setUsers,
  openDialog,
  setOpenDialog,
}: {
  user?: IUser | null;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
}) {
  const initialForm: Partial<IUser> = {
    name: "",
    email: "",
    role: "user",
    status: "active",
  };

  const [formData, setFormData] = useState<Partial<IUser>>(initialForm);

  const resetForm = () => setFormData(initialForm);

  const handleSave = async () => {
    try {
      if (user) {
        // Optimistic update
        setUsers((prev: IUser[]) =>
          prev.map(
            (u: IUser): IUser =>
              u._id === user._id ? ({ ...u, ...formData } as IUser) : u
          )
        );

        const res = await fetch(`/api/users/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );

        if (!res.ok) {
          toast.error("Error updating user account. Try again later");
        } else {
          toast.success("User updated!");
        }
      } else {
        const res = await fetch(`/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const newUser = await res.json();
        console.log();

        if (!res.ok) {
          toast.error("Error creating user account. Try again later");
        } else {
          setUsers((prev) => [...prev, newUser]);
          toast.success("User added!");
        }
      }

      resetForm();
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      resetForm();
    }
  }, [user, openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Input
            placeholder="Name"
            name="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Select
            name="role"
            value={formData.role || "user"}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as "user" | "admin" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="status"
            value={formData.status || "active"}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "active" | "inactive",
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setOpenDialog(false);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
