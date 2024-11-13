"use client";
import dynamic from "next/dynamic"; // Dynamic import for client-side only rendering
import "react-quill/dist/quill.snow.css"; // Importing Quill's Snow theme
import { useMemo, useCallback } from "react";
import React, { useState } from "react";

// Dynamically import ReactQuill to disable SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  // Modules for the Quill editor toolbar
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline"],
        ["link"],
        ["blockquote"],
        ["image"],
      ],
    }),
    []
  );

  const handleChange = useCallback(
    (content: string, delta: any, source: string, editor: any) => {
      onChange(content); // Handle the onChange event
    },
    [onChange]
  );

  return (
    <div className="bg-white">
      <ReactQuill
        value={value} // Controlled value
        onChange={handleChange} // Handles content change
        theme="snow" // Snow theme
        modules={modules} // Toolbar configuration
      />
    </div>
  );
};
