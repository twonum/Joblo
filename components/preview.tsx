import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css"; // Importing Quill's Bubble theme

// Dynamically import ReactQuill to disable SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface PreviewProps {
  value: string; // Content to display in the preview
}

export const Preview: React.FC<PreviewProps> = ({ value }) => {
  return (
    <div className="bg-white">
      {/* Render Quill in read-only mode */}
      <ReactQuill
        value={value} // Controlled value
        theme="bubble" // Using Bubble theme for preview
        readOnly // Disables editing
        formats={["bold", "italic", "underline", "link", "blockquote", "image"]} // Limit formats for read-only preview
      />
    </div>
  );
};
