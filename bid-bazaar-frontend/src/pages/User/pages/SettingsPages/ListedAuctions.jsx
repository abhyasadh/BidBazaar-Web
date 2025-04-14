import React, { useEffect, useState } from "react";
import { apis, useProtectedApi } from "../../../../APIs/api";
import { toast } from "react-toastify";
import Item from "../../components/Item";
import ItemLoader from "../../components/ItemLoader";
import { useFunctions } from "../../../../contexts/CommonFunctions";
import ContentLoader from "react-content-loader";
import Empty from "../../components/Empty";

const ListedAuctions = () => {
  const { formatDuration } = useFunctions();
  const { protectedGet } = useProtectedApi();

  const [products, setProducts] = useState(null);
  const [active, setActive] = useState([]);
  const [ended, setEnded] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await protectedGet(apis.getOwnProducts);
        const allProducts = res.data.products;
        setProducts(allProducts);
      } catch (error) {
        toast.error("Failed to fetch your listed auctions!");
      }
    };

    fetchProducts();
  }, [protectedGet]);

  useEffect(() => {
    const newActive = [];
    const newEnded = [];

    products && products.forEach((product) => {
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
  }, [formatDuration, products]);

  if (products === null) {
    return (
      <>
        <h1 className="label">Listed Auctions</h1>
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

  if (products.length === 0) {
    return <Empty height={"calc(100vh - 50px)"} />;
  }

  return (
    <>
      <h1 className="label">Listed Auctions</h1>
      {active.length > 0 && (
        <>
          <h2 className="label">Active</h2>
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
          <h2 className="label">Ended</h2>
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
          </div>
        </>
      )}
    </>
  );
};

export default ListedAuctions;
