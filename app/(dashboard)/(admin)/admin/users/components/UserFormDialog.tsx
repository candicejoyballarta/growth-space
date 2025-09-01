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
import { adminCreateUser, adminUpdateUser } from "@/actions/users";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { IUser } from "@/models/User";

export default function UserFormDialog({
  user,
  setUsers,
}: {
  user?: IUser | null;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
}) {
  const action = user ? adminUpdateUser : adminCreateUser;
  const [state, formAction] = useActionState(action, {
    success: false,
    errors: {},
    formValues: undefined,
  });

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState<Partial<IUser>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

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

        await fetch(`/api/users/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        toast.success("User updated!");
      } else {
        const res = await fetch(`/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newUser = await res.json();

        setUsers((prev: IUser[]) => [...prev, newUser.data]);
        toast.success("User added!");
      }

      setOpenDialog(false);
      setFormData({ name: "", email: "", role: "user", status: "active" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" action={formAction}>
          <Input
            placeholder="Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Select
            value={formData.role || ""}
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
            value={formData.status || ""}
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
            <Button onClick={() => setOpenDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
