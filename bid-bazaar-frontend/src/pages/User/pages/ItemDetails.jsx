import React, { useEffect, useState } from "react";
import {
  ArrowRight2,
  ArrowLeft2,
  InfoCircle,
  Eye,
  TickCircle,
  Share,
  Flag,
} from "iconsax-react";
import { useParams } from "react-router-dom";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";
import SaveButton from "../components/SaveButton";
import ImageViewer from "../components/ImageViewer";
import { useShareReportModal } from "../context/ShareAndReportContext";
import Report from "../components/Report";
import ShareModal from "../components/Share";
import ContentLoader from "react-content-loader";
import { useUser } from "../../../contexts/UserContext";
import Calculator from "../components/Calculator";
import { getSocket } from "../../../APIs/socket";
import TimeDisplay from "../components/TimeDisplay";

const ItemDetails = () => {
  const { protectedGet } = useProtectedApi();
  const { openReportModal, openShareModal } = useShareReportModal();
  const { user } = useUser();
  const { itemId } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await protectedGet(`${apis.getProductById}/${itemId}`);
        setProduct(res.data.product);
      } catch (error) {
        toast.error("Failed to fetch categories!");
      }
    };
    fetchProductDetails();
  }, [protectedGet, itemId]);

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join-room", String(itemId));

    if (socket) {
      socket.on("bid-update", (data) => {
        if (String(data.productId) === String(itemId)) {
          setProduct((prev) => ({ ...prev, bids: data.bids }));
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-room", itemId);
        socket.off("bid-update");
      }
    };
  }, [itemId]);

  return (
    <>
      <div className="item-page-container">
        <div className="item-images">
          <div className="image-view">
            {product === null ? (
              <ContentLoader
                speed={1.5}
                width="100%"
                height="100%"
                viewBox="0 0 400 300"
                backgroundColor="var(--color-scheme-primary)"
                foregroundColor="var(--color-scheme-secondary)"
              >
                <rect x="0" y="0" rx="20" ry="20" width="100%" height="100%" />
              </ContentLoader>
            ) : (
              <img
                src={product.images[activeImage]}
                alt="item"
                onClick={() => {
                  document.querySelector("body").style.overflow = "hidden";
                  document.getElementById("image-viewer").showModal();
                }}
              />
            )}
          </div>
          <div className="image-list-container">
            <div className="arrow">
              <ArrowLeft2
                color="grey"
                size={20}
                onClick={() => {
                  if (product !== null)
                    setActiveImage(Math.max(activeImage - 1, 0));
                }}
              />
            </div>
            <div className="image-list">
              {product === null
                ? Array.from({ length: 4 }).map((_, index) => (
                    <ContentLoader
                      key={index}
                      speed={1.5}
                      width="10%"
                      height="10%"
                      viewBox="0 0 400 400"
                      backgroundColor="var(--color-scheme-primary)"
                      foregroundColor="var(--color-scheme-secondary)"
                    >
                      <rect
                        x="0"
                        y="0"
                        rx="40"
                        ry="40"
                        width="100%"
                        height="100%"
                      />
                    </ContentLoader>
                  ))
                : product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="item"
                      className={index === activeImage ? "active" : ""}
                      onClick={() => {
                        setActiveImage(index);
                      }}
                    />
                  ))}
            </div>
            <div className="arrow">
              <ArrowRight2
                color="grey"
                size={20}
                onClick={() => {
                  if (product !== null)
                    setActiveImage(
                      Math.min(activeImage + 1, product.images.length - 1)
                    );
                }}
              />
            </div>
          </div>
          <hr
            style={{
              margin: "4px 0 4px 0",
              border: "none",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              height: "2px",
            }}
          />
          {product === null ? (
            <ContentLoader
              speed={1.5}
              width="100%"
              height="100%"
              viewBox="0 0 400 60"
              backgroundColor="var(--color-scheme-primary)"
              foregroundColor="var(--color-scheme-secondary)"
            >
              <circle cx="30" cy="30" r="30" />
              <rect x="80" y="10" rx="4" ry="4" width="200" height="15" />
              <rect x="80" y="35" rx="3" ry="3" width="100" height="15" />
            </ContentLoader>
          ) : (
            <div className="user">
              <div className="avatar">
                <img src={product.user.profileImageUrl} alt="user" />
              </div>
              <div className="username">
                <span>
                  {product.user.firstName} {product.user.lastName}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color:
                      product.user.verified === "Verified"
                        ? "var(--success-color)"
                        : "grey",
                  }}
                >
                  {product.user.verified === "Verified"
                    ? "Verified"
                    : "Not Verified"}
                </span>
              </div>
              {product.user.verified === "Verified" ? (
                <TickCircle
                  size={20}
                  color="lightgreen"
                  style={{
                    marginLeft: "auto",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <InfoCircle
                  size={20}
                  color="grey"
                  style={{
                    marginLeft: "auto",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          )}
          <hr
            style={{
              margin: "4px 0 0 0",
              border: "none",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              height: "2px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              color: "rgba(126, 126, 126, 0.8)",
              fontSize: "13px",
            }}
          >
            {product === null ? (
              <ContentLoader
                speed={1.5}
                width="100%"
                height="100%"
                viewBox="0 0 400 80"
                backgroundColor="var(--color-scheme-primary)"
                foregroundColor="var(--color-scheme-secondary)"
              >
                <rect x="0" y="0" rx="4" ry="4" width="20%" height="20px" />
                <rect x="0" y="30" rx="4" ry="4" width="25%" height="20px" />
                <rect x="0" y="60" rx="4" ry="4" width="20%" height="20px" />
                <rect x="150" y="0" rx="4" ry="4" width="25%" height="20px" />
                <rect x="150" y="30" rx="4" ry="4" width="30%" height="20px" />
                <rect x="150" y="60" rx="4" ry="4" width="20%" height="20px" />
              </ContentLoader>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  color: "rgba(126, 126, 126, 0.8)",
                  fontSize: "13px",
                }}
              >
                <table>
                  <tbody>
                    <tr>
                      <td style={{ width: "32%" }}>
                        <i>Posted On:</i>
                      </td>
                      <td>
                        <i>{product.createdAt.slice(0, 10)}</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i>Original Price:</i>
                      </td>
                      <td>
                        <i>Rs.{product.price.toLocaleString()}</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i>Last Bid On:</i>
                      </td>
                      <td>
                        <i>
                          {product.bids.length > 0
                            ? product.bids[0].createdAt.slice(0, 10)
                            : "None"}
                        </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="item-details">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {product === null ? (
                <ContentLoader
                  speed={1.5}
                  width="200"
                  height="36"
                  viewBox="0 0 400 72"
                  backgroundColor="var(--color-scheme-primary)"
                  foregroundColor="var(--color-scheme-secondary)"
                >
                  <rect
                    x="0"
                    y="0"
                    rx="16"
                    ry="16"
                    width="100%"
                    height="100%"
                  />
                </ContentLoader>
              ) : (
                <h1 className="label" style={{ margin: "0" }}>
                  {product.name}
                </h1>
              )}

              <div className="small-details">
                {product === null ? (
                  <ContentLoader
                    speed={1.5}
                    width="100%"
                    height="20"
                    viewBox="0 0 300 20"
                    backgroundColor="var(--color-scheme-primary)"
                    foregroundColor="var(--color-scheme-secondary)"
                  >
                    <rect x="0" y="0" rx="4" ry="4" width="60" height="100%" />
                    <rect x="70" y="0" rx="4" ry="4" width="80" height="100%" />
                    <rect
                      x="160"
                      y="0"
                      rx="4"
                      ry="4"
                      width="80"
                      height="100%"
                    />
                  </ContentLoader>
                ) : (
                  <>
                    <span className="detail">
                      <Eye color="grey" size={14} /> {product.views}
                    </span>
                    <span className="detail">
                      Bid Count: {product.bids.length}
                    </span>
                    <span className="detail">
                      <TimeDisplay
                        timestamp={
                          product.highestBidUpdatedAt
                            ? new Date(product.highestBidUpdatedAt).getTime() +
                              21600000
                            : new Date(product.createdAt).getTime() +
                              21600000 * 4
                        }
                      />
                    </span>
                  </>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              {product === null ? (
                <ContentLoader
                  speed={1.5}
                  width="110"
                  height="30"
                  viewBox="0 0 110 30"
                  backgroundColor="var(--color-scheme-primary)"
                  foregroundColor="var(--color-scheme-secondary)"
                >
                  <circle cx="15" cy="15" r="15" width="100%" height="100%" />
                  <circle cx="55" cy="15" r="15" width="100%" height="100%" />
                  <circle cx="95" cy="15" r="15" width="100%" height="100%" />
                </ContentLoader>
              ) : (
                <>
                  <SaveButton itemId={product.id} strokeWidth={1.5} />
                  <Share
                    size={22}
                    color="var(--text-color)"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      openShareModal({
                        itemId: product.id,
                        imageLink: product.images[0],
                        title: product.name,
                        price:
                          product.bids.length > 0
                            ? product.bids[0].price
                            : product.price,
                      });
                    }}
                  />
                  <Flag
                    size={23}
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      openReportModal({
                        itemId: product.id,
                        imageLink: product.images[0],
                        title: product.name,
                        price:
                          product.bids.length > 0
                            ? product.bids[0].price
                            : product.price,
                      });
                    }}
                  />
                </>
              )}
            </div>
          </div>

          <hr
            style={{
              margin: "24px 0 0 0",
              border: "none",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              height: "2px",
            }}
          />

          {product === null ? (
            <ContentLoader
              speed={1.5}
              width="100%"
              height="156"
              backgroundColor="var(--color-scheme-primary)"
              foregroundColor="var(--color-scheme-secondary)"
            >
              <rect x="0" y="30" rx="10" ry="10" width="150" height="30" />
              <rect x="0" y="70" rx="4" ry="4" width="100%" height="14" />
              <rect x="0" y="94" rx="4" ry="4" width="100%" height="14" />
              <rect x="0" y="118" rx="4" ry="4" width="100%" height="14" />
              <rect x="0" y="142" rx="4" ry="4" width="50%" height="14" />
            </ContentLoader>
          ) : (
            <>
              <h2 className="label">Description</h2>
              <p
                style={{
                  margin: "0",
                  color: "var(--text-color)",
                  fontSize: "16px",
                }}
              >
                {product.description}
              </p>
            </>
          )}

          <hr
            style={{
              margin: "24px 0 0 0",
              border: "none",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              height: "2px",
            }}
          />

          {product === null ? (
            <ContentLoader
              speed={1.5}
              width="100%"
              height="240"
              backgroundColor="var(--color-scheme-primary)"
              foregroundColor="var(--color-scheme-secondary)"
            >
              <rect x="0" y="30" rx="10" ry="10" width="150" height="30" />
              <rect x="0" y="70" rx="10" ry="10" width="100%" height="170" />
            </ContentLoader>
          ) : (
            <>
              <h2 className="label">Specifications</h2>
              <div
                className="input-container"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "var(--color-scheme-primary)",
                  border: "2px solid transparent",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    borderSpacing: "0",
                    border: `1px solid var(--color-scheme-secondary)`,
                    borderRadius: "10px",
                  }}
                >
                  <tbody>
                    {Object.entries(product.specifications)
                      .concat([["Condition", product.condition]])
                      .map(([key, value], index) => (
                        <tr key={index}>
                          <td
                            style={{
                              minWidth: "30%",
                              padding: "10px",
                              color: "var(--text-color)",
                              border: "1px solid var(--color-scheme-secondary)",
                              margin: "0",
                              borderTopLeftRadius: `${
                                index === 0 ? "8px" : "0"
                              }`,
                              borderBottomLeftRadius: `${
                                index === product.specifications.length - 1
                                  ? "8px"
                                  : "0"
                              }`,
                            }}
                          >
                            {key}
                          </td>
                          <td
                            style={{
                              width: "70%",
                              border: "1px solid var(--color-scheme-secondary)",
                              color:
                                value !== "" ? "var(--text-color)" : "grey",
                              margin: "0",
                              padding: "10px",
                              borderTopRightRadius: `${
                                index === 0 ? "8px" : "0"
                              }`,
                              borderBottomRightRadius: `${
                                index === product.specifications.length - 1
                                  ? "8px"
                                  : "0"
                              }`,
                              overflow: "hidden",
                              fontWeight: value !== "" ? "600" : "300",
                            }}
                          >
                            {value !== "" ? value : <i>Not Specified</i>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <hr
          style={{
            width: "2px",
            margin: "0 30px 0 0",
            border: "none",
            backgroundColor: "rgba(128, 128, 128, 0.5)",
          }}
        />
        <div
          className="bid-keyboard"
          style={{
            width: "26%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {product === null ? (
            <ContentLoader
              speed={1.5}
              width="100%"
              height="100%"
              viewBox="0 0 400 600"
              backgroundColor="var(--color-scheme-primary)"
              foregroundColor="var(--color-scheme-secondary)"
            >
              <rect
                x="calc(100% - 325px)"
                y="0"
                rx="8"
                ry="8"
                width="250"
                height="50"
              />
              <rect x="0" y="70" rx="16" ry="16" width="100%" height="70" />
              <rect
                x="0"
                y="155"
                rx="20"
                ry="20"
                width="100%"
                height="calc(100% - 230px)"
              />
              <rect
                x="0"
                y="calc(100% - 60px)"
                rx="16"
                ry="16"
                width="100%"
                height="60"
              />
            </ContentLoader>
          ) : (
            <>
              {product.bids.length > 0 ? (
                <>
                  <div
                    className="info"
                    style={{
                      width: "100%",
                      flexDirection: "column",
                      padding: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <h2
                      className="label"
                      style={{ margin: "0 0 4px 0", fontSize: "24px" }}
                    >
                      Bid History
                    </h2>
                    <hr
                      style={{
                        width: "100%",
                        margin: "8px 0 14px 0",
                        border: "none",
                        height: "2px",
                        backgroundColor: "var(--primary-color)",
                      }}
                    />
                    {product.bids.map((bid, index) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom:
                            index !== product.bids.length - 1 && "10px",
                          width: "100%",
                          color: "var(--text-color)",
                          fontSize: index === 0 ? "18px" : "14px",
                          fontWeight: index === 0 ? "700" : "400",
                        }}
                        key={index}
                      >
                        <span>
                          {index + 1}. {bid.firstName}{" "}
                          {user.id === bid.id && "(You)"}
                        </span>
                        <span>Rs.{bid.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {product.bids[0].id !== user.id && (
                    <>
                      <hr
                        style={{
                          margin: "20px 0 0 0",
                          border: "none",
                          backgroundColor: "rgba(128, 128, 128, 0.5)",
                          height: "2px",
                          width: "100%",
                        }}
                      />
                      <Calculator product={product} />
                    </>
                  )}
                </>
              ) : (
                <Calculator product={product} />
              )}
            </>
          )}
        </div>
      </div>
      {product && (
        <ImageViewer
          images={product.images}
          activeImage={activeImage}
          onChange={setActiveImage}
        />
      )}
      <Report />
      <ShareModal />
    </>
  );
};

export default ItemDetails;
