import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Share, Flag } from "iconsax-react";
import { useFunctions } from "../../../contexts/CommonFunctions";
import SaveButton from "./SaveButton";
import { useShareReportModal } from "../context/ShareAndReportContext";

const Item = ({
  itemId,
  imageLink,
  title,
  price,
  bidCount,
  endsIn,
  previewMode = false,
}) => {
  const navigate = useNavigate();
  const { openReportModal, openShareModal } = useShareReportModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const style = {
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      marginBottom: "14px",
      flex: "1 0 240px",
    },
    imageContainer: {
      aspectRatio: "4/3",
      borderRadius: "32px 32px 12px 12px",
      border: "4px solid var(--color-scheme-primary)",
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative",
      marginBottom: "6px",
    },
    itemImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    bidCountContainer: {
      position: "absolute",
      bottom: "10px",
      left: "10px",
      backgroundColor: "rgba(var(--inverted-text-color-rgb), 0.4)",
      padding: "2px 6px",
      fontSize: "13px",
      fontWeight: "600",
      borderRadius: "6px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "var(--text-color)",
    },
    timeContainer: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      backgroundColor: "rgba(var(--inverted-text-color-rgb), 0.4)",
      padding: "2px 6px",
      fontSize: "13px",
      fontWeight: "600",
      borderRadius: "6px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "var(--text-color)",
    },
    detailsContainer: {
      height: "76px",
      backgroundColor: "var(--color-scheme-primary)",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "12px 12px 24px 24px",
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      paddingTop: "18px",
      width: "38px",
      gap: "4px",
    },
    titleContainer: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "18px",
      gap: "4px",
      flexGrow: 1,
      width: "calc(100% - 56px)",
    },
    title: {
      fontSize: "1.2rem",
      color: "var(--primary-color)",
      fontWeight: "600",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
    price: {
      fontSize: "1.1rem",
      color: "var(--text-color)",
      fontWeight: "700",
      maxWidth: "200px",
    },
  };

  const { formatDuration, generateSlug } = useFunctions();

  return (
    <div
      style={style.outerContainer}
      onClick={() => {
        if (previewMode) return;
        navigate(`/item/${itemId}/${generateSlug(title)}`);
        document.title = "BidBazaar - " + title;
      }}
      className="item"
    >
      <div style={style.imageContainer}>
        <img src={imageLink} alt={title} style={style.itemImage} />
        <div style={style.bidCountContainer}>
          Bid Count: {bidCount.toLocaleString()}
        </div>
        <div style={style.timeContainer}>{formatDuration(endsIn)}</div>
      </div>
      <div style={style.detailsContainer}>
        <div style={style.titleContainer}>
          <span style={style.title}>{title}</span>
          <span style={style.price}>Rs. {price.toLocaleString()}</span>
        </div>
        <div style={style.actionsContainer}>
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (previewMode) return;
                setShowDropdown(!showDropdown);
              }}
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
                fontSize: "18px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="2 0 24 24"
                fill="none"
              >
                <path
                  d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM19 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
                  stroke="var(--text-color)"
                  strokeWidth="1"
                  fill="var(--text-color)"
                ></path>
              </svg>
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                tabIndex={0}
                style={{
                  position: "absolute",
                  top: "26px",
                  right: "0",
                  background: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  zIndex: 100,
                  width: "120px",
                  backgroundColor: "var(--color-scheme-secondary)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  onClick={() => {
                    openShareModal({ itemId, imageLink, title, price });
                  }}
                  className="custom-dropdown-item"
                  style={{
                    padding: "12px 12px 8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Share size={16} color="var(--text-color)" />
                  <span style={{ color: "var(--text-color)" }}>Share</span>
                </div>
                <hr
                  style={{
                    margin: 0,
                    border: "none",
                    height: "1px",
                    background: "rgba(128, 128, 128, 0.3)",
                  }}
                />
                <div
                  onClick={() => {
                    openReportModal({ itemId, imageLink, title, price });
                  }}
                  className="custom-dropdown-item"
                  style={{
                    padding: "8px 12px 12px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Flag size={16} color="red" />
                  <span style={{ color: "red" }}>Report</span>
                </div>
              </div>
            )}
          </div>
          <SaveButton itemId={itemId} previewMode={previewMode} />
        </div>
      </div>
    </div>
  );
};

export default Item;
