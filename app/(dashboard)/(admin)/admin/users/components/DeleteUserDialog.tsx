"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUser } from "@/models/User";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteUserDialog({
  deleteDialog,
  deletingUser,
  setUsers,
  setDeleteDialog,
}: {
  deleteDialog: boolean;
  deletingUser?: IUser | null;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setUsers((prev: IUser[]) =>
        prev.filter((u: IUser) => u._id !== selectedUser._id)
      );

      await fetch(`/api/users/${selectedUser._id}`, { method: "DELETE" });

      toast.success("User deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">{selectedUser?.name}</span>?
        </p>
        <DialogFooter>
          <Button onClick={() => setDeleteDialog(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
