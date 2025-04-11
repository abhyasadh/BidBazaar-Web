import React, { useRef, useState } from "react";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";
import { useItems } from "../context/ItemsContext";

const useThrottle = (func, delay) => {
  let lastCall = useRef(0);
  return (...args) => {
    const now = Date.now();
    if (now - lastCall.current < delay) {
      toast.error("Please wait a few seconds before trying again!");
      return;
    }
    lastCall.current = now;
    func(...args);
  };
};

const SaveButton = ({ itemId, strokeWidth = 2, previewMode = false }) => {
  const { protectedPost } = useProtectedApi();
  const { saved, unsave } = useItems();
  const [isSaved, setIsSaved] = useState(
    saved ? saved.some((item) => item.id === itemId) : false
  );
  const [loading, setLoading] = useState(false);

  const handleSaveToggle = useThrottle(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await protectedPost(apis.save, {
        itemId,
        save: !isSaved,
      });
      if (response.data.success) {
        if (saved) unsave(itemId);
        setIsSaved((prev) => !prev);
      }
    } catch (error) {
      console.error("Failed to save/unsave item:", error);
    } finally {
      setLoading(false);
    }
  }, 2000);

  return (
    <svg
      width="24"
      height="24"
      viewBox="-6 2 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        e.stopPropagation();
        if (previewMode) return;
        handleSaveToggle();
      }}
      style={{
        cursor: "pointer",
      }}
    >
      <path
        d="M3.3 22.75C2.94 22.75 2.59 22.66 2.29 22.48C1.62 22.09 1.24 21.31 1.24 20.34V8.98C1.24 6.85 2.97 5.12 5.1 5.12H12.88C15.01 5.12 16.74 6.85 16.74 8.98V20.34C16.74 21.31 16.36 22.08 15.69 22.48C15.02 22.87 14.16 22.83 13.31 22.36L9.38 20.17C9.19 20.06 8.79 20.06 8.6 20.17L4.67 22.36C4.21 22.62 3.74 22.75 3.3 22.75Z"
        fill={isSaved ? "var(--primary-color)" : "none"}
        stroke={isSaved ? "var(--primary-color)" : "var(--text-color)"}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SaveButton;
