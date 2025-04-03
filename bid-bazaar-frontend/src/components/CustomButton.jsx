import React, { useState } from "react";
import CircularLoading from "./CircularLoading";

const CustomButton = ({ id, text, type, onClick = () => {}, style }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onClick(e);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStyle = {
    width: "100%",
    height: "38px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    backgroundColor: "var(--primary-color)",
    marginTop: "32px",
    padding: "0 12px 0 12px",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "Blinker",
    cursor: isLoading ? "wait" : "pointer",
    boxShadow:
      "0 0px 12px 0 rgba(var(--primary-color-rgb), 0.6), 0 0px 20px 0 rgba(var(--primary-color-rgb), 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  style = { ...defaultStyle, ...style };

  return (
    <button
      id={id}
      type={type}
      className="submit"
      onClick={handleClick}
      style={{ marginTop: "32px", ...style }}
      disabled={isLoading}
    >
      {isLoading ? <CircularLoading /> : text}
    </button>
  );
};

export default CustomButton;
