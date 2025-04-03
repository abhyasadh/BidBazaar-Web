import {
  ArrowRight2,
  ArrowLeft2,
  InfoCircle,
  Eye,
  TickCircle,
  Share,
  Flag,
} from "iconsax-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apis, useProtectedApi } from "../../../APIs/api";
import { toast } from "react-toastify";
import { useFunctions } from "../../../contexts/CommonFunctions";
import CustomButton from "../../../components/CustomButton";
import SaveButton from "../components/SaveButton";
import ImageViewer from "../components/ImageViewer";
import { useShareReportModal } from "../context/ShareAndReportContext";
import Report from "../components/Report";
import ShareModal from "../components/Share";

const ItemDetails = () => {
  const { protectedGet } = useProtectedApi();
  const { openReportModal, openShareModal } = useShareReportModal();
  const { formatDuration } = useFunctions();
  const { itemId } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const [amount, setAmount] = useState(0);

  // const placeBid = async () => {
  //   if (amount < product.price + product.raise) {
  //     alert(`Amount should be at least Rs. ${product.price + product.raise}`);
  //     return;
  //   }

  //   try {
  //   await runTransaction(db, async (transaction) => {
  //     const itemSnap = await transaction.get(itemRef);
  //     if (!itemSnap.exists()) throw new Error("Item does not exist");

  //     const itemData = itemSnap.data();
  //     const updatedBids = [...(itemData.bid_prices || []), amount];
  //     const updatedUsers = [...(itemData.bid_users || []), userId];

  //     transaction.update(itemRef, {
  //       bid_prices: updatedBids,
  //       bid_users: updatedUsers,
  //       bid_count: (itemData.bid_count || 0) + 1,
  //     });
  //   });
  //     alert("Bid placed successfully!");
  //   } catch (error) {
  //     console.error("Error placing bid:", error);
  //     alert("Failed to place bid.");
  //   }
  // };

  const formatCompactCurrency = (value) => {
    return `Rs. ${new Intl.NumberFormat("en-US", {
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  const handlePress = (index) => {
    let newAmount = amount;

    switch (index) {
      case 0:
      case 1:
      case 2:
        newAmount = newAmount * 10 + (index + 1);
        break;
      case 4:
      case 5:
      case 6:
        newAmount = newAmount * 10 + index;
        break;
      case 8:
      case 9:
      case 10:
        newAmount = newAmount * 10 + (index - 1);
        break;
      case 12:
      case 13:
        newAmount = newAmount * (index === 13 ? 100 : 10);
        break;
      case 14:
        newAmount = Math.floor(newAmount / 10);
        break;
      case 3:
      case 15:
        newAmount += Math.ceil(product.raise / (index === 3 ? 8 : 1));
        break;
      case 7:
      case 11:
        newAmount += Math.ceil(product.raise / (index === 7 ? 4 : 2));
        break;
      default:
        return;
    }

    setAmount(newAmount);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await protectedGet(`${apis.getProductById}/${itemId}`);
        setProduct(res.data.product);
        setAmount(
          res.data.product.highestBid
            ? res.data.product.highestBid + res.data.product.raise
            : res.data.product.price + res.data.product.raise
        );
      } catch (error) {
        toast.error("Failed to fetch categories!");
      }
    };
    fetchProductDetails();
  }, [protectedGet, itemId]);

  return (
    <>
      {product && (
        <div className="item-page-container">
          <div className="item-images">
            <div className="image-view">
              <img
                src={product.images[activeImage]}
                alt="item"
                onClick={() => {
                  document.querySelector("body").style.overflow = "hidden";
                  document.getElementById("image-viewer").showModal();
                }}
              />
            </div>
            <div className="image-list-container">
              <div className="arrow">
                <ArrowLeft2
                  color="grey"
                  size={20}
                  onClick={() => {
                    setActiveImage(Math.max(activeImage - 1, 0));
                  }}
                />
              </div>
              <div className="image-list">
                {product.images.map((image, index) => (
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
                    color: product.user.verified
                      ? "var(--success-color)"
                      : "grey",
                  }}
                >
                  {product.user.verified ? "Verified" : "Not Verified"}
                </span>
              </div>
              {product.user.verified ? (
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
                        {product.highestBidUpdatedAt
                          ? product.highestBidUpdatedAt.slice(0, 10)
                          : "None"}
                      </i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="item-details">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h1 className="label" style={{ margin: "0" }}>
                  {product.name}
                </h1>
                <div className="small-details">
                  <span className="detail">
                    <Eye color="grey" size={14} /> {product.views}
                  </span>
                  <span className="detail">
                    Bid Count: {product.bidCount ?? 0}
                  </span>
                  <span className="detail">
                    {formatDuration(
                      product.highestBidUpdatedAt
                        ? new Date(product.highestBidUpdatedAt).getTime() +
                            21600000
                        : new Date(product.createdAt).getTime() + 21600000 * 4
                    )}
                  </span>
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
                      price: product.price,
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
                      price: product.price,
                    });
                  }}
                />
              </div>
            </div>

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
            <hr
              style={{
                margin: "24px 0 0 0",
                border: "none",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                height: "2px",
              }}
            />
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
                            borderTopLeftRadius: `${index === 0 ? "8px" : "0"}`,
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
                            color: value !== "" ? "var(--text-color)" : "grey",
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
            <h1 className="label" style={{ margin: "0 0 10px 0" }}>
              Send an Offer
            </h1>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--color-scheme-primary)",
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--text-color)",
                borderRadius: "16px",
              }}
            >
              <input
                value={"Rs. " + amount.toLocaleString()}
                onChange={(e) => {
                  if (Number.isInteger(Number(e.target.value)))
                    setAmount(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "12px 8px",
                  boxSizing: "border-box",
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "24px",
                  fontWeight: "600",
                  fontFamily: "Blinker",
                  color: "var(--text-color)",
                  type: "number",
                  textAlign: "right",
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: "var(--color-scheme-primary)",
                borderRadius: "16px",
                height: "fit-content",
                flexDirection: "column",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2px",
                padding: "2px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              {[
                1,
                2,
                3,
                "+" + formatCompactCurrency(Math.ceil(product.raise / 8)),
                4,
                5,
                6,
                "+" + formatCompactCurrency(Math.ceil(product.raise / 4)),
                7,
                8,
                9,
                "+" + formatCompactCurrency(Math.ceil(product.raise / 2)),
                0,
                "00",
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.142 20C8.91458 20 7.80085 20 6.87114 19.4986C5.94144 18.9971 5.35117 18.0781 4.17061 16.24L3.48981 15.18C2.4966 13.6336 2 12.8604 2 12C2 11.1396 2.4966 10.3664 3.48981 8.82001L4.17061 7.76001C5.35117 5.92191 5.94144 5.00286 6.87114 4.50143C7.80085 4 8.91458 4 11.142 4L13.779 4C17.6544 4 19.5921 4 20.7961 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.7961 18.8284C19.5921 20 17.6544 20 13.779 20H11.142Z"
                    stroke="var(--text-color)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15.5 9.50002L10.5 14.5M10.5 9.5L15.5 14.5"
                    stroke="var(--text-color)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>,
                "+" + formatCompactCurrency(product.raise),
              ].map((key, index) => (
                <button
                  key={index}
                  style={{
                    aspectRatio: 6 / 5,
                    backgroundColor:
                      (index + 1) % 4 === 0
                        ? "rgba(126, 126, 126, 0.3)"
                        : "transparent",
                    border: "none",
                    fontSize: (index + 1) % 4 === 0 ? "12px" : "22px",
                    color: "var(--text-color)",
                    cursor: "pointer",
                    fontFamily: "Blinker",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius:
                      index === 3
                        ? "4px 15px 4px 4px"
                        : index === 15
                        ? "4px 4px 15px 4px"
                        : "4px",
                  }}
                  onClick={() => {
                    handlePress(index);
                  }}
                >
                  {key}
                </button>
              ))}
            </div>

            <CustomButton
              text={"CONFIRM BID"}
              onClick={() => {}}
              type={"button"}
              style={{ marginTop: "8px" }}
            />
          </div>
        </div>
      )}
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
