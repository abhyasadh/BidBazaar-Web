import React, { useState } from "react";
import { toast } from "react-toastify";
import { apis, useProtectedApi } from "../../../APIs/api";
import CustomButton from "../../../components/CustomButton";

const Calculator = ({ product }) => {

  const [amount, setAmount] = useState(
    product.bids.length > 0
      ? product.bids[0].price + product.raise
      : product.price + product.raise
  );

  const {protectedPost} = useProtectedApi();

  const placeBid = async () => {
    if (amount < product.price + product.raise) {
      toast.error(
        `Amount should be at least Rs. ${(
          Math.max(
            product.price,
            product.bids.length > 0 ? product.bids[0].price : 0
          ) + product.raise
        ).toLocaleString()}`
      );
      return;
    }

    try {
      const res = await protectedPost(apis.placeBid, {
        productId: product.id,
        price: amount,
      });
      if (res.data.success === true) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

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

  return (
    <>
      <h1 className="label" style={{ margin: "6px 0 6px 0", fontSize: "28px", fontWeight: "600" }}>
        Send Offer
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
        onClick={() => {
          placeBid();
        }}
        type={"button"}
        style={{ marginTop: "8px" }}
      />
    </>
  );
};

export default Calculator;
