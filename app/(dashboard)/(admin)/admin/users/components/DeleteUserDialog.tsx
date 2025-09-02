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
  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/users/${deletingUser._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Error deleting user");
        return;
      }

      setUsers((prev: IUser[]) =>
        prev.filter((u: IUser) => u._id !== deletingUser._id)
      );

      toast.success("User deleted!");
      setDeleteDialog(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <Dialog
      open={deleteDialog}
      onOpenChange={(isOpen) => setDeleteDialog(isOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">{deletingUser?.name}</span>?
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
