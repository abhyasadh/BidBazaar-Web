import React, { useEffect } from "react";
import { useItems } from "../context/ItemsContext";
import Item from "../components/Item";
import ItemLoader from "../components/ItemLoader";
import ContentLoader from "react-content-loader";
import Empty from "../components/Empty";

const Saved = () => {
  const { saved, setUpdate } = useItems();

  useEffect(() => {
    setUpdate((prev) => prev + 1);
  }, [setUpdate]);

  if (saved === null) {
    return (
      <>
        <div style={{ width: "100px", height: "46px" }}>
          <ContentLoader
            speed={1.5}
            width="150"
            height="36"
            viewBox="0 0 150 36"
            backgroundColor="var(--color-scheme-primary)"
            foregroundColor="var(--color-scheme-secondary)"
          >
            <rect x="0" y="0" rx="10" ry="10" width="150" height="32" />
          </ContentLoader>
        </div>
        <div className="items-container">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ width: "100%", aspectRatio: "1" }}>
              <ItemLoader />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (saved.length === 0) {
    return <Empty height={"calc(100vh - 122px)"} />;
  }

  return (
    <>
      {saved.length > 0 && (
        <>
          <h2 className="label">Saved Auctions</h2>
          <div className="items-container">
            {saved.map((product) => (
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
          </div>
        </>
      )}
    </>
  );
};

export default Saved;
