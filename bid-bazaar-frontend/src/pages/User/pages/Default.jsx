import React from "react";
import Item from "../components/Item";
import ContentLoader from "react-content-loader";
import ItemLoader from "../components/ItemLoader";
import Empty from "../components/Empty";
import { useItems } from "../context/ItemsContext";

const Default = () => {
  const { products } = useItems();

  return (
    <>
      {products === null ? (
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
      ) : products.length === 0 ? (
        <Empty height={"calc(100vh - 122px)"}/>
      ) : (
        products && products.length > 0 && <h2 className="label">Trending</h2>
      )}
      <div className="items-container">
        {products === null ? (
          Array.from({ length: 24 }).map((_, index) => (
            <div key={index} style={{ width: "100%", aspectRatio: "1" }}>
              <ItemLoader key={index} />
            </div>
          ))
        ) : (
          products.map((product) => (
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
          ))
        )}
      </div>
    </>
  );
};

export default Default;
