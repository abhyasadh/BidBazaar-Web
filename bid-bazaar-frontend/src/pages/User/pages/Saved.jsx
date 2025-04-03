import React, { useEffect, useState } from "react";
import { useSaved } from "../context/SavedContext";
import Item from "../components/Item";
import { useFunctions } from "../../../contexts/CommonFunctions";

const Saved = () => {
  const { formatDuration } = useFunctions();
  const { saved, setUpdate } = useSaved();

  const [active, setActive] = useState([]);
  const [ended, setEnded] = useState([]);

  useEffect(() => {
    const newActive = [];
    const newEnded = [];

    saved.forEach((product) => {
      const time = formatDuration(
        product.highestBidUpdatedAt
          ? new Date(product.highestBidUpdatedAt).getTime() + 21600000
          : new Date(product.createdAt).getTime() + 21600000 * 4
      );

      if (time.startsWith("Ended")) {
        newEnded.push(product);
      } else {
        newActive.push(product);
      }
    });

    setActive(newActive);
    setEnded(newEnded);
  }, [saved, formatDuration]);

  useEffect(() => {
    setUpdate((prev) => prev + 1);
  }, [setUpdate]);

  return saved.length > 0 ? (
    <>
      {active.length > 0 && (
        <>
          <h2 className="label">Active Auctions</h2>
          <div className="items-container">
            {active.map((product) => (
              <Item
                key={product.id}
                itemId={product.id}
                imageLink={product.image}
                title={product.name}
                price={product.highestBid ?? product.price}
                bidCount={product.bidCount ?? 0}
                endsIn={
                  product.highestBidUpdatedAt
                    ? new Date(product.highestBidUpdatedAt).getTime() + 21600000
                    : new Date(product.createdAt).getTime() + 21600000 * 4
                }
              />
            ))}
            ;
          </div>
        </>
      )}

      {active.length > 0 && ended.length > 0 && (
        <hr
          style={{
            padding: "0px",
            margin: "30px 0 10px 0",
            border: "none",
            backgroundColor: "rgba(128, 128, 128, 0.5)",
            height: "4px",
            borderRadius: "2px",
          }}
        />
      )}
      {ended.length > 0 && (
        <>
          <h2 className="label">Too Late!</h2>
          <div className="items-container">
            {ended.map((product) => (
              <Item
                key={product.id}
                itemId={product.id}
                imageLink={product.image}
                title={product.name}
                price={product.highestBid ?? product.price}
                bidCount={product.bidCount ?? 0}
                endsIn={
                  product.highestBidUpdatedAt
                    ? new Date(product.highestBidUpdatedAt).getTime() + 21600000
                    : new Date(product.createdAt).getTime() + 21600000 * 4
                }
              />
            ))}
            ;
          </div>
        </>
      )}
    </>
  ) : (
    <>
      <h1 style={{ color: "var(--text-color)" }}>Nothing here!</h1>
    </>
  );
};

export default Saved;
