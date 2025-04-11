import React from "react";

const Empty = ({ height }) => {
  return (
    <div
      style={{
        width: "100%",
        height: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="https://res.cloudinary.com/dprvuiiat/image/upload/v1744180219/Others/ChatGPT_Image_Apr_9__2025__10_46_08_AM-removebg-preview_dvgzku.png"
        alt=""
        width={300}
        height={202}
        style={{ objectFit: "cover" }}
      />
      <h1 style={{ color: "var(--text-color)", fontSize: "42px" }}>
        Nothing here!
      </h1>
    </div>
  );
};

export default Empty;
