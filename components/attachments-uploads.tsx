"use client";

import { useEffect, useState } from "react";
import { FilePlus } from "lucide-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase.config";
import toast from "react-hot-toast";
import React from "react";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled = false,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<number>(0); // State to store timestamp

  useEffect(() => {
    setIsMounted(true);
    setTimestamp(Date.now()); // Set timestamp only after the component is mounted
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    const newUrls: { url: string; name: string }[] = [];
    let completedFiles = 0;

    files.forEach((file) => {
      const fileRef = ref(storage, `Attachments/${timestamp}-${file.name}`); // Use state timestamp
      const uploadTask = uploadBytesResumable(fileRef, file, {
        contentType: file.type,
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          toast.error(`Error uploading ${file.name}: ${error.message}`);
          setIsLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            newUrls.push({ url: downloadUrl, name: file.name });
            completedFiles++;

            if (completedFiles === files.length) {
              setIsLoading(false);
              setProgress(0);
              onChange([...value, ...newUrls]);
              toast.success(`${completedFiles} file(s) uploaded successfully!`);
            }
          });
        }
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-40 bg-purple-100 p-4 flex items-center justify-center rounded-lg shadow-md">
        {isLoading ? (
          <div className="text-center">
            <p className="font-semibold text-gray-700">{`Uploading: ${progress.toFixed(
              2
            )}%`}</p>
            <div className="w-full mt-2 h-1 bg-gray-300 rounded-full">
              <div
                className="h-1 bg-green-500 rounded-full"
                style={{ width: `${progress.toFixed(2)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <label
            className="w-full h-full flex items-center justify-center cursor-pointer"
            aria-label="Upload attachments"
          >
            <div className="flex gap-2 items-center justify-center">
              <FilePlus className="w-6 h-6 text-purple-600" />
              <p className="font-medium text-purple-600 text-sm md:text-base">
                Add a file
              </p>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
              multiple
              className="hidden"
              onChange={onUpload}
              disabled={disabled}
              aria-describedby="upload-file-helper-text"
            />
          </label>
        )}
      </div>
      <div
        id="upload-file-helper-text"
        className="text-xs md:text-sm text-gray-500 text-center"
      >
        Supported formats: JPG, PNG, PDF, DOC, TXT, etc.
      </div>
    </div>
  );
};
