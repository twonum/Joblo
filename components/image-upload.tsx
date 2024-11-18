"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setIsLoading(true);

    const fileRef = ref(storage, `JobCoverImage/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressValue =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressValue);
      },
      (error) => {
        toast.error("Upload failed: " + error.message);
        setIsLoading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          toast.success("Image uploaded successfully");
        } catch {
          toast.error("Error retrieving image URL");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const onDelete = async () => {
    try {
      await deleteObject(ref(storage, value));
      onRemove(value);
      toast.success("Image deleted successfully");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative w-full h-60 aspect-video rounded-md overflow-hidden flex items-center justify-center">
          <Image fill className="object-cover" alt="Image Cover" src={value} />
          <div
            className="absolute top-2 right-2 z-10 cursor-pointer"
            onClick={onDelete}
          >
            <Button size="icon" variant="destructive" disabled={disabled}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-60 aspect-video rounded-md flex items-center justify-center border border-dashed bg-neutral-50">
          {isLoading ? (
            <p>{`${progress.toFixed(2)}%`}</p>
          ) : (
            <label className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
              <ImagePlus className="w-10 h-10" />
              <p>Upload an Image</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                disabled={disabled}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};
