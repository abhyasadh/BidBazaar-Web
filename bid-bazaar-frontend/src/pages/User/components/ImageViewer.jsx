import { ArrowDown2, ArrowUp2, CloseSquare } from "iconsax-react";
import React, { useState } from "react";

const ImageViewer = ({ images, activeImage, onChange }) => {
  const [zoomedIn, setZoomedIn] = useState(false);

  return (
    <dialog
      id="image-viewer"
      style={{
        padding: "0",
        margin: "0",
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: "var(--inverted-text-color)",
      }}
    >
      <div
        className="image-list-container"
        style={{
          position: "absolute",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          width: "50px",
          gap: "20px",
          backgroundColor: "var(--inverted-text-color)",
          padding: "0 30px",
          left: zoomedIn ? "-110px" : "0",
          transition: "left 0.2s ease-in-out",
        }}
      >
        <div className="arrow">
          <ArrowUp2
            color="grey"
            size={32}
            onClick={() => {
              onChange(Math.max(activeImage - 1, 0));
            }}
          />
        </div>
        <div
          className="image-list"
          style={{ flexDirection: "column", justifyContent: "center" }}
        >
          {images.map((image, index) => (
            <img
              style={{ width: "100%" }}
              key={index}
              src={image}
              alt="item"
              className={index === activeImage ? "active" : ""}
              onClick={() => {
                onChange(index);
              }}
            />
          ))}
        </div>
        <div className="arrow">
          <ArrowDown2
            color="grey"
            size={32}
            onClick={() => {
              onChange(Math.min(activeImage + 1, images.length - 1));
            }}
          />
        </div>
      </div>
      <div
        style={{
          minWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: 0,
            background: "none",
            cursor: "pointer",
            border: "none",
            outline: "none",
          }}
          onClick={() => {
            document.querySelector("body").style.overflow = "";
            setZoomedIn(false);
            document.getElementById("image-viewer").close();
          }}
        >
          <CloseSquare color="grey" size={30} />
        </button>
        <img
          src={images[activeImage]}
          alt="item"
          style={{
            height: zoomedIn ? "100%" : "100vh",
            objectFit: zoomedIn ? "cover" : "contain",
            cursor: zoomedIn ? "zoom-out" : "zoom-in",
          }}
          onClick={() => {
            setZoomedIn((prev) => !prev);
          }}
        />
      </div>
    </dialog>
  );
};

export default ImageViewer;
