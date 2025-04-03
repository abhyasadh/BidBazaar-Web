import { CloseSquare, Link1 } from "iconsax-react";
import React, { useState } from "react";
import { useShareReportModal } from "../context/ShareAndReportContext";
import { useFunctions } from "../../../contexts/CommonFunctions";
import {
  FacebookIcon,
  FacebookShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const Report = () => {
  const { selectedItem, closeShareModal } = useShareReportModal();
  const [copyText, setCopyText] = useState("Copy Link");
  const { generateSlug } = useFunctions();

  if (!selectedItem) return null;

  const shareUrl = `http://localhost:3000/item/${
    selectedItem.itemId
  }/${generateSlug(selectedItem.title)}`;

  return (
    <dialog
      id="share"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        closeShareModal();
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              color: "var(--primary-color)",
              fontSize: "26px",
              fontWeight: 600,
              marginLeft: "10px",
              marginTop: "6px",
            }}
          >
            Share Item
          </span>
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              closeShareModal();
            }}
          >
            <CloseSquare color="grey" size={30} />
          </button>
        </div>
        <div className="content">
          <span className="label">Product</span>
          <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
            <img
              src={selectedItem.imageLink}
              alt={selectedItem.title}
              width={80}
              style={{
                borderRadius: "10px",
                border: "3px solid var(--color-scheme-primary)",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--color-scheme-primary)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                padding: "10px 14px",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: "var(--primary-color)",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {selectedItem.title}
              </span>
              <span
                style={{
                  color: "var(--text-color)",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Rs. {selectedItem.price.toLocaleString()}
              </span>
            </div>
          </div>
          <div style={{ height: "20px" }}></div>
        </div>
        <div className="footer">
          <span
            className="label"
            style={{ display: "flex", marginBottom: "16px" }}
          >
            Share Links
          </span>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <div className="share-button">
              <FacebookShareButton url={shareUrl} quote={selectedItem.title}>
                <FacebookIcon size={50} round />
              </FacebookShareButton>
              Facebook
            </div>

            <div className="share-button">
              <TwitterShareButton url={shareUrl} quote={selectedItem.title}>
                <TwitterIcon size={50} round />
              </TwitterShareButton>
              Twitter/X
            </div>

            <div className="share-button">
              <WhatsappShareButton url={shareUrl} quote={selectedItem.title}>
                <WhatsappIcon size={50} round />
              </WhatsappShareButton>
              Whatsapp
            </div>

            <div className="share-button">
              <ThreadsShareButton url={shareUrl} quote={selectedItem.title}>
                <ThreadsIcon size={50} round />
              </ThreadsShareButton>
              Threads
            </div>

            <div className="share-button">
              <button
                quote={selectedItem.title}
                class="react-share__ShareButton"
                style={{
                  backgroundColor: "white",
                  font: "inherit",
                  color: "inherit",
                  cursor: "pointer",
                  width: "50px",
                  height: "50px",
                  padding: "0",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2px",
                  border: "1px solid black",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopyText("Copied!");
                  setTimeout(() => {
                    setCopyText("Copy Link");
                  }, 2000);
                }}
              >
                <Link1
                  size={24}
                  color="black"
                  style={{ transform: "rotate(135deg)" }}
                />
              </button>
              {copyText}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Report;
